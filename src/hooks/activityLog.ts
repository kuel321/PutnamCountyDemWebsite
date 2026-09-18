import type { CollectionConfig, GlobalConfig } from 'payload'

const SKIP_COLLECTION = 'activity-log'

function actorLabel(req: { user?: { name?: string | null; email?: string | null; id?: unknown } | null }): string {
  const user = req.user
  if (!user) return 'Someone'
  return user.name || user.email || `User #${user.id}`
}

function docLabel(doc: unknown): string {
  const d = doc as { title?: string; name?: string; id?: unknown } | null | undefined
  return d?.title || d?.name || (d?.id != null ? `#${d.id}` : 'item')
}

async function writeLogEntry(
  req: import('payload').PayloadRequest,
  data: {
    action: 'create' | 'update' | 'delete'
    area: string
    item: string
    summary: string
  },
) {
  if (!req.user) return // skip system/anonymous writes (e.g. a club member submitting minutes)

  try {
    await req.payload.create({
      collection: 'activity-log',
      data: {
        actor: { relationTo: req.user.collection as 'users' | 'club-members', value: req.user.id },
        ...data,
      },
    })
  } catch (err) {
    req.payload.logger.error({ err }, 'Failed to write activity log entry')
  }
}

/** Adds a simple "who did what, when" log entry to every collection's writes. */
export function withActivityLogging(collections: CollectionConfig[]): CollectionConfig[] {
  return collections.map((collection) => {
    if (collection.slug === SKIP_COLLECTION) return collection

    const label = collection.labels?.singular
    const area = typeof label === 'string' ? label : collection.slug

    return {
      ...collection,
      hooks: {
        ...collection.hooks,
        afterChange: [
          ...(collection.hooks?.afterChange ?? []),
          async ({ doc, req, operation }) => {
            // Payload's autosave (fires automatically every few seconds while
            // an editor has a draft open) hits this same afterChange hook —
            // only log real activity: an explicit Save/Publish click, or a
            // create. req.query.autosave is the same flag Payload's own
            // endpoints use to tell autosave apart from a real save.
            if (req.query?.autosave === true) return doc

            if (operation === 'create' || operation === 'update') {
              const item = docLabel(doc)
              await writeLogEntry(req, {
                action: operation,
                area,
                item,
                summary: `${actorLabel(req)} ${operation === 'create' ? 'created' : 'updated'} ${area}: ${item}`,
              })
            }
            return doc
          },
        ],
        afterDelete: [
          ...(collection.hooks?.afterDelete ?? []),
          async ({ doc, req }) => {
            const item = docLabel(doc)
            await writeLogEntry(req, {
              action: 'delete',
              area,
              item,
              summary: `${actorLabel(req)} deleted ${area}: ${item}`,
            })
            return doc
          },
        ],
      },
    }
  })
}

/** Same idea as withActivityLogging, but for site-wide globals (no create/delete, just updates). */
export function withGlobalActivityLogging(globals: GlobalConfig[]): GlobalConfig[] {
  return globals.map((global) => {
    const label = global.label
    const area = typeof label === 'string' ? label : global.slug

    return {
      ...global,
      hooks: {
        ...global.hooks,
        afterChange: [
          ...(global.hooks?.afterChange ?? []),
          async ({ doc, req }) => {
            await writeLogEntry(req, {
              action: 'update',
              area,
              item: area,
              summary: `${actorLabel(req)} updated ${area}`,
            })
            return doc
          },
        ],
      },
    }
  })
}
