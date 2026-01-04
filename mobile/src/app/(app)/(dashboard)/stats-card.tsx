import { MaterialIcons } from '@expo/vector-icons'
import { Text, View } from 'react-native'
import { Card } from '~/components/ui/card'

type Icon = keyof typeof MaterialIcons.glyphMap
interface StatsCardProps {
  title: string
  value: string
  description?: string
  icon?: Icon
  trend?: {
    value: string
    positive: boolean
  }
}

export function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
}: StatsCardProps) {
  return (
    <Card className="flex-1 rounded-xl border border-border p-4">
      <View className="flex-row items-center justify-between pb-2">
        <Text className="font-medium text-sm">{title}</Text>
        {Icon && (
          <MaterialIcons
            size={16}
            name={Icon}
            className="text-background-500"
          />
        )}
      </View>

      <View>
        <Text className="font-bold text-2xl">{value}</Text>
        {description && <Text className="mt-1 text-xs">{description}</Text>}
        {trend && (
          <Text
            className={`mt-1 text-xs ${trend.positive ? 'text-green-600' : 'text-red-600'}`}
          >
            {trend.positive ? '↑' : '↓'} {trend.value}
          </Text>
        )}
      </View>
    </Card>
  )
}
