import { request } from 'undici';
import type { EnvConfig } from '../config/env.js';
import type { AIHexagramInterpretation } from '../types/divination.js';

export class GeminiClient {
  private baseUrl: string;
  private apiKey: string;
  private model: string;
  private timeout: number;

  constructor(config: EnvConfig) {
    this.baseUrl = config.GEMINI_BASE_URL;
    this.apiKey = config.GEMINI_API_KEY;
    this.model = config.GEMINI_MODEL;
    this.timeout = config.REQUEST_TIMEOUT_MS;
  }

  async generateContent(prompt: string): Promise<AIHexagramInterpretation> {
    const url = `${this.baseUrl}/chat/completions`;

    const requestBody = {
      model: this.model,
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
    };

    const { statusCode, body } = await request(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify(requestBody),
      bodyTimeout: this.timeout,
      headersTimeout: this.timeout,
    });

    if (statusCode !== 200) {
      const errorText = await body.text();
      throw new Error(`Gemini API request failed with status ${statusCode}: ${errorText}`);
    }

    const data = await body.json() as any;
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error('Invalid response structure from Gemini API');
    }

    return JSON.parse(content) as AIHexagramInterpretation;
  }
}
