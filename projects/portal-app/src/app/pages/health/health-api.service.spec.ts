import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';

import { HealthApiService } from './health-api.service';

describe('HealthApiService', () => {
  let service: HealthApiService;
  let httpController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClientTesting()],
    });

    service = TestBed.inject(HealthApiService);
    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpController.verify();
  });

  it('returns a validated health response', async () => {
    const result = firstValueFrom(service.checkHealth());

    const request = httpController.expectOne('/api/health');

    expect(request.request.method).toBe('GET');

    request.flush({
      status: 'ok',
    });

    await expect(result).resolves.toEqual({
      status: 'ok',
    });
  });

  it('rejects an invalid health response', async () => {
    const result = firstValueFrom(service.checkHealth());

    const request = httpController.expectOne('/api/health');

    expect(request.request.method).toBe('GET');

    request.flush({
      status: 'unexpected',
    });

    await expect(result).rejects.toThrow('Response could not be parsed.');
  });

  it('normalizes request failures', async () => {
    const result = firstValueFrom(service.checkHealth());

    const request = httpController.expectOne('/api/health');

    expect(request.request.method).toBe('GET');

    request.flush('Server error', {
      status: 500,
      statusText: 'Internal Server Error',
    });

    await expect(result).rejects.toThrow('Request failed.');
  });
});
