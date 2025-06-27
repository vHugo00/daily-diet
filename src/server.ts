import fastify from 'fastify'
import cookie from '@fastify/cookie'

import { env } from './env'
import { mealsRoutes } from './Routes/meals'
import { userRoutes } from './Routes/user'

const app = fastify()

app.register(cookie)
app.register(mealsRoutes, {
  prefix: 'meals',
})
app.register(userRoutes, {
  prefix: 'users',
})

app
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log('HTTP Server Running!')
  })
