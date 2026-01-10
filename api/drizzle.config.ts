import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  dialect: 'postgresql',
  dbCredentials: {
    url: '',
  },
  schema: './src/db/schema',
  out: './src/db/migrations',
  casing: 'snake_case',
})
