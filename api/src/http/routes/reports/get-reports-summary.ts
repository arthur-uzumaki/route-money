import { and, eq, gte, lte, sql } from 'drizzle-orm'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { db } from '../../../db/connection.ts'
import { schema } from '../../../db/schema/index.ts'
import { auth } from '../../middlewares/auth.ts'

export const getReportsSummaryRoute: FastifyPluginAsyncZod = async app => {
  app.register(auth).get(
    '/reports/summary',
    {
      schema: {
        tags: ['reports'],
        summary: 'get reports summary',
        querystring: z.object({
          month: z.number().min(1).max(12).optional(),
          year: z.number().min(2000).optional(),
        }),
        response: {
          200: z.object({
            monthTotal: z.number(),
            yearTotal: z.number(),
            dailyAverage: z.number(),
            monthProjection: z.number(),

            earningsLast30Days: z.array(
              z.object({
                date: z.string().datetime(),
                total: z.number(),
              })
            ),

            earningsLast12Months: z.array(
              z.object({
                month: z.string(),
                total: z.number(),
              })
            ),

            earningsByPlatform: z.array(
              z.object({
                platform: z.string(),
                total: z.number(),
                percentage: z.number(),
              })
            ),

            recentRides: z.array(
              z.object({
                id: z.uuid(),
                platform: z.string(),
                value: z.number(),
              })
            ),
          }),
        },
      },
    },
    async (request, reply) => {
      const userId = await request.getCurrentUserId()

      const now = new Date()

      const month = request.query.month ?? now.getMonth() + 1
      const year = request.query.year ?? now.getFullYear()

      const startOfMonth = new Date(year, month, 1, 1)
      const endOfMonth = new Date(year, month, 0)
      const startOfYear = new Date(year, 0, 1)
      const endOfYear = new Date(year, 11, 31)

      // 1️⃣ Ganho do mês

      const [monthResult] = await db
        .select({
          total: sql<number>`COALESCE(SUM(${schema.rides.netValue}), 0)`,
          count: sql<number>`COUNT(*)`,
        })
        .from(schema.rides)
        .where(
          and(
            eq(schema.rides.userId, userId),
            gte(schema.rides.rideDate, startOfMonth),
            lte(schema.rides.rideDate, endOfMonth)
          )
        )

      // 2️⃣ Ganho do ano
      const [yearResult] = await db
        .select({
          total: sql<number>`COALESCE(SUM(${schema.rides.netValue}), 0)`,
        })
        .from(schema.rides)
        .where(
          and(
            eq(schema.rides.userId, userId),
            gte(schema.rides.rideDate, startOfYear),
            lte(schema.rides.rideDate, endOfYear)
          )
        )

      // 3️⃣ Média diária
      const daysWorked = new Set(
        (
          await db
            .select()
            .from(schema.rides)
            .where(
              and(
                eq(schema.rides.userId, userId),
                gte(schema.rides.rideDate, startOfMonth),
                lte(schema.rides.rideDate, endOfMonth)
              )
            )
        ).map(ride => ride.rideDate.toISOString())
      ).size

      const dailyAverage = daysWorked > 0 ? monthResult.total / daysWorked : 0

      // 4️⃣ Projeção do mês
      const daysInMonth = new Date(year, month, 0).getDate()
      const monthProjection = dailyAverage * daysInMonth

      // 5️⃣ Últimos 30 dias
      const last30Days = await db
        .select({
          date: schema.rides.rideDate,
          total: sql<number>`SUM(${schema.rides.netValue})`,
        })
        .from(schema.rides)
        .where(
          and(
            eq(schema.rides.userId, userId),
            gte(schema.rides.rideDate, new Date(now.getTime() - 30 * 86400000))
          )
        )
        .groupBy(schema.rides.rideDate)
        .orderBy(schema.rides.rideDate)

      // 6️⃣ Últimos 12 meses

      const last12Months = await db.execute<{
        month: string
        total: number
      }>(sql`
      SELECT
        TO_CHAR(ride_date, 'MM/YYYY') AS month,
        SUM(net_value) AS total
      FROM rides
      WHERE user_id = ${userId}
        AND ride_date >= CURRENT_DATE - INTERVAL '12 months'
      GROUP BY month
      ORDER BY month
    `)

      // 7️⃣ Distribuição por plataforma
      const platformsResult = await db
        .select({
          name: schema.platform.name,
          total: sql<number>`SUM(${schema.rides.netValue})`,
        })
        .from(schema.rides)
        .innerJoin(
          schema.platform,
          eq(schema.platform.id, schema.rides.platformId)
        )
        .where(eq(schema.rides.userId, userId))

      const totalPlatforms = platformsResult.reduce(
        (acc, platform) => acc + platform.total,
        0
      )

      const earningsByPlatform = platformsResult.map(p => ({
        platform: p.name,
        total: p.total,
        percentage: totalPlatforms > 0 ? (p.total / totalPlatforms) * 100 : 0,
      }))

      // 8️⃣ Corridas recentes
      const recentRides = await db
        .select({
          id: schema.rides.id,
          platform: schema.platform.name,
          value: schema.rides.netValue,
        })
        .from(schema.rides)
        .innerJoin(
          schema.platform,
          eq(schema.platform.id, schema.rides.platformId)
        )
        .where(eq(schema.rides.userId, userId))
        .orderBy(sql`${schema.rides.rideDate} DESC`)
        .limit(5)

      return reply.status(200).send({
        monthTotal: Number(monthResult.total),
        yearTotal: Number(yearResult.total),
        dailyAverage: Number(dailyAverage.toFixed(2)),
        monthProjection: Number(monthProjection.toFixed(2)),

        earningsLast30Days: last30Days.map(item => ({
          date: item.date.toISOString(),
          total: Number(item.total),
        })),

        earningsLast12Months: last12Months.rows.map(item => ({
          month: item.month,
          total: Number(item.total),
        })),

        earningsByPlatform: earningsByPlatform.map(p => ({
          platform: p.platform,
          total: Number(p.total),
          percentage: Number(p.percentage.toFixed(2)),
        })),

        recentRides: recentRides.map(ride => ({
          id: ride.id,
          platform: ride.platform,
          value: Number(ride.value),
        })),
      })
    }
  )
}
