import { drizzle } from 'drizzle-orm/node-postgres'

export const db = drizzle('', {
  logger: true,
  casing: 'snake_case',
})
