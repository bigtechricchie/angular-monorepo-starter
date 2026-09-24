import { HttpErrorResponse } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { InvalidHealthResponseError } from '@lib/api';
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

  function startRequest() {
    const result = firstValueFrom(service.checkHealth());
    const request = httpController.expectOne('/api/health');

    expect(request.request.method).toBe('GET');

    return { request, result };
  }

  async function rejectionOf(result: Promise<unknown>): Promise<unknown> {
    return result.catch((error: unknown) => error);
  }

  it('returns the parsed response rather than the raw body', async () => {
    const { request, result } = startRequest();

    request.flush({
      status: 'ok',
      unexpected: 'value',
    });

    await expect(result).resolves.toStrictEqual({
      status: 'ok',
    });
  });

  it('preserves invalid-response errors', async () => {
    const { request, result } = startRequest();

    request.flush({
      status: 'unexpected',
    });

    const error = await rejectionOf(result);

    expect(error).toBeInstanceOf(InvalidHealthResponseError);
    expect(error).toHaveProperty(
      'message',
      'Response could not be parsed.',
    );
  });

  it('normalizes HTTP failures', async () => {
    const { request, result } = startRequest();

    request.flush('internal detail: db password', {
      status: 500,
      statusText: 'Internal Server Error',
    });

    const error = await rejectionOf(result);

    expect(error).toBeInstanceOf(Error);
    expect(error).not.toBeInstanceOf(HttpErrorResponse);
    expect(error).not.toBeInstanceOf(InvalidHealthResponseError);
    expect(error).toHaveProperty('message', 'Request failed.');
    expect(String(error)).not.toContain('db password');
  });

  it('normalizes network failures', async () => {
    const { request, result } = startRequest();

    request.error(new ProgressEvent('error'));

    const error = await rejectionOf(result);

    expect(error).toBeInstanceOf(Error);
    expect(error).not.toBeInstanceOf(HttpErrorResponse);
    expect(error).toHaveProperty('message', 'Request failed.');
  });
});
