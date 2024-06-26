import {visionTool} from '@sanity/vision'
import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {unsplashImageAsset} from 'sanity-plugin-asset-source-unsplash'
import {media} from 'sanity-plugin-media'

import {structure} from './src/desk/structure'
import {schemaTypes} from './src/schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'Roles Workshop',

  projectId: 'uvxetc8v',
  dataset: 'production',

  plugins: [
    structureTool({
      structure,
    }),
    visionTool(),
    unsplashImageAsset(),
    media(),
  ],

  document: {
    newDocumentOptions: (prev, context) => {
      const roles = context?.currentUser?.roles.map((r) => r.name)
      if (roles?.includes('administrator')) return prev
      return prev.filter((templateItem) => templateItem.templateId !== 'article')
    },
  },

  schema: {
    types: schemaTypes,

    templates: (prev, context) => {
      const {currentUser} = context

      return [
        ...prev,
        {
          id: 'offer-by-store',
          title: 'Offer by store',
          description: 'Offer from a specific store',
          schemaType: 'offer',
          parameters: [
            {name: 'store', type: 'string'},
            {name: 'createdBy', type: 'string'},
          ],
          value: (params: {store: string}) => ({
            store: params.store,
            createdBy: currentUser?.id,
          }),
        },
        {
          id: 'article-with-author',
          title: 'Article with author',
          schemaType: 'article',
          parameters: [{name: 'createdBy', type: 'string'}],
          value: () => ({
            _type: 'article',
            createdBy: currentUser?.id,
          }),
        },
      ]
    },
  },
})
