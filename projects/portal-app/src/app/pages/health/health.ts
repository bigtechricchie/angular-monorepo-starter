import { Component, inject } from '@angular/core';

import { HealthApiService } from './health-api.service';

@Component({
  selector: 'app-portal-health',
  templateUrl: './health.html',
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
