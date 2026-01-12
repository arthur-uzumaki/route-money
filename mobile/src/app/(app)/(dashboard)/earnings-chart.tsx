import { Text } from 'react-native'
import { BarChart, LineChart } from 'react-native-gifted-charts'
import { Card } from '~/components/ui/card'

export type ChartPoint = {
  label: string
  value: number
}

interface EarningsChartProps {
  data: ChartPoint[]
  type: 'daily' | 'monthly'
}

export function EarningsChart({ data, type }: EarningsChartProps) {
  return (
    <Card className="overflow-hidden rounded-xl border border-border p-4">
      <Text className="mb-1 text-lg font-bold text-foreground">
        Evolução de Ganhos
      </Text>

      <Text className="mb-4 text-sm text-muted-foreground">
        {type === 'daily' ? 'Últimos 30 dias' : 'Últimos 12 meses'}
      </Text>

      {type === 'daily' ? (
        <LineChart
          data={data.map(item => ({
            value: item.value,
            label: item.label,
          }))}
          height={180}
          curved
          color="#22c55e"
          thickness={3}
          startFillColor="#22c55e"
          endFillColor="rgba(34,197,94,0.1)"
          areaChart
          yAxisThickness={1}
          yAxisLabelWidth={45}
          yAxisLabelPrefix="R$ "
        />
      ) : (
        <BarChart
          data={data.map(item => ({
            value: item.value,
            label: item.label,
          }))}
          height={180}
          barWidth={22}
          spacing={14}
          roundedTop
          frontColor="#22c55e"
          yAxisThickness={1}
          yAxisLabelPrefix="R$ "
        />
      )}
    </Card>
  )
}
