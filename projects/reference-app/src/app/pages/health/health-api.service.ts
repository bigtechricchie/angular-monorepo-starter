import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { healthEndpoint, InvalidHealthResponseError, parseHealthResponse, type HealthResponse } from '@lib/api';
import { catchError, map, throwError, type Observable } from 'rxjs';

const requestFailedMessage = 'Request failed.';

@Injectable({
  providedIn: 'root',
})
export class HealthApiService {
  private readonly http = inject(HttpClient);

  checkHealth(): Observable<HealthResponse> {
    return this.http.get<unknown>(healthEndpoint).pipe(
      map(parseHealthResponse),
      catchError((error: unknown) => {
        if (error instanceof InvalidHealthResponseError) {
          return throwError(() => error);
        }

        return throwError(
          () => new Error(requestFailedMessage)
        );
      })
    );
  }
}
