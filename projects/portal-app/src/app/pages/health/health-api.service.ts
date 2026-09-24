import { httpResource } from '@angular/common/http';
import { computed, Injectable, signal } from '@angular/core';
import {
  healthEndpoint,
  InvalidHealthResponseError,
  parseHealthResponse,
  type HealthResponse,
} from '@lib/api';

const invalidResponseMessage = 'Response could not be parsed.';
const requestFailedMessage = 'Request failed.';

@Injectable({
  providedIn: 'root',
})
export class HealthApiService {
  private readonly requestAttempt = signal(0);

  private readonly healthResource = httpResource<HealthResponse>(
    () => {
      const requestAttempt = this.requestAttempt();

      return requestAttempt === 0
        ? undefined
        : healthEndpoint;
    },
    {
      parse: parseHealthResponse,
    },
  );

  readonly isLoading = this.healthResource.isLoading;

  readonly response = computed(() =>
    this.healthResource.hasValue()
      ? this.healthResource.value()
      : undefined,
  );

  readonly errorMessage = computed(() => {
    const error = this.healthResource.error();

    if (!error) {
      return undefined;
    }

    if (error instanceof InvalidHealthResponseError) {
      return invalidResponseMessage;
    }

    return requestFailedMessage;
  });

  checkHealth(): void {
    this.requestAttempt.update(
      (attempt) => attempt + 1,
    );
  }
}
