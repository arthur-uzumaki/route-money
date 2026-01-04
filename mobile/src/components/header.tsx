import { Text, View } from 'react-native'
import { ProfileButton } from './profile-button'

export function Header() {
  return (
    <View className="flex-row items-center justify-between px-4">
      <View className="flex-col gap-1">
        <Text className="font-bold text-2xl">Meus Ganhos</Text>
        <Text className="font-medium text-background-700 text-lg">
          olá, Arthur
        </Text>
      </View>

      <View className="">
        <ProfileButton />
      </View>
    </View>
  )
}
