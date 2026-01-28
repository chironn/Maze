export interface EnvConfig {
  GEMINI_API_KEY: string;
  GEMINI_MODEL: string;
  GEMINI_BASE_URL: string;
  PORT: number;
  NODE_ENV: string;
  LOG_LEVEL: string;
  REQUEST_TIMEOUT_MS: number;
}

export const envSchema = {
  type: 'object',
  required: ['GEMINI_API_KEY', 'GEMINI_MODEL', 'GEMINI_BASE_URL'],
  properties: {
    GEMINI_API_KEY: { type: 'string' },
    GEMINI_MODEL: { type: 'string', default: 'gemini-3-flash' },
    GEMINI_BASE_URL: { type: 'string', default: 'http://127.0.0.1:8045/v1' },
    PORT: { type: 'number', default: 3000 },
    NODE_ENV: { type: 'string', default: 'development' },
    LOG_LEVEL: { type: 'string', default: 'info' },
    REQUEST_TIMEOUT_MS: { type: 'number', default: 15000 },
  },
};
