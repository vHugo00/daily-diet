import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import { z } from 'zod'
import crypto from 'node:crypto'

export async function mealsRoutes(app: FastifyInstance) {
  app.get('/', async () => {
    const mealsAll = await knex('meals').select('*')

    return mealsAll
  })

  app.get('/:id', async (request) => {
    const getMealParamsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = getMealParamsSchema.parse(request.params)

    const meal = await knex('meals')
      .where({
        id: id,
      })
      .first()

    return { meal }
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

  app.delete('/:id', async (request, reply) => {
    const getMealParamsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = getMealParamsSchema.parse(request.params)

    await knex('meals')
      .where({
        id: id,
      })
      .del()

    return reply.status(200).send('User deleted with sucess!')
  })
}
