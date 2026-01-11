import { fastifyCors } from '@fastify/cors'
import { fastifyJwt } from '@fastify/jwt'
import fastifySwagger from '@fastify/swagger'
import scalar from '@scalar/fastify-api-reference'
import { fastify } from 'fastify'
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod'
import { env } from '../env/env.ts'
import { getReportsSummaryRoute } from './routes/reports/get-reports-summary.ts'
import { authenticateRoute } from './routes/user/authenticate.ts'
import { registerRoute } from './routes/user/register.ts'

const app = fastify({
  logger: {
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
      },
    },
  },
}).withTypeProvider<ZodTypeProvider>()

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
})

app.register(fastifyCors, {
  origin: env.WEB_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
})

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'API Documentation',
      version: '1.0.0',
      description: 'API documentation for the Fastify server',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  transform: jsonSchemaTransform,
})

if (env.NODE_ENV === 'development') {
  app.register(scalar, {
    routePrefix: '/docs',
  })
}

app.register(registerRoute)
app.register(authenticateRoute)

app.register(getReportsSummaryRoute)

app.listen({ port: env.PORT, host: '0.0.0.0' }).then(() => {
  console.log(`HTTP server running on http://localhost:${env.PORT}`)
  console.log(
    `API documentation available at http://localhost:${env.PORT}/docs`
  )
})
