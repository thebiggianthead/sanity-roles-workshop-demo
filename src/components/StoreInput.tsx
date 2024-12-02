import {Button, Grid, Text} from '@sanity/ui'
import {useCallback} from 'react'
import {set, type StringInputProps, type TitledListValue, useCurrentUser, userHasRole} from 'sanity'

export default function StoreInput(props: StringInputProps) {
  const {value, onChange, schemaType} = props

  const user = useCurrentUser()
  const roles = user?.roles.flatMap((r) => r.name)

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      const nextValue = event.currentTarget.value
      onChange(set(nextValue))
    },
    [onChange],
  )

  const stores = (schemaType?.options?.list as Array<TitledListValue<'string'>>)?.filter(
    (option) => {
      return roles?.includes(`${option.value}-manager`) || userHasRole(user, 'administrator')
    },
  )

  return (
    <Grid columns={stores.length} gap={3}>
      {stores?.map((store) => (
        <Button
          key={store.value}
          value={store.value}
          mode={value === store.value ? `default` : `ghost`}
          tone={value === store.value ? `primary` : `default`}
          onClick={handleClick}
        >
          <Text size={1}>{store.title}</Text>
        </Button>
      ))}
    </Grid>
  )
}
