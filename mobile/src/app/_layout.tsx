import '@/global.css'
import { QueryClientProvider } from '@tanstack/react-query'
import { Stack } from 'expo-router'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import { GluestackUIProvider } from '~/components/ui/gluestack-ui-provider'
import { queryClient } from '~/lib/query-client'

export default function RootLayout() {
  return (
    <GestureHandlerRootView>
      <SafeAreaProvider>
        <GluestackUIProvider>
          <QueryClientProvider client={queryClient}>
            <Stack>
              <Stack.Screen
                name="(app)/(dashboard)/index"
                options={{ headerShown: false }}
              />
            </Stack>
          </QueryClientProvider>
        </GluestackUIProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}
