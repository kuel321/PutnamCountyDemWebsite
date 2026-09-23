import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import { nestedDocsPlugin } from '@payloadcms/plugin-nested-docs'
import { redirectsPlugin } from '@payloadcms/plugin-redirects'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { searchPlugin } from '@payloadcms/plugin-search'
import { CollectionBeforeValidateHook, Plugin } from 'payload'
import { revalidateRedirects } from '@/hooks/revalidateRedirects'
import { GenerateDescription, GenerateImage, GenerateTitle, GenerateURL } from '@payloadcms/plugin-seo/types'
import { FixedToolbarFeature, HeadingFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import { convertLexicalToPlaintext } from '@payloadcms/richtext-lexical/plaintext'
import { searchFields } from '@/search/fieldOverrides'
import { beforeSyncWithSearch } from '@/search/beforeSync'

import { Page, Post } from '@/payload-types'
import { getServerSideURL } from '@/utilities/getURL'
import { autoDescriptionFromBlocks, autoImageFromBlocks } from '@/utilities/autoSEO'
import { excerpt } from '@/utilities/textExcerpt'

const generateTitle: GenerateTitle<Post | Page> = ({ doc }) => {
  return doc?.title
    ? `${doc.title} | Putnam County Democratic Party`
    : 'Putnam County Democratic Party'
}

const generateURL: GenerateURL<Post | Page> = ({ doc }) => {
  const url = getServerSideURL()

  return doc?.slug ? `${url}/${doc.slug}` : url
}

// Powers the "auto-generate" wand next to the Meta Description/Image fields
// in the admin SEO tab — most admins won't click it (the frontend already
// falls back to this same logic on its own), but it should still work.
const generateDescription: GenerateDescription<Post | Page> = ({ doc }) => {
  if (doc && 'layout' in doc) {
    return autoDescriptionFromBlocks(doc.layout) ?? ''
  }
  if (doc && 'content' in doc && doc.content) {
    return excerpt(convertLexicalToPlaintext({ data: doc.content }).replace(/\s+/g, ' ').trim(), 155)
  }
  return ''
}

const generateImage: GenerateImage<Post | Page> = ({ doc }) => {
  if (doc && 'layout' in doc) {
    const image = autoImageFromBlocks(doc.layout)
    if (image) return { id: image.id }
  }
  if (doc && 'heroImage' in doc && doc.heroImage && typeof doc.heroImage === 'object') {
    return { id: doc.heroImage.id }
  }
  return ''
}

// FormRenderer (src/blocks/Form/FormRenderer.tsx) always submits these two
// extra fields alongside whatever the admin actually configured on the
// form. Reject obvious bot submissions, then strip both before saving so
// real submissions stay clean.
const rejectSpamSubmissions: CollectionBeforeValidateHook = async ({ data }) => {
  const submissionData = data?.submissionData as { field: string; value: string }[] | undefined
  if (!submissionData) return data

  const honeypot = submissionData.find((f) => f.field === '_hp')?.value
  if (honeypot) {
    throw new Error('Spam detected.')
  }

  // Inert until RECAPTCHA_API_KEY is actually set — see Recaptcha.tsx.
  // This is reCAPTCHA Enterprise (score-based/v3), not classic reCAPTCHA —
  // verification goes through Google Cloud's Assessment API (project +
  // API key), not the old shared-secret siteverify endpoint.
  if (process.env.RECAPTCHA_API_KEY) {
    const token = submissionData.find((f) => f.field === '_recaptcha')?.value
    if (!token) {
      throw new Error('reCAPTCHA verification failed.')
    }

    const projectId = process.env.RECAPTCHA_PROJECT_ID || 'wv-cam-auth'
    const assessRes = await fetch(
      `https://recaptchaenterprise.googleapis.com/v1/projects/${projectId}/assessments?key=${process.env.RECAPTCHA_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: {
            token,
            siteKey: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
            expectedAction: 'submit',
          },
        }),
      },
    )
    const assessData = await assessRes.json()

    const valid = assessData?.tokenProperties?.valid
    const actionMatches = assessData?.tokenProperties?.action === 'submit'
    // 0.5 is Google's own suggested starting threshold (1.0 = very likely
    // legitimate, 0.0 = very likely a bot) — worth revisiting once there's
    // real submission volume to calibrate against.
    const score = assessData?.riskAnalysis?.score
    const scoreOk = typeof score === 'number' && score >= 0.5

    if (!valid || !actionMatches || !scoreOk) {
      throw new Error('reCAPTCHA verification failed.')
    }
  }

  return {
    ...data,
    submissionData: submissionData.filter((f) => f.field !== '_hp' && f.field !== '_recaptcha'),
  }
}

export const plugins: Plugin[] = [
  redirectsPlugin({
    collections: ['pages', 'posts'],
    overrides: {
      admin: {
        group: 'Admin',
      },
      // @ts-expect-error - This is a valid override, mapped fields don't resolve to the same type
      fields: ({ defaultFields }) => {
        return defaultFields.map((field) => {
          if ('name' in field && field.name === 'from') {
            return {
              ...field,
              admin: {
                description: 'You will need to rebuild the website when changing this field.',
              },
            }
          }
          return field
        })
      },
      hooks: {
        afterChange: [revalidateRedirects],
      },
    },
  }),
  nestedDocsPlugin({
    collections: ['categories'],
    generateURL: (docs) => docs.reduce((url, doc) => `${url}/${doc.slug}`, ''),
  }),
  seoPlugin({
    generateTitle,
    generateURL,
    generateDescription,
    generateImage,
  }),
  formBuilderPlugin({
    fields: {
      payment: false,
    },
    formOverrides: {
      admin: {
        group: 'Forms',
      },
      fields: ({ defaultFields }) => {
        return defaultFields.map((field) => {
          if ('name' in field && field.name === 'confirmationMessage') {
            return {
              ...field,
              editor: lexicalEditor({
                features: ({ rootFeatures }) => {
                  return [
                    ...rootFeatures,
                    FixedToolbarFeature(),
                    HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
                  ]
                },
              }),
            }
          }
          return field
        })
      },
    },
    formSubmissionOverrides: {
      admin: {
        group: 'Forms',
      },
      hooks: {
        beforeValidate: [rejectSpamSubmissions],
      },
    },
  }),
  searchPlugin({
    collections: ['posts'],
    beforeSync: beforeSyncWithSearch,
    searchOverrides: {
      admin: {
        group: 'Admin',
      },
      fields: ({ defaultFields }) => {
        return [...defaultFields, ...searchFields]
      },
    },
  }),
]
