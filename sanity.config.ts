import {visionTool} from '@sanity/vision'
import type {TemplateItem} from 'sanity'
import {defineConfig, userHasRole} from 'sanity'
import {structureTool} from 'sanity/structure'
import {unsplashImageAsset} from 'sanity-plugin-asset-source-unsplash'
import {media} from 'sanity-plugin-media'

import {stores} from './src/lib/constants'
import {schemaTypes} from './src/schemaTypes'
import {structure} from './src/structure'
import {noAccessTool} from './src/tools/noAccessTool'

const baseConfig = defineConfig({
  name: 'default',
  title: 'Roles Workshop',

  projectId: 'uvxetc8v',
  dataset: 'production',

  plugins: [
    visionTool(),
    unsplashImageAsset(),
    media(),
    {
      name: 'disable-media-tool',
      tools: (prev, {currentUser}) =>
        userHasRole(currentUser, 'article-editor')
          ? prev.filter((tool) => tool.name !== 'media')
          : prev,
    },
  ],

  document: {
    newDocumentOptions: (prev, {currentUser}) => {
      let removeTypes = ['media.tag', 'offer']

      const storeTemplates = stores.map((store) => {
        if (
          userHasRole(currentUser, `${store.id}-manager`) ||
          userHasRole(currentUser, 'administrator')
        ) {
          return {
            id: `${store.id}-offer`,
            templateId: 'offer-by-store',
            title: `${store.name} Offer`,
            parameters: {
              store: store.id,
            },
            type: 'template',
          }
        }
      }) as TemplateItem[]

      if (
        !userHasRole(currentUser, 'administrator') &&
        !userHasRole(currentUser, 'article-editor')
      ) {
        removeTypes.push('article')
      }

      return [...prev, ...storeTemplates.filter(Boolean)].filter(
        (templateItem) => !removeTypes.includes(templateItem.templateId),
      )
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
      ]
    },
  },
})

export default defineConfig(
  stores.map((store) => ({
    ...baseConfig,
    name: store.id,
    title: store.name,
    basePath: `/${store.id}`,
    plugins: [
      structureTool({
        structure: (S, context) => structure(S, context, store),
      }),
      ...baseConfig.plugins,
    ],
    tools: (prev, {currentUser}) => {
      const roles = currentUser?.roles.flatMap((r) => r.name)

      if (roles?.includes(`${store.id}-manager`) || userHasRole(currentUser, 'administrator')) {
        return prev
      } else {
        return [noAccessTool()]
      }
    },
    document: {
      newDocumentOptions: (prev, {currentUser}) => {
        const roles = currentUser?.roles.flatMap((r) => r.name)

        if (roles?.includes(`${store.id}-manager`) || userHasRole(currentUser, 'administrator')) {
          return prev
        } else {
          return []
        }
      },
    },
  })),
)
