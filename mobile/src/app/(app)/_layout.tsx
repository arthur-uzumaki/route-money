import { Stack, useRouter } from 'expo-router'

import { ActivityIndicator, View } from 'react-native'
import { Alert, AlertText } from '~/components/ui/alert'
import { Button, ButtonText } from '~/components/ui/button'
import { Card } from '~/components/ui/card'
import { VStack } from '~/components/ui/vstack'
import { useAuth } from '~/hooks/use-auth-hook'

export default function AppLayout() {
  const { isLoggedIn, isReady } = useAuth()
  const router = useRouter()

  if (!isReady) {
    return <ActivityIndicator className="flex-1 items-center justify-center" />
  }

  if (!isLoggedIn) {
    return (
      <View className="flex-1 justify-end pb-8 px-4 bg-background-0">
        <Card
          className="w-full p-6 rounded-2xl bg-background-50"
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 5,
          }}
        >
          <VStack space="lg">
            <Alert variant="solid" action="warning" className="rounded-xl">
              <AlertText className="text-center font-medium text-base leading-6">
                Sua sessão expirou. Faça login novamente para continuar.
              </AlertText>
            </Alert>

            <Button
              onPress={() => router.replace('/signin')}
              className="rounded-xl"
              size="lg"
            >
              <ButtonText className="font-semibold">Ir para login</ButtonText>
            </Button>
          </VStack>
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
