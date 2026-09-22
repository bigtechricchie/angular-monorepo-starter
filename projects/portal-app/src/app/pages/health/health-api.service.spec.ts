import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

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

  it('returns a validated health response', () => {
    service.checkHealth().subscribe((response) => {
      expect(response).toEqual({
        status: 'ok',
      });
    });

    const request = httpController.expectOne('/api/health');

    expect(request.request.method).toBe('GET');

    request.flush({
      status: 'ok',
    });
  });

  it('rejects an invalid health response', () => {
    service.checkHealth().subscribe({
      error: (error: Error) => {
        expect(error.message).toBe('Response could not be parsed.');
      },
    });

    const request = httpController.expectOne('/api/health');

    request.flush({
      status: 'unexpected',
    });
  });

  it('normalizes request failures', () => {
    service.checkHealth().subscribe({
      error: (error: Error) => {
        expect(error.message).toBe('Request failed.');
      },
    });

    const request = httpController.expectOne('/api/health');

    request.flush('Server error', {
      status: 500,
      statusText: 'Internal Server Error',
    });
  });
});
