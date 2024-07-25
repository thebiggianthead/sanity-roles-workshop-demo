import {Card, Text} from '@sanity/ui'
import {useMemo} from 'react'
import {type StringInputProps, type TitledListValue, useCurrentUser, userHasRole} from 'sanity'

export default function StoreInput(props: StringInputProps) {
  const user = useCurrentUser()
  const roles = user?.roles.flatMap((r) => r.name)

  const newOptions = useMemo(() => {
    return (props?.schemaType?.options?.list as Array<TitledListValue<'string'>>)?.filter(
      (option) => {
        return roles?.includes(`${option.value}-manager`)
      },
    )
  }, [props?.schemaType?.options?.list, roles])

  if (userHasRole(user, 'administrator')) {
    return props.renderDefault(props)
  }

  if (newOptions.length == 1) {
    return (
      <Card tone="primary" padding={3} border radius={2}>
        <Text size={1}>
          This offer is for your store:{' '}
          {newOptions.find((option) => option.value == props.value)?.title}
        </Text>
      </Card>
    )
  }

  return props.renderDefault({
    ...props,
    schemaType: {
      ...props.schemaType,
      options: {...props.schemaType.options, list: newOptions},
    },
  })
}
