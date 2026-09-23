import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';

const healthStatuses = {
  ok: 'ok',
} as const;

const invalidResponseMessage = 'Response could not be parsed.';
const requestFailedMessage = 'Request failed.';

interface HealthResponse {
  status: typeof healthStatuses.ok;
}

function isHealthResponse(value: unknown): value is HealthResponse {
  return (
    typeof value === 'object' &&
    value !== null &&
    'status' in value &&
    value.status === healthStatuses.ok
  );
}

@Injectable({
  providedIn: 'root',
})
export class HealthApiService {
  private readonly http = inject(HttpClient);

  checkHealth(): Observable<HealthResponse> {
    return this.http.get<unknown>('/api/health').pipe(
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
