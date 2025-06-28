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

  app.put('/:id', async (request, reply) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const editMealsBodySchema = z.object({
      name: z.string(),
      description: z.string(),
      is_on_diet: z.boolean(),
      date: z.string(),
    })

    const { id } = paramsSchema.parse(request.params)
    const { name, description, is_on_diet, date } = editMealsBodySchema.parse(
      request.body,
    )

    const updated = await knex('meals')
      .where({ id })
      .update({ name, description, is_on_diet, date })

    if (updated === 0) {
      return reply.status(404).send({ error: 'Meal not found' })
    }

    return reply.status(204).send()
  })

  app.delete('/:id', async (request, reply) => {
    const getMealParamsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = getMealParamsSchema.parse(request.params)

    const deleted = await knex('meals').where({ id }).del()

    if (deleted === 0) {
      return reply.status(404).send({ error: 'Meal not found' })
    }

    return reply.status(200).send({ message: 'Meal deleted successfully' })
  })
}
