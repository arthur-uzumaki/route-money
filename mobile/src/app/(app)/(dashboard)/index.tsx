import { MaterialIcons } from '@expo/vector-icons'
import { ScrollView, View } from 'react-native'
import { Header } from '~/components/header'
import { Button, ButtonText } from '~/components/ui/button'
import { formatCurrency, getDaysInMonth } from '~/lib/format'
import {
  calculatePlatformStats,
  getCurrentMonthTrips,
  getCurrentYearTrips,
} from '~/utils/stats'
import { TRIPSDTO } from '~/utils/TRIPS-DTO'
import { EarningsChart } from './earnings-chart'
import { PlatformDistribution } from './platform-distribution'
import { StatsCard } from './stats-card'

export default function Dashboard() {
  const currentMonthTrips = getCurrentMonthTrips(TRIPSDTO)
  const currentYearTrips = getCurrentYearTrips(TRIPSDTO)
  const platformStats = calculatePlatformStats(currentMonthTrips)

  const monthTotal = currentMonthTrips.reduce((sum, t) => sum + t.netValue, 0)
  const yearTotal = currentYearTrips.reduce((sum, t) => sum + t.netValue, 0)

  const now = new Date()
  const daysInMonth = getDaysInMonth(now.getFullYear(), now.getMonth() + 1)
  const currentDay = now.getDate()
  const dailyAverage = currentDay > 0 ? monthTotal / currentDay : 0
  const projectedMonth = dailyAverage * daysInMonth

  return (
    <View className="flex-1 py-16">
      <Header />

      <View className="flex-row items-center gap-1 border-background-200 border-b px-4 py-4">
        <Button variant="outline" size="sm">
          <MaterialIcons name="list" size={16} />
          <ButtonText>Corridas</ButtonText>
        </Button>

        <Button variant="outline" size="sm">
          <MaterialIcons name="file-present" size={16} />
          <ButtonText>Relatórios</ButtonText>
        </Button>

        <Button variant="solid" size="sm">
          <MaterialIcons name="add" size={16} color={'#fff'} />
          <ButtonText>Nova corrida</ButtonText>
        </Button>
      </View>

      <ScrollView
        className="mt-8"
        contentContainerClassName="pb-16"
        showsVerticalScrollIndicator={false}
      >
        <View className="gap-3 px-6">
          <StatsCard
            title="Ganho do Mês"
            value={formatCurrency(monthTotal)}
            description={`${currentMonthTrips.length} corridas este mês`}
            icon={'wallet'}
          />

          <StatsCard
            title="Ganho do Ano"
            value={formatCurrency(yearTotal)}
            description={`${currentYearTrips.length} corridas este ano`}
            icon={'trending-up'}
          />
          <StatsCard
            title="Média Diária"
            value={formatCurrency(dailyAverage)}
            description="Baseado nos dias trabalhados"
            icon={'calendar-view-week'}
          />
          <StatsCard
            title="Projeção do Mês"
            value={formatCurrency(projectedMonth)}
            description={`Se mantiver média atual`}
            icon={'bar-chart'}
          />
          <EarningsChart trips={currentYearTrips} type="daily" />
          <PlatformDistribution stats={platformStats} />

          <EarningsChart trips={currentMonthTrips} type="monthly" />
        </View>
      </ScrollView>
    </View>
  )
}
