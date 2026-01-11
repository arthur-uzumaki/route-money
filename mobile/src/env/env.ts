import { z } from 'zod'

const envSchema = z.object({
  EXPO_PUBLIC_SERVER_BASE_URL: z.url(),
})

export const env = envSchema.parse(process.env)
