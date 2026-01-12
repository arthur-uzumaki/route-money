import { Text, View } from 'react-native'
import { Card } from '~/components/ui/card'
import { Progress, ProgressFilledTrack } from '~/components/ui/progress'
import { formatCurrency } from '~/lib/format'
import { getPlatformBgColor, getPlatformName } from '~/lib/platform-config'

export type Platform = 'uber' | 'ifood' | '99' | 'rappi' | 'outro'

export interface PlatformStats {
  platform: string
  total: number
  percentage: number
}

interface PlatformDistributionProps {
  stats: PlatformStats[]
}

export function PlatformDistribution({ stats }: PlatformDistributionProps) {
  return (
    <Card className="rounded-xl border border-border p-4">
      <Text className="font-bold text-foreground text-lg">
        Distribuição por Plataforma
      </Text>

      <Text className="mb-4 text-muted-foreground text-sm">
        Ganhos por aplicativo no período
      </Text>

      {stats.length === 0 ? (
        <Text className="py-6 text-center text-muted-foreground text-sm">
          Nenhum dado disponível
        </Text>
      ) : (
        <View className="gap-4">
          {stats.map(stat => (
            <View key={stat.platform} className="gap-2">
              <View className="flex-row items-center justify-between">
                <Text className="font-medium text-foreground text-sm">
                  {getPlatformName(stat.platform as Platform)}
                </Text>

                <Text className="text-muted-foreground text-xs">
                  {formatCurrency(stat.total)} ({stat.percentage.toFixed(1)}%)
                </Text>
              </View>

              <Progress size="sm" value={stat.percentage}>
                <ProgressFilledTrack
                  className={getPlatformBgColor(stat.platform as Platform)}
                />
              </Progress>
            </View>
          ))}
        </View>
      )}
    </Card>
  )
}
