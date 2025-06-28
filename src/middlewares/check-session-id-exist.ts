import { FastifyReply, FastifyRequest } from 'fastify'
import { knex } from '../database'

export async function checkSessionIdExist(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const sessionId = request.cookies.sessionId

  if (!sessionId) {
    return reply.status(401).send({
      error: 'Unauthorized: Session ID not found.',
    })
  }

  const user = await knex('users').where({ session_id: sessionId }).first()

  if (!user) {
    return reply.status(401).send({
      error: 'Unauthorized: Invalid session.',
    })
  }

  request.user = {
    id: user.id,
    session_id: user.session_id,
    name: user.name,
    email: user.email,
    created_at: user.created_at,
    updated_at: user.updated_at,
  }
}
