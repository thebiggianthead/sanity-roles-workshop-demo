import {defineField, defineType} from 'sanity'

import StoreInput from '../components/storeInput'

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
        list: [
          {title: 'Store 1', value: 'store1'},
          {title: 'Store 2', value: 'store2'},
        ],
      },
      components: {
        input: StoreInput,
      },
    }),
    defineField({
      name: 'createdBy',
      title: 'Created By',
      type: 'string',
    }),
  ],
})
