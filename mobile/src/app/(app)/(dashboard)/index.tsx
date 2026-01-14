import { MaterialIcons } from '@expo/vector-icons'
import { ScrollView, View } from 'react-native'
import { Header } from '~/components/header'
import { Button, ButtonText } from '~/components/ui/button'
import { Skeleton, SkeletonText } from '~/components/ui/skeleton'
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
    <View className="flex-1 bg-background-0 py-16">
      <Header />

      <View className="flex-row items-center justify-between gap-2 border-background-200 border-b px-4 py-3 bg-background-50">
        <Button variant="outline" size="sm" className="flex-1">
          <MaterialIcons name="list" size={16} />
          <ButtonText>Corridas</ButtonText>
        </Button>

        <Button variant="outline" size="sm" className="flex-1">
          <MaterialIcons name="file-present" size={16} />
          <ButtonText>Relatórios</ButtonText>
        </Button>

        <Button variant="solid" size="sm" className="flex-1">
          <MaterialIcons name="add" size={16} color={'#fff'} />
          <ButtonText>Nova</ButtonText>
        </Button>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerClassName="pb-20 px-4 pt-6"
        showsVerticalScrollIndicator={false}
      >
        {isLoading ? (
          <View className="gap-4">
            {/* Skeleton Cards de Estatísticas */}
            <View className="gap-3">
              <Skeleton className="h-24 w-full rounded-2xl" />
              <Skeleton className="h-24 w-full rounded-2xl" />

              <View className="flex-row gap-3">
                <Skeleton className="h-24 flex-1 rounded-2xl" />
                <Skeleton className="h-24 flex-1 rounded-2xl" />
              </View>
            </View>

            {/* Skeleton Gráfico */}
            <View className="rounded-2xl border border-border/50 p-5 bg-background-50">
              <SkeletonText className="mb-2 w-48" />
              <SkeletonText className="mb-4 w-32" />
              <Skeleton className="h-48 w-full rounded-xl" />
            </View>

            {/* Skeleton Distribuição */}
            <View className="rounded-2xl border border-border/50 p-5 bg-background-50">
              <SkeletonText className="mb-4 w-56" />
              <View className="gap-3">
                <Skeleton className="h-16 w-full rounded-xl" />
                <Skeleton className="h-16 w-full rounded-xl" />
                <Skeleton className="h-16 w-full rounded-xl" />
              </View>
            </View>

            {/* Skeleton Gráfico Monthly */}
            <View className="rounded-2xl border border-border/50 p-5 bg-background-50">
              <SkeletonText className="mb-2 w-48" />
              <SkeletonText className="mb-4 w-32" />
              <Skeleton className="h-48 w-full rounded-xl" />
            </View>

            {/* Skeleton Corridas Recentes */}
            <View className="rounded-2xl border border-border/50 p-5 bg-background-50">
              <SkeletonText className="mb-4 w-40" />
              <View className="gap-3">
                <Skeleton className="h-20 w-full rounded-xl" />
                <Skeleton className="h-20 w-full rounded-xl" />
                <Skeleton className="h-20 w-full rounded-xl" />
              </View>
            </View>
          </View>
        ) : data ? (
          <View className="gap-4">
            {/* Cards de Estatísticas */}
            <View className="gap-3">
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

              <View className="flex-row gap-3">
                <View className="flex-1">
                  <StatsCard
                    title="Média Diária"
                    value={formatCurrency(data.dailyAverage)}
                    description="Por dia trabalhado"
                    icon={'calendar-view-week'}
                  />
                </View>
                <View className="flex-1">
                  <StatsCard
                    title="Projeção Mês"
                    value={formatCurrency(data.monthProjection)}
                    description="Na média atual"
                    icon={'bar-chart'}
                  />
                </View>
              </View>
            </View>

            {/* Gráfico Últimos 30 Dias */}
            <EarningsChart
              type="daily"
              data={data.earningsLast30Days.map(item => ({
                label: item.date,
                value: item.total,
              }))}
            />

            {/* Distribuição por Plataforma */}
            <PlatformDistribution stats={data.earningsByPlatform} />

            {/* Gráfico Últimos 12 Meses */}
            <EarningsChart
              type="monthly"
              data={data.earningsLast12Months.map(item => ({
                label: item.month,
                value: item.total,
              }))}
            />

            {/* Corridas Recentes */}
            <RecentTrips trips={data.recentRides} />
          </View>
        ) : null}
      </ScrollView>
    </View>
  )
}
