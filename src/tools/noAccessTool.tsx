import {WarningFilledIcon} from '@sanity/icons'
import {Card, Text} from '@sanity/ui'

export const noAccessTool = () => {
  return {
    title: 'No Access',
    name: 'no-access-tool',
    icon: WarningFilledIcon,
    component: () => (
      <Card padding={4}>
        <Text>No access to this workspace...</Text>
      </Card>
    ),
  }
}
