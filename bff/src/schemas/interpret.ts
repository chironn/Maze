export const interpretRequestSchema = {
  type: 'object',
  required: ['lines', 'baseHex', 'changedHex', 'moving'],
  properties: {
    lines: {
      type: 'array',
      items: { type: 'number', enum: [6, 7, 8, 9] },
      minItems: 6,
      maxItems: 6,
    },
    baseHex: {
      type: 'string',
      pattern: '^[01]{6}$',
    },
    changedHex: {
      type: 'string',
      pattern: '^[01]{6}$',
    },
    moving: {
      type: 'array',
      items: { type: 'boolean' },
      minItems: 6,
      maxItems: 6,
    },
  },
};

export const interpretResponseSchema = {
  type: 'object',
  required: ['name', 'judgement', 'image', 'summary', 'lines'],
  properties: {
    name: {
      type: 'object',
      required: ['zh'],
      properties: {
        zh: { type: 'string' },
      },
    },
    judgement: {
      type: 'object',
      required: ['zh'],
      properties: {
        zh: { type: 'string' },
      },
    },
    image: {
      type: 'object',
      required: ['zh'],
      properties: {
        zh: { type: 'string' },
      },
    },
    summary: {
      type: 'object',
      required: ['zh'],
      properties: {
        zh: { type: 'string' },
      },
    },
    lines: {
      type: 'array',
      items: {
        type: 'object',
        required: ['lineNumber', 'zh'],
        properties: {
          lineNumber: { type: 'number', minimum: 1, maximum: 6 },
          zh: { type: 'string' },
        },
      },
    },
  },
};
