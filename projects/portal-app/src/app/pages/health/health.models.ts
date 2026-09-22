export const healthCheckStates = {
  idle: 'idle',
  loading: 'loading',
  success: 'success',
  error: 'error',
} as const;

export type HealthCheckState =
  | { state: typeof healthCheckStates.idle }
  | { state: typeof healthCheckStates.loading }
  | {
    state: typeof healthCheckStates.success;
    status: 'ok';
  }
  | {
    state: typeof healthCheckStates.error;
    message: string;
  };
