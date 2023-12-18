import {DocumentsIcon, HomeIcon, TagIcon} from '@sanity/icons'
import type {ConfigContext} from 'sanity'
import type {
  DocumentListBuilder,
  ListItem,
  ListItemBuilder,
  StructureBuilder,
  StructureResolver,
} from 'sanity/desk'

import {stores} from '../lib/constants'

function defineStructure<StructureType>(
  factory: (S: StructureBuilder, context: ConfigContext) => StructureType,
) {
  return factory
}

const createAllStoreOffers = defineStructure<(ListItemBuilder | undefined)[]>((S, context) => {
  const roles = context?.currentUser?.roles.map((r) => r.name)

  return (
    stores
      .map((store) => {
        if (roles?.includes(`${store.id}-manager`) || roles?.includes('administrator')) {
          return S.listItem()
            .title(`${store.name} Offers`)
            .icon(HomeIcon)
            .child(
              S.documentTypeList('offer')
                .title(`${store.name} Offers`)
                .filter(`_type == "offer" && store == $storeId`)
                .params({storeId: store.id})
                .apiVersion('2023-01-01')
                .initialValueTemplates([
                  S.initialValueTemplateItem('offer-by-store', {store: store.id}),
                ]),
            )
        }
      })
      .filter((item) => !!item) || []
  )
})

const createOffers = defineStructure<ListItemBuilder | undefined>((S, context) => {
  const roles = context?.currentUser?.roles.map((r) => r.name)
  const storeRolesCount = roles?.filter((r) => r.endsWith('-manager')).length

  if ((storeRolesCount && storeRolesCount > 1) || roles?.includes('administrator')) {
    return S.listItem()
      .title('Offers')
      .icon(TagIcon)
      .child(
        S.list()
          .title('Offers')
          .items(createAllStoreOffers(S, context) as ListItemBuilder[]),
      )
  } else if (storeRolesCount == 1) {
    console.log('just one!')
    return [...createAllStoreOffers(S, context)][0]
  }

  return []
})

const createArticleList = defineStructure<DocumentListBuilder>((S, context) => {
  const user = context?.currentUser
  const roles = user?.roles.map((r) => r.name)
  const isLimited = roles?.includes('my-article-creator')
  let userQuery = ``

  if (isLimited) {
    userQuery = `createdBy == $userId`
  } else {
    userQuery = ``
  }

  return S.documentTypeList('article')
    .title(`Articles`)
    .filter([`_type == "article"`, userQuery].filter(Boolean).join(` && `))
    .params({userId: user?.id})
    .apiVersion('2023-01-01')
    .initialValueTemplates([S.initialValueTemplateItem('article-with-author')])
})

export const structure: StructureResolver = (S, context) =>
  S.list()
    .id('root')
    .title('Content')
    .items([
      S.listItem()
        .title('Articles')
        .icon(DocumentsIcon)
        .schemaType('article')
        .child(createArticleList(S, context)),
      createOffers(S, context) as ListItemBuilder | ListItem,
    ])
