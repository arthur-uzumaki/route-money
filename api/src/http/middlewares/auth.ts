import fastifyPlugin from 'fastify-plugin'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
export const auth: FastifyPluginAsyncZod = fastifyPlugin(async app => {
  app.addHook('preHandler', async (request, reply) => {
    request.getCurrentUserId = async () => {
      try {
        const { sub } = await request.jwtVerify<{ sub: string }>()
        return sub
      } catch {
        return reply.status(401).send({ message: 'Invalid auth token' })
      }
    }
  })
})
