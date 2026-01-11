import { fastifyCors } from '@fastify/cors'
import { fastifyJwt } from '@fastify/jwt'
import { fastify } from 'fastify'
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod'
import { env } from '../env/env.ts'
import { getReportsSummaryRoute } from './routes/reports/get-reports-summary.ts'
import { authenticateRoute } from './routes/user/authenticate.ts'
import { registerRoute } from './routes/user/register.ts'

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
})

app.register(fastifyCors, {
  origin: env.WEB_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
})

app.register(registerRoute)
app.register(authenticateRoute)

app.register(getReportsSummaryRoute)

app.listen({ port: env.PORT, host: '0.0.0.0' }).then(() => {
  console.log(`HTTP server running on http://localhost:${env.PORT}`)
})
