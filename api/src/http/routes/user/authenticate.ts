import { compare } from 'bcrypt'
import { eq } from 'drizzle-orm'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { db } from '../../../db/connection.ts'
import { schema } from '../../../db/schema/index.ts'

export const authenticateRoute: FastifyPluginAsyncZod = async app => {
  app.post(
    '/sessions',
    {
      schema: {
        tags: ['user'],
        summary: 'Authenticate a user and create a session',
        body: z.object({
          email: z.email(),
          password: z.string().min(6).max(100),
        }),
        response: {
          200: z.object({
            token: z.jwt(),
          }),
          400: z.object({ message: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const { email, password } = request.body

      const result = await db
        .select()
        .from(schema.user)
        .where(eq(schema.user.email, email))

      const user = result[0]

      if (!user) {
        return reply.status(400).send({ message: 'E-mail ou senha inválidos' })
      }

      const isPasswordValid = await compare(password, user.password)
      if (!isPasswordValid) {
        return reply.status(400).send({ message: 'E-mail ou senha inválidos' })
      }

      const token = app.jwt.sign({}, { sub: user.id, expiresIn: '30m' })
      return reply.status(200).send({ token })
    }
  )
}
