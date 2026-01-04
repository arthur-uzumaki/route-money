import { MaterialIcons } from '@expo/vector-icons'
import { ScrollView, View } from 'react-native'
import { Header } from '~/components/header'
import { Button, ButtonText } from '~/components/ui/button'
import { StatsCard } from './stats-card'

export default function Dashboard() {
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

      <ScrollView className="mt-8" contentContainerClassName="pb-8">
        <View className="gap-3 px-6">
          <StatsCard
            title="Ganho do Mês"
            value={'0'}
            description={` corridas este mês`}
            icon={'wallet'}
          />

          <StatsCard
            title="Ganho do Ano"
            value={'0'}
            description={` corridas este ano`}
            icon={'trending-up'}
          />
          <StatsCard
            title="Média Diária"
            value={'0'}
            description="Baseado nos dias trabalhados"
            icon={'calendar-view-week'}
          />
          <StatsCard
            title="Projeção do Mês"
            value={'0'}
            description={`Se mantiver média atual`}
            icon={'bar-chart'}
          />
        </View>
      </ScrollView>
    </View>
  )
}
