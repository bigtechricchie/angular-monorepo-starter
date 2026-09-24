const healthStatuses = {
  ok: 'ok',
} as const;

export const healthEndpoint = '/api/health';

export interface HealthResponse {
  readonly status: typeof healthStatuses.ok;
}

export class InvalidHealthResponseError extends Error {
  constructor() {
    super('Response could not be parsed.');
    this.name = 'InvalidHealthResponseError';
  }
}

export function parseHealthResponse(
  value: unknown,
): HealthResponse {
  if (
    typeof value !== 'object' ||
    value === null ||
    Array.isArray(value) ||
    !('status' in value) ||
    value.status !== healthStatuses.ok
  ) {
    throw new InvalidHealthResponseError();
  }

  return {
    status: healthStatuses.ok,
  };
}
