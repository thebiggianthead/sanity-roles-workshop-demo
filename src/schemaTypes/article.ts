import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'article',
  title: 'Article',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'createdBy',
      title: 'Created By',
      type: 'string',
      initialValue: (param, context) => context.currentUser?.id || '',
      readOnly: (context) =>
        !context.currentUser?.roles.flatMap((r) => r.name).includes('administrator'),
    }),
  ],
})
