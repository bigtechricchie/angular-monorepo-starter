import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';

const invalidResponseMessage = 'Response could not be parsed.';
const requestFailedMessage = 'Request failed.';

const healthStatuses = {
  ok: 'ok',
} as const;

interface HealthResponse {
  status: typeof healthStatuses.ok;
}

@Injectable({
  providedIn: 'root',
})
export class HealthApiService {
  private readonly httpClient = inject(HttpClient);

  checkHealth(): Observable<HealthResponse> {
    return this.httpClient.get<unknown>('/api/health').pipe(
      map((response) => {
        if (!isHealthResponse(response)) {
          throw new Error(invalidResponseMessage);
        }

        return response;
      }),
      catchError((error: unknown) => {
        if (
          error instanceof Error &&
          error.message === invalidResponseMessage
        ) {
          return throwError(() => error);
        }

        return throwError(() => new Error(requestFailedMessage));
      }),
    );
  }
}

function isHealthResponse(value: unknown): value is HealthResponse {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  return (
    'status' in value &&
    value.status === healthStatuses.ok
  );
}
