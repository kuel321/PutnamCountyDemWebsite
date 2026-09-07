import type { CollectionAfterChangeHook } from 'payload'

export const publishOnApproval: CollectionAfterChangeHook = async ({
  doc,
  previousDoc,
  req,
  operation,
}) => {
  if (operation !== 'update') return doc
  if (doc.status !== 'approved' || previousDoc?.status === 'approved') return doc

  const fileId = typeof doc.file === 'object' && doc.file ? doc.file.id : doc.file

  const published = await req.payload.create({
    collection: 'meeting-minutes',
    data: {
      title: doc.title,
      date: doc.date,
      meeting: doc.meeting ?? undefined,
      file: fileId,
    },
  })

  await req.payload.update({
    id: doc.id,
    collection: 'minutes-submissions',
    data: {
      publishedMinutes: published.id,
    },
  })

  return doc
}
