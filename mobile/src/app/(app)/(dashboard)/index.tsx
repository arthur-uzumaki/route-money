import { MaterialIcons } from '@expo/vector-icons'
import { ScrollView, View } from 'react-native'
import { Header } from '~/components/header'
import { Button, ButtonText } from '~/components/ui/button'
import { getSummary } from '~/http/get-summary'
import { formatCurrency } from '~/lib/format'
import { EarningsChart } from './earnings-chart'
import { PlatformDistribution } from './platform-distribution'
import { RecentTrips } from './recent-trips'
import { StatsCard } from './stats-card'

export default function Dashboard() {
  const now = new Date()

  const month = now.getMonth() + 1
  const year = now.getFullYear()

  const { data, isLoading } = getSummary({ month, year })

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
        {isLoading && <View />}
        <View className="gap-3 px-6">
          {data && (
            <>
              <StatsCard
                title="Ganho do Mês"
                value={formatCurrency(data.monthTotal)}
                description="Total no mês"
                icon={'wallet'}
              />

              <StatsCard
                title="Ganho do Ano"
                value={formatCurrency(data.yearTotal)}
                description="Total no ano"
                icon={'trending-up'}
              />
              <StatsCard
                title="Média Diária"
                value={formatCurrency(data.dailyAverage)}
                description="Baseado nos dias trabalhados"
                icon={'calendar-view-week'}
              />
              <StatsCard
                title="Projeção do Mês"
                value={formatCurrency(data.monthProjection)}
                description={`Se mantiver média atual`}
                icon={'bar-chart'}
              />
            </>
          )}

          {data && (
            <EarningsChart
              type="daily"
              data={data.earningsLast30Days.map(item => ({
                label: item.date,
                value: item.total,
              }))}
            />
          )}
          {data && <PlatformDistribution stats={data.earningsByPlatform} />}

          {data && (
            <EarningsChart
              type="monthly"
              data={data.earningsLast12Months.map(item => ({
                label: item.month,
                value: item.total,
              }))}
            />
          )}

          {data && <RecentTrips trips={data.recentRides} />}
        </View>
      </ScrollView>
    </View>
  )
}
