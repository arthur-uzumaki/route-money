import z from 'zod'

const envSchema = z.object({
  DATABASE_URL: z.url().startsWith('postgres://'),
  PORT: z.coerce.number().default(3333),
  JWT_SECRET: z.string().min(1),
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  WEB_URL: z.url(),
})

export const env = envSchema.parse(process.env)
