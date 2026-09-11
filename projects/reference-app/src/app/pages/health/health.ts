import { Component, DestroyRef, inject, signal } from '@angular/core';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HealthApiService } from './health-api.service';
import {
  HealthCheckState,
  healthCheckStates,
} from './health.models';

@Component({
  selector: 'app-health',
  templateUrl: './health.html',
})
export class Health {
  private readonly destroyRef = inject(DestroyRef);
  private readonly healthApi = inject(HealthApiService);

  protected readonly states = healthCheckStates;

  readonly healthCheck = signal<HealthCheckState>({
    state: healthCheckStates.idle,
  });

  checkHealth(): void {
    this.healthCheck.set({
      state: healthCheckStates.loading,
    });

    this.healthApi.checkHealth().pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: (response) => {
        this.healthCheck.set({
          state: healthCheckStates.success,
          status: response.status,
        });
      },
      error: (error: Error) => {
        this.healthCheck.set({
          state: healthCheckStates.error,
          message: error.message,
        });
      },
    });
  }
}
