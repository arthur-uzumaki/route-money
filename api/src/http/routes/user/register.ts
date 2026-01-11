import { hash } from 'bcrypt'
import { eq } from 'drizzle-orm'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { db } from '../../../db/connection.ts'
import { schema } from '../../../db/schema/index.ts'

export const registerRoute: FastifyPluginAsyncZod = async app => {
  app.post(
    '/registers',
    {
      schema: {
        tags: ['user'],
        summary: 'create a new user register ',
        body: z.object({
          name: z
            .string()
            .refine(
              value => value.trim().split(' ').length >= 1,
              'Informe nome e sobrenome'
            ),
          email: z.email('E-mail inválido'),
          password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
        }),
        response: {
          201: z.null(),
          409: z.object({ message: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const { name, email, password } = request.body

      const userExists = await db
        .select()
        .from(schema.user)
        .where(eq(schema.user.email, email))

      if (userExists) {
        return reply.status(409).send({ message: 'E-mail já cadastrado' })
      }

      const passwordHash = await hash(password, 8)
      await db.insert(schema.user).values({
        name,
        email,
        password: passwordHash,
      })
      return reply.status(201).send()
    }
  )
}
