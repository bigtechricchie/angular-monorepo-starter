import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';

import { HealthApiService } from './health-api.service';

describe('HealthApiService', () => {
  let service: HealthApiService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        HealthApiService,
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(HealthApiService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('returns a valid health response', async () => {
    const result = firstValueFrom(service.checkHealth());

    const request = httpTestingController.expectOne('/api/health');

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

    const request = httpTestingController.expectOne('/api/health');

    request.flush({
      status: 'unexpected',
    });

    await expect(result).rejects.toThrow(
      'Response could not be parsed.',
    );
  });

  it('maps HTTP failures to a safe error', async () => {
    const result = firstValueFrom(service.checkHealth());

    const request = httpTestingController.expectOne('/api/health');

    request.flush(
      {},
      {
        status: 500,
        statusText: 'Internal Server Error',
      },
    );

    await expect(result).rejects.toThrow('Request failed.');
  });
});
