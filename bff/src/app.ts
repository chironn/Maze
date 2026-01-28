import Fastify from 'fastify';
import fastifyEnv from '@fastify/env';
import fastifyCors from '@fastify/cors';
import { envSchema, type EnvConfig } from './config/env.js';
import { GeminiClient } from './clients/geminiClient.js';
import { InterpretationService } from './services/interpretation.js';
import { interpretRoutes } from './routes/interpret.js';
import { interpretWithQuestionRoutes } from './routes/interpretWithQuestion.js';

export async function buildApp() {
  const fastify = Fastify({
    logger: {
      level: process.env.LOG_LEVEL || 'info',
    },
  });

  // 注册环境变量插件
  await fastify.register(fastifyEnv, {
    schema: envSchema,
    dotenv: true,
  });

  const config = fastify.config as EnvConfig;

  // 注册 CORS
  await fastify.register(fastifyCors, {
    origin: true, // 开发环境允许所有来源，生产环境需配置白名单
  });

  // 初始化服务
  const geminiClient = new GeminiClient(config);
  const interpretationService = new InterpretationService(geminiClient);

  // 注册路由
  await interpretRoutes(fastify, interpretationService);
  await interpretWithQuestionRoutes(fastify, interpretationService);

  // 健康检查
  fastify.get('/health', async () => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  });

  return fastify;
}
