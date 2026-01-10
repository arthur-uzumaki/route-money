import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

export const platform = pgTable('platforms', {
  id: uuid().primaryKey().defaultRandom(),
  name: text().notNull(),
  color: text(),
  created_at: timestamp({ withTimezone: true }).defaultNow(),
})
