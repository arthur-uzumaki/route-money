import '@/global.css'
import { Stack } from 'expo-router'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import { GluestackUIProvider } from '~/components/ui/gluestack-ui-provider'

export default function RootLayout() {
  return (
    <GestureHandlerRootView>
      <SafeAreaProvider>
        <GluestackUIProvider>
          <Stack>
            <Stack.Screen
              name="(app)/(dashboard)/index"
              options={{ headerShown: false }}
            />
          </Stack>
        </GluestackUIProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}
