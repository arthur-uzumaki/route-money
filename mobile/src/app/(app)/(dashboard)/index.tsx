import { MaterialIcons } from '@expo/vector-icons'
import { View } from 'react-native'
import { Header } from '~/components/header'
import { Button, ButtonText } from '~/components/ui/button'

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
    </View>
  )
}
