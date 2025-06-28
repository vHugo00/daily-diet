import fastify from 'fastify'
import cookie from '@fastify/cookie'
import { usersRoutes } from './Routes/users'
import { mealsRoutes } from './Routes/meals'

export const app = fastify()

app.register(cookie)

app.register(usersRoutes, { prefix: 'users' })
app.register(mealsRoutes, { prefix: 'meals' })
