import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import { z } from 'zod'
import crypto from 'node:crypto'

export async function mealsRoutes(app: FastifyInstance) {
  app.get('/', async () => {
    const mealsAll = await knex('meals').select('*')

    return mealsAll
  })

  app.post('/', async (request, reply) => {
    const createMealsBodySchema = z.object({
      id: z.string().uuid(),
      user_id: z.string().uuid(),
      name: z.string(),
      description: z.string(),
      is_on_diet: z.boolean(),
      date: z.string(),
    })

    const { user_id, name, description, is_on_diet, date } =
      createMealsBodySchema.parse(request.body)

    await knex('meals').insert({
      id: crypto.randomUUID(),
      user_id,
      name,
      description,
      is_on_diet,
      date,
    })

    return reply.status(201).send()
  })
}
