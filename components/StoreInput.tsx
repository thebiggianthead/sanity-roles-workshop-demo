import {type StringInputProps, type TitledListValue, useCurrentUser} from 'sanity'
import {useMemo} from 'react'

export default function StoreInput(props: StringInputProps) {
  const roles = useCurrentUser()?.roles.flatMap((r) => r.name)

  const newOptions = useMemo(() => {
    return (props?.schemaType?.options?.list as Array<TitledListValue<'string'>>)?.filter(
      (option) => {
        return roles?.includes(`${option.value}-manager`)
      }
    )
  }, [props?.schemaType?.options?.list, roles])

  if (roles?.includes('administrator')) {
    return props.renderDefault(props)
  }

  return props.renderDefault({
    ...props,
    schemaType: {...props.schemaType, options: {...props.schemaType.options, list: newOptions}},
  })
}
