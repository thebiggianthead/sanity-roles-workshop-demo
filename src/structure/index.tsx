import {DocumentsIcon, HomeIcon, TagIcon} from '@sanity/icons'
import type {ConfigContext} from 'sanity'
import type {
  DocumentListBuilder,
  ListItemBuilder,
  StructureBuilder,
  StructureResolver,
} from 'sanity/structure'

import {stores} from '../lib/constants'

const API_VERSION = '2023-01-01'

function defineStructure<StructureType>(
  factory: (S: StructureBuilder, context: ConfigContext) => StructureType,
) {
  return factory
}

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
      ...[createOffers(S, context) as ListItemBuilder].filter(Boolean),
    ])

const createArticleList = defineStructure<DocumentListBuilder>((S, context) => {
  const user = context?.currentUser
  const roles = user?.roles.map((r) => r.name)
  const isLimited = roles?.includes('article-editor')

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
    .apiVersion(API_VERSION)
})

const createOffers = defineStructure<ListItemBuilder | undefined>((S, context) => {
  const roles = context?.currentUser?.roles.map((r) => r.name)
  const storesManaged = roles?.filter((r) => r.endsWith('-manager')).length

  if ((storesManaged && storesManaged > 1) || roles?.includes('administrator')) {
    return S.listItem()
      .title('Offers')
      .icon(TagIcon)
      .child(
        S.list()
          .title('Offers')
          .items(createStoreOffers(S, context) as ListItemBuilder[]),
      )
  } else if (storesManaged && storesManaged == 1) {
    return createStoreOffers(S, context) as ListItemBuilder
  }
})

const createStoreOffers = defineStructure<ListItemBuilder | ListItemBuilder[]>((S, context) => {
  const roles = context?.currentUser?.roles.map((r) => r.name)

  const userStores =
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
                .apiVersion(API_VERSION)
                .initialValueTemplates([
                  S.initialValueTemplateItem('offer-by-store', {store: store.id}),
                ]),
            )
        }
      })
      .filter((item) => !!item) || []

  return userStores?.length == 1 ? userStores[0] : userStores
})
