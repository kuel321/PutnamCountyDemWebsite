import type { Field, GroupField } from 'payload'

import deepMerge from '@/utilities/deepMerge'
import { link } from './link'

type NavItemType = (options?: { overrides?: Partial<GroupField> }) => Field

export const navItem: NavItemType = ({ overrides = {} } = {}) => {
  const navItemResult: GroupField = {
    name: 'navItem',
    type: 'group',
    admin: {
      hideGutter: true,
    },
    fields: [
      {
        type: 'row',
        fields: [
          {
            name: 'label',
            type: 'text',
            required: true,
            admin: {
              width: '50%',
            },
          },
          {
            name: 'type',
            type: 'radio',
            admin: {
              layout: 'horizontal',
              width: '50%',
            },
            defaultValue: 'link',
            options: [
              {
                label: 'Direct Link',
                value: 'link',
              },
              {
                label: 'Dropdown',
                value: 'dropdown',
              },
            ],
          },
        ],
      },
      link({
        disableLabel: true,
        appearances: false,
        overrides: {
          admin: {
            condition: (_, siblingData) => siblingData?.type === 'link',
          },
        },
      }),
      {
        name: 'subLinks',
        type: 'array',
        admin: {
          condition: (_, siblingData) => siblingData?.type === 'dropdown',
          initCollapsed: true,
        },
        fields: [
          link({
            appearances: false,
          }),
        ],
      },
    ],
  }

  return deepMerge(navItemResult, overrides)
}
