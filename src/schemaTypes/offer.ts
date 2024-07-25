import {defineField, defineType} from 'sanity'

import StoreInput from '../components/StoreInput'
import {stores} from '../lib/constants'

export default defineType({
  name: 'offer',
  title: 'Offer',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
    }),
    defineField({
      name: 'store',
      title: 'Store',
      type: 'string',
      options: {
        list: stores.map((store) => {
          return {
            value: store.id,
            title: store.name,
          }
        }),
      },
      components: {
        input: StoreInput,
      },
    }),
    defineField({
      name: 'createdBy',
      title: 'Created By',
      type: 'string',
      readOnly: (context) =>
        !context.currentUser?.roles.flatMap((r) => r.name).includes('administrator'),
    }),
  ],
})
