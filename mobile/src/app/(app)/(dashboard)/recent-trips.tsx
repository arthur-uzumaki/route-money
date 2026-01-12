import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Text, View } from 'react-native'
import type { Platform } from '~/app/(app)/(dashboard)/platform-distribution'
import { Card } from '~/components/ui/card'
import { formatCurrency } from '~/lib/format'
import { getPlatformColor, getPlatformName } from '~/lib/platform-config'

interface RecentRide {
  id: string
  platform: string
  value: number
}

interface RecentTripsProps {
  trips: RecentRide[]
}

export function RecentTrips({ trips }: RecentTripsProps) {
  return (
    <Card className="rounded-xl border border-border p-4">
      <Text className="font-bold text-foreground text-lg">
        Corridas Recentes
      </Text>

      <Text className="mb-4 text-muted-foreground text-sm">
        Últimas corridas registradas
      </Text>

      {trips.length === 0 ? (
        <Text className="py-6 text-center text-muted-foreground text-sm">
          Nenhuma corrida registrada ainda
        </Text>
      ) : (
        <View className="gap-4">
          {trips.map((trip, index) => (
            <View
              key={trip.id}
              className={`flex-row items-center justify-between pb-3 ${
                index !== trips.length - 1 ? 'border-border border-b' : ''
              }`}
            >
              <View className="flex-row items-center gap-3">
                <MaterialCommunityIcons name="car" size={18} color="#9ca3af" />

                <View>
                  <Text
                    className={`font-medium ${getPlatformColor(trip.platform as Platform)}`}
                  >
                    {getPlatformName(trip.platform as Platform)}
                  </Text>
                </View>
              </View>

              <View className="items-end">
                <Text className="font-semibold text-foreground">
                  {formatCurrency(trip.value)}
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}
    </Card>
  )
}
