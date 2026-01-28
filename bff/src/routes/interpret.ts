import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import type { CastResult } from '../types/divination.js';
import type { InterpretationService } from '../services/interpretation.js';
import { interpretRequestSchema, interpretResponseSchema } from '../schemas/interpret.js';

export async function interpretRoutes(
  fastify: FastifyInstance,
  interpretationService: InterpretationService
) {
  fastify.post<{ Body: CastResult }>(
    '/api/interpret',
    {
      schema: {
        body: interpretRequestSchema,
        response: {
          200: interpretResponseSchema,
        },
      },
    },
    async (request: FastifyRequest<{ Body: CastResult }>, reply: FastifyReply) => {
      try {
        const castResult = request.body;
        const interpretation = await interpretationService.getInterpretation(castResult);
        return reply.code(200).send(interpretation);
      } catch (error) {
        request.log.error(error, 'Failed to get interpretation');

        if (error instanceof Error) {
          return reply.code(502).send({
            error: 'GEMINI_API_ERROR',
            message: error.message,
          });
        }

        return reply.code(500).send({
          error: 'INTERNAL_SERVER_ERROR',
          message: 'An unexpected error occurred',
        });
      }
    }
  );
}
