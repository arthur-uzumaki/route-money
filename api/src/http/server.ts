import fastifyJwt from '@fastify/jwt'
import { fastify } from 'fastify'
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod'
import { getReportsSummaryRoute } from './routes/reports/get-reports-summary.ts'
import { authenticateRoute } from './routes/user/authenticate.ts'
import { registerRoute } from './routes/user/register.ts'

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(fastifyJwt, {
  secret: '@dm1nR0ut3M0n3y2024!',
})

app.register(registerRoute)
app.register(authenticateRoute)

app.register(getReportsSummaryRoute)

app.listen({ port: 3333, host: '0.0.0.0' }).then(() => {
  console.log('HTTP server running on http://localhost:3333')
})
