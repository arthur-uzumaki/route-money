import { Text } from 'react-native'
import { BarChart, LineChart } from 'react-native-gifted-charts'
import { Card } from '~/components/ui/card'
import { getDailyData, getMonthlyData } from '~/utils/trips'

export type Platform = 'uber' | 'ifood' | '99' | 'rappi' | 'outro'
export type TripType = 'corrida' | 'entrega'

export type Trip = {
  id: string
  userId: string
  platform: Platform
  type: TripType
  date: string
  grossValue: number
  fees: number
  netValue: number
  duration?: number
  notes?: string
  createdAt: string
}

interface EarningsChartProps {
  trips: Trip[]
  type: 'daily' | 'monthly'
}

export function EarningsChart({ trips, type }: EarningsChartProps) {
  const data = type === 'daily' ? getDailyData(trips) : getMonthlyData(trips)

  return (
    <Card className="overflow-hidden rounded-xl border border-border p-4">
      <Text className="mb-1 font-bold text-foreground text-lg">
        Evolução de Ganhos
      </Text>

      <Text className="mb-4 text-muted-foreground text-sm">
        {type === 'daily' ? 'Últimos 30 dias' : 'Últimos 12 meses'}
      </Text>

      {type === 'daily' ? (
        <LineChart
          data={data}
          height={180}
          curved
          color="#22c55e"
          thickness={3}
          dataPointsColor="#22c55e"
          startFillColor="#22c55e"
          endFillColor="rgba(34,197,94,0.1)"
          areaChart
          yAxisThickness={1}
          yAxisLabelWidth={45}
          yAxisTextStyle={{ color: '#9ca3af', fontSize: 10 }}
          yAxisLabelPrefix="R$ "
          xAxisThickness={1}
          xAxisLabelTextStyle={{ color: '#9ca3af', fontSize: 10 }}
        />
      ) : (
        <BarChart
          data={data}
          height={180}
          barWidth={22}
          spacing={14}
          roundedTop
          frontColor="#22c55e"
          yAxisThickness={1}
          yAxisTextStyle={{ color: '#9ca3af', fontSize: 10 }}
          yAxisLabelPrefix="R$ "
          xAxisThickness={1}
          xAxisLabelTextStyle={{ color: '#9ca3af', fontSize: 10 }}
        />
      )}
    </Card>
  )
}
