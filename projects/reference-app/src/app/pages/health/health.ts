import { Component, inject } from '@angular/core';
import { HealthCheckStatus } from '@lib/ui';

import { REFERENCE_TRANSLATION } from '../../../i18n';
import { HealthApiService } from './health-api.service';

@Component({
  selector: 'app-reference-health',
  imports: [HealthCheckStatus],
  templateUrl: './health.html',
  providers: [HealthApiService],
})
export class Health {
  private readonly healthApi = inject(HealthApiService);

  protected readonly errorMessage = this.healthApi.errorMessage;
  protected readonly isLoading = this.healthApi.isLoading;
  protected readonly response = this.healthApi.response;
  protected readonly translation = REFERENCE_TRANSLATION.health;

  protected checkHealth(): void {
    this.healthApi.checkHealth();
  }
}
