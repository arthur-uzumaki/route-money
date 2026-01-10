import { sql } from 'drizzle-orm'
import {
  integer,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core'
import { platform } from './platform.ts'
import { user } from './user.ts'

const ridesType = pgEnum('rides_type', ['corrida', 'entrega'])

export const rides = pgTable(
  'rides',
  {
    id: uuid().primaryKey().defaultRandom(),
    type: ridesType().notNull().default('corrida'),
    rideDate: timestamp({ withTimezone: false }).notNull(),
    grossValues: numeric({ precision: 10, scale: 2 }).notNull(),
    feeValue: numeric({ precision: 10, scale: 2 }).default(sql`0`),
    netValue: numeric({ precision: 10, scale: 2 }).notNull(),
    durationMinutes: integer(),
    notes: text(),

    userId: text()
      .notNull()
      .references(() => user.id),
    platformId: text()
      .notNull()
      .references(() => platform.id),

    created_at: timestamp({ withTimezone: true }).defaultNow(),
    updated_at: timestamp({ withTimezone: true }).defaultNow(),
  },
  table => [uniqueIndex().on(table.userId, table.rideDate, table.platformId)]
)
