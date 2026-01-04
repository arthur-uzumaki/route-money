import '@/global.css'
import { Stack } from 'expo-router'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

import { GluestackUIProvider } from '~/components/ui/gluestack-ui-provider'

export default function RootLayout() {
  return (
    <GestureHandlerRootView>
      <GluestackUIProvider>
        <Stack>
          <Stack.Screen
            name="(app)/(dashboard)/index"
            options={{ headerShown: false }}
          />
        </Stack>
      </GluestackUIProvider>
    </GestureHandlerRootView>
  )
}
