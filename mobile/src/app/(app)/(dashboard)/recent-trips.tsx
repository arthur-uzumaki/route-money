import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Text, View } from 'react-native'
import type { Trip } from '~/app/(app)/(dashboard)/earnings-chart'
import { Card } from '~/components/ui/card'
import { formatCurrency, formatDate } from '~/lib/format'
import { getPlatformColor, getPlatformName } from '~/lib/platform-config'

interface RecentTripsProps {
  trips: Trip[]
}

export function RecentTrips({ trips }: RecentTripsProps) {
  const recentTrips = [...trips]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)

  return (
    <Card className="rounded-xl border border-border p-4">
      <Text className="font-bold text-foreground text-lg">
        Corridas Recentes
      </Text>

      <Text className="mb-4 text-muted-foreground text-sm">
        Últimas 5 corridas registradas
      </Text>

      {recentTrips.length === 0 ? (
        <Text className="py-6 text-center text-muted-foreground text-sm">
          Nenhuma corrida registrada ainda
        </Text>
      ) : (
        <View className="gap-4">
          {recentTrips.map((trip, index) => (
            <View
              key={trip.id}
              className={`flex-row items-center justify-between pb-3 ${
                index !== recentTrips.length - 1 ? 'border-border border-b' : ''
              }`}
            >
              <View className="flex-row items-center gap-3">
                <MaterialCommunityIcons
                  name={trip.type === 'corrida' ? 'car' : 'bike'}
                  size={18}
                  color="#9ca3af"
                />

                <View>
                  <Text
                    className={`font-medium ${getPlatformColor(trip.platform)}`}
                  >
                    {getPlatformName(trip.platform)}
                  </Text>

                  <Text className="text-muted-foreground text-xs">
                    {formatDate(trip.date)}
                  </Text>
                </View>
              </View>

              <View className="items-end">
                <Text className="font-semibold text-foreground">
                  {formatCurrency(trip.netValue)}
                </Text>

                {trip.fees > 0 && (
                  <Text className="text-muted-foreground text-xs">
                    Taxa: {formatCurrency(trip.fees)}
                  </Text>
                )}
              </View>
            </View>
          ))}
        </View>
      )}
    </Card>
  )
}
