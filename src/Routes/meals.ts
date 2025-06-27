import { FastifyInstance } from 'fastify'
import { knex } from '../database'

export async function mealsRoutes(app: FastifyInstance) {
  app.get('/hellos', async () => {
    const usersAll = await knex('users').select('*')

    return usersAll
  })
}
