import { Component, inject } from '@angular/core';
import { HealthCheckStatus } from '@lib/ui';

import { HealthApiService } from './health-api.service';

@Component({
  selector: 'app-portal-health',
  imports: [HealthCheckStatus],
  templateUrl: './health.html',
  providers: [HealthApiService],
})
export class Health {
  private readonly healthApi = inject(HealthApiService);

  protected readonly isLoading = this.healthApi.isLoading;
  protected readonly response = this.healthApi.response;
  protected readonly errorMessage = this.healthApi.errorMessage;

  protected checkHealth(): void {
    this.healthApi.checkHealth();
  }
}
