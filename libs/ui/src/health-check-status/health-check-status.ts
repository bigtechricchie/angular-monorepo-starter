import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-health-check-status',
  templateUrl: './health-check-status.html',
  styleUrl: './health-check-status.css',
})
export class HealthCheckStatus {
  readonly isLoading = input.required<boolean>();
  readonly status = input<string | undefined>();
  readonly errorMessage = input<string | undefined>();

  readonly description = input.required<string>();
  readonly actionLabel = input.required<string>();
  readonly loadingLabel = input.required<string>();
  readonly statusLabel = input.required<string>();

  readonly checkRequested = output<void>();
}
