import { Text, View } from 'react-native'
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

// Função para formatar valores do eixo Y
const formatYAxisLabel = (value: number): string => {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`
  }
  return value.toFixed(0)
}

// Função para formatar labels do eixo X
const formatXAxisLabel = (label: string, type: 'daily' | 'monthly'): string => {
  if (type === 'monthly') {
    // Espera formato "MM/YYYY" da API
    const months = [
      'Jan',
      'Fev',
      'Mar',
      'Abr',
      'Mai',
      'Jun',
      'Jul',
      'Ago',
      'Set',
      'Out',
      'Nov',
      'Dez',
    ]

    const parts = label.split('/')
    if (parts.length === 2) {
      const monthIndex = parseInt(parts[0]) - 1
      const year = parts[1].slice(-2) // Últimos 2 dígitos do ano
      return `${months[monthIndex]}\n${year}`
    }
    return label
  }

  // Para daily, extrai só o dia da data ISO
  // "2025-12-17T07:31:00.000Z" -> "17"
  try {
    const date = new Date(label)
    return date.getDate().toString().padStart(2, '0')
  } catch {
    return label
  }
}

export function EarningsChart({ data, type }: EarningsChartProps) {
  const maxValue = Math.max(...data.map(d => d.value)) * 1.1

  return (
    <Card
      className="overflow-hidden rounded-2xl border border-border/50 p-5 bg-background-50"
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
      }}
    >
      <View className="mb-5">
        <Text className="text-xl font-bold text-foreground mb-1">
          Evolução de Ganhos
        </Text>
        <Text className="text-sm text-muted-foreground">
          {type === 'daily' ? 'Últimos 30 dias' : 'Últimos 12 meses'}
        </Text>
      </View>

      <View className="ml-[-10px]">
        {type === 'daily' ? (
          <LineChart
            data={data.map(item => ({
              value: item.value,
              label: formatXAxisLabel(item.label, type),
            }))}
            height={200}
            curved
            color="#22c55e"
            thickness={3}
            startFillColor="rgba(34,197,94,0.3)"
            endFillColor="rgba(34,197,94,0.05)"
            areaChart
            yAxisThickness={0}
            xAxisThickness={0}
            yAxisTextStyle={{
              color: '#9ca3af',
              fontSize: 11,
              fontWeight: '500',
            }}
            xAxisLabelTextStyle={{
              color: '#9ca3af',
              fontSize: 10,
              fontWeight: '500',
              textAlign: 'center',
            }}
            yAxisLabelWidth={55}
            formatYLabel={value => `R$ ${formatYAxisLabel(parseFloat(value))}`}
            hideDataPoints={false}
            dataPointsColor="#22c55e"
            dataPointsRadius={4}
            focusEnabled
            showStripOnFocus
            stripColor="rgba(34,197,94,0.2)"
            stripWidth={2}
            showTextOnFocus
            textFontSize={12}
            textColor="#22c55e"
            noOfSections={5}
            maxValue={maxValue}
            rulesColor="rgba(156,163,175,0.2)"
            rulesType="solid"
            initialSpacing={10}
            endSpacing={20}
          />
        ) : (
          <BarChart
            data={data.map(item => ({
              value: item.value,
              label: formatXAxisLabel(item.label, type),
            }))}
            height={200}
            barWidth={24}
            spacing={16}
            roundedTop
            roundedBottom
            frontColor="#22c55e"
            gradientColor="#16a34a"
            showGradient
            yAxisThickness={0}
            xAxisThickness={0}
            yAxisTextStyle={{
              color: '#9ca3af',
              fontSize: 11,
              fontWeight: '500',
            }}
            xAxisLabelTextStyle={{
              color: '#9ca3af',
              fontSize: 10,
              fontWeight: '500',
              textAlign: 'center',
            }}
            yAxisLabelWidth={55}
            formatYLabel={value => `R$ ${formatYAxisLabel(parseFloat(value))}`}
            noOfSections={5}
            maxValue={maxValue}
            rulesColor="rgba(156,163,175,0.2)"
            rulesType="solid"
            initialSpacing={10}
            endSpacing={20}
          />
        )}
      </View>
    </Card>
  )
}
