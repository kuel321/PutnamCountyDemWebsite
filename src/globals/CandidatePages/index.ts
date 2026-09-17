import type { GlobalConfig } from 'payload'

import { anyone } from '../../access/anyone'
import { authenticated } from '../../access/authenticated'
import { Content } from '@/blocks/Content/config'
import { MediaContent } from '@/blocks/MediaContent/config'
import { MediaGrid } from '@/blocks/MediaGrid/config'
import { FindDistrict } from '@/blocks/FindDistrict/config'

export const CandidatePages: GlobalConfig = {
  slug: 'candidatePages',
  label: 'Candidate Pages (All Candidates)',
  admin: {
    group: 'Candidates',
  },
  access: {
    // Anyone can read this — every public candidate profile page needs it to render.
    read: anyone,
    update: authenticated,
  },
  fields: [
    {
      name: 'layout',
      label: 'Blocks Shown on Every Candidate Page',
      type: 'blocks',
      blocks: [FindDistrict, Content, MediaContent, MediaGrid],
      admin: {
        initCollapsed: true,
        description:
          "Shown on every candidate's profile page (below their bio/photos/ads, above that candidate's own Additional Content Blocks). Use this for things like the district finder that should appear everywhere, instead of adding it to each candidate one by one.",
      },
    },
  ],
}
