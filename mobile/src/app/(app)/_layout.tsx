import { Stack, useRouter } from 'expo-router'
import { ActivityIndicator, View } from 'react-native'
import { Alert, AlertText } from '~/components/ui/alert'
import { Button, ButtonText } from '~/components/ui/button'
import { Card } from '~/components/ui/card'
import { useAuth } from '~/hooks/use-auth-hook'

export default function AppLayout() {
  const { isLoggedIn, isReady } = useAuth()
  const router = useRouter()

  if (!isReady) {
    return <ActivityIndicator className="flex-1 items-center justify-center" />
  }

  if (!isLoggedIn) {
    return (
      <View className="flex-1 justify-end p-4">
        <Card className="w-full">
          <Alert variant="solid" action="warning">
            <AlertText className="text-center font-medium text-base">
              Sua sessão expirou. Faça login novamente para continuar.
            </AlertText>
          </Alert>

          <Button onPress={() => router.replace('/signin')}>
            <ButtonText>Ir para login</ButtonText>
          </Button>
        </Card>
      </View>
    )
  }

  return (
    <Stack>
      <Stack.Screen name="(dashboard)/index" options={{ headerShown: false }} />
    </Stack>
  )
}
