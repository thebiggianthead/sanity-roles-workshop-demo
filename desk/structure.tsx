import type {
  ListItemBuilder,
  StructureResolver,
  StructureBuilder,
  DocumentListBuilder,
} from 'sanity/desk'
import {ConfigContext} from 'sanity'
import {DocumentsIcon, TagIcon, HomeIcon} from '@sanity/icons'
import {stores} from '../lib/constants'

function defineStructure<StructureType>(
  factory: (S: StructureBuilder, context: ConfigContext) => StructureType
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
            .title(store.name)
            .icon(HomeIcon)
            .child(
              S.documentTypeList('offer')
                .title(`${store.name} Offers`)
                .filter(`_type == "offer" && store == $storeId`)
                .params({storeId: store.id})
                .apiVersion('2023-01-01')
                .initialValueTemplates([
                  S.initialValueTemplateItem('offer-by-store', {store: store.id}),
                ])
            )
        }
      })
      .filter((item) => !!item) || []
  )
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
      S.listItem()
        .title('Offers')
        .icon(TagIcon)
        .child(
          S.list()
            .title('Offers')
            .items(createAllStoreOffers(S, context) as ListItemBuilder[])
        ),
    ])
