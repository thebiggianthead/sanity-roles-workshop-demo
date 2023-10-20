# Sanity - Roles Workshop

Here's a repo I use when running a workshop on how roles work. This is intended as a simple intro to configuring a Studio based on roles.

It's demonstrates a few things:

1. Adjusting desk structure based on the roles a user has.
1. Using initial value templates within the desk structure to automatically populate certain fields
   1. A `store` field for the `offer` document type.
   1. A `createdBy` field for the `offer` and `article` document types.
1. Removing a document type from the `document.newDocumentOptions` config if the user is not an administrator.
1. A simple custom input component to wrap a string input and change the `options.list` values based on roles.

## Custom Roles Setup

On an Enterprise Sanity plan, you can configure custom roles and resources. For this Studio, the roles setup should look something like:

- Create 3 roles with the below config:
  - Title: `Store 1 Manager`, ID: `store1-manager`
  - Title: `Store 1 Manager`, ID: `store2-manager`
  - Title: `My Article Creator`, ID: `created-by-user`
- Create 3 resources with the below config:
  - Name: `Store 1`, ID: as generated, GROQ filter: `store == "store1”`
  - Name: `Store 2`, ID: as generated, GROQ filter: `store == "store2”`
  - Name: `Created by user`, ID: as generated, GROQ filter: `createdBy == identity() || createdBy == $identity`
- Apply each of the resources to the relevant roles with permissions as desired.
- Assign these roles to multiple users.
- Visit the Studio with a user with each role. See the differences!

### Datasets

I also frequently touch on permissions and datasets. Permissions can be applied to all datasets, individual datasets, or multiple datasets via a tag. As an exercise, it can be useful to:

- Remove a resource from a role, and re-add it to a production dataset only.
- Setup a tag to apply to datasets, and add a resource to a role based on a dataset tag.
  - This can be great for multiple brands across datasets - e.g. a "brand1-production", "brand1-staging", "brand2-production", "brand2-staging" type setup. Simply tag datasets as "brand1" and "brand2" and it's easy to maintain permissions per brand.
