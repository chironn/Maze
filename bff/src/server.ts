import { buildApp } from './app.js';

async function start() {
  try {
    const app = await buildApp();
    const port = (app.config as any).PORT || 3000;
    const host = '0.0.0.0';

    await app.listen({ port, host });

    app.log.info(`BFF server listening on http://${host}:${port}`);
    app.log.info(`Health check: http://${host}:${port}/health`);
    app.log.info(`API endpoint: http://${host}:${port}/api/interpret`);
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

start();
