import type { Block } from 'payload'

export const FindDistrict: Block = {
  slug: 'findDistrict',
  interfaceName: 'FindDistrictBlock',
  labels: {
    singular: 'Find Your District (Map)',
    plural: 'Find Your District (Map) Blocks',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      defaultValue: 'Find Your District',
    },
    {
      name: 'intro',
      type: 'text',
      label: 'Intro text',
      defaultValue:
        'Enter your home address to see your Magisterial, WV House, WV Senate, and US Congressional districts.',
    },
  ],
}
