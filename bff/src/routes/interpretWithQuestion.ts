import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import type { InterpretWithQuestionRequest } from '../types/divination.js';
import type { InterpretationService } from '../services/interpretation.js';

export async function interpretWithQuestionRoutes(
  fastify: FastifyInstance,
  interpretationService: InterpretationService
) {
  fastify.post<{ Body: InterpretWithQuestionRequest }>(
    '/api/interpret-with-question',
    {
      schema: {
        body: {
          type: 'object',
          required: ['lines', 'baseHex', 'changedHex', 'moving', 'question', 'category'],
          properties: {
            lines: { type: 'array', items: { type: 'number', enum: [6, 7, 8, 9] }, minItems: 6, maxItems: 6 },
            baseHex: { type: 'string', pattern: '^[01]{6}$' },
            changedHex: { type: 'string', pattern: '^[01]{6}$' },
            moving: { type: 'array', items: { type: 'boolean' }, minItems: 6, maxItems: 6 },
            question: { type: 'string', minLength: 1, maxLength: 200 },
            category: { enum: ['career', 'love', 'health', 'wealth', 'study', 'other'] },
            templateId: { type: 'string' },
          },
        },
      },
    },
    async (request: FastifyRequest<{ Body: InterpretWithQuestionRequest }>, reply: FastifyReply) => {
      try {
        const payload = request.body;

        // 服务端字数验证
        if (payload.question.length > 200) {
          return reply.code(400).send({
            error: 'INVALID_QUESTION',
            message: '问题不能超过200字',
          });
        }

        const interpretation = await interpretationService.getInterpretationWithQuestion(payload);
        return reply.code(200).send(interpretation);
      } catch (error) {
        // 详细错误记录到日志（包含堆栈）
        request.log.error(error, 'Failed to get question interpretation');

        // 返回给客户端的错误信息（不泄露内部细节）
        if (error instanceof Error) {
          // 判断是否为 API 错误
          const isApiError = error.message.includes('API request failed') ||
                            error.message.includes('Gemini');

          if (isApiError) {
            return reply.code(502).send({
              error: 'AI_SERVICE_ERROR',
              message: 'AI 服务暂时不可用，请稍后重试',
            });
          }
        }

        // 其他未知错误
        return reply.code(500).send({
          error: 'INTERNAL_SERVER_ERROR',
          message: '服务器内部错误，请稍后重试',
        });
      }
    }
  );
}
