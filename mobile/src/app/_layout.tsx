import '@/global.css'
import { QueryClientProvider } from '@tanstack/react-query'
import { Slot } from 'expo-router'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import { GluestackUIProvider } from '~/components/ui/gluestack-ui-provider'
import { AuthProvider } from '~/contexts/auth-context'
import { queryClient } from '~/lib/query-client'

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <GluestackUIProvider>
          <QueryClientProvider client={queryClient}>
            <AuthProvider>
              <Slot />
            </AuthProvider>
          </QueryClientProvider>
        </GluestackUIProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}
