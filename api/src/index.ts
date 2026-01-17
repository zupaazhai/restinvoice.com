import { OpenAPIHono } from '@hono/zod-openapi'
import { swaggerUI } from '@hono/swagger-ui'
import { cors } from 'hono/cors'
import templates from './routes/templates'

const app = new OpenAPIHono()

app.use('/*', cors({
  origin: 'http://localhost:5173',
  allowMethods: ['POST', 'GET', 'OPTIONS', 'DELETE', 'PUT', 'PATCH'],
  maxAge: 600,
}))

// v1 Router
const v1 = new OpenAPIHono()
v1.route('/templates', templates)

// Mount v1
app.route('/v1', v1)

app.get('/', (c) => {
  return c.text('RestInvoice API')
})

// OpenAPI Documentation
app.doc('/doc', {
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    title: 'RestInvoice API',
  },
})

app.get('/ui', swaggerUI({ url: '/doc' }))

export default app
