import {
  HttpTestingController,
  provideHttpClientTesting,
  type TestRequest,
} from '@angular/common/http/testing';
import { ApplicationRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { HealthApiService } from './health-api.service';

type FlushBody = Parameters<TestRequest['flush']>[0];

const validHealthResponse = {
  status: 'ok',
} as const;

describe('HealthApiService', () => {
  let service: HealthApiService;
  let httpController: HttpTestingController;
  let applicationRef: ApplicationRef;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HealthApiService, provideHttpClientTesting()],
    });

    service = TestBed.inject(HealthApiService);
    httpController = TestBed.inject(HttpTestingController);
    applicationRef = TestBed.inject(ApplicationRef);
  });

  afterEach(() => {
    httpController.verify();
  });

  function startCheck(): TestRequest {
    service.checkHealth();
    TestBed.tick();

    const request = httpController.expectOne('/api/health');

    expect(request.request.method).toBe('GET');

    return request;
  }

  async function completeCheck(body: FlushBody): Promise<void> {
    startCheck().flush(body);

    await applicationRef.whenStable();
  }

  async function failCheckWithHttpError(): Promise<void> {
    startCheck().flush('internal detail: db password', {
      status: 500,
      statusText: 'Internal Server Error',
    });

    await applicationRef.whenStable();
  }

  it('does not request health before explicitly checked', () => {
    TestBed.tick();

    httpController.expectNone('/api/health');

    expect(service.isLoading()).toBe(false);
    expect(service.response()).toBeUndefined();
    expect(service.errorMessage()).toBeUndefined();
  });

  it('reports loading while the request is in flight', async () => {
    const request = startCheck();

    expect(service.isLoading()).toBe(true);

    request.flush(validHealthResponse);
    await applicationRef.whenStable();

    expect(service.isLoading()).toBe(false);
  });

  it('returns the parsed response rather than the raw body', async () => {
    await completeCheck({
      ...validHealthResponse,
      unexpected: 'value',
    });

    expect(service.response()).toStrictEqual(validHealthResponse);
    expect(service.errorMessage()).toBeUndefined();
  });

  it('reports invalid responses without exposing the body', async () => {
    const untrusted = 'secret-token-value';

    await completeCheck({
      status: untrusted,
    });

    expect(service.response()).toBeUndefined();
    expect(service.errorMessage()).toBe('Response could not be parsed.');
    expect(service.errorMessage()).not.toContain(untrusted);
  });

  it('normalizes HTTP failures without exposing details', async () => {
    await failCheckWithHttpError();

    expect(service.response()).toBeUndefined();
    expect(service.errorMessage()).toBe('Request failed.');
    expect(service.errorMessage()).not.toContain('db password');
  });

  it('normalizes network failures', async () => {
    startCheck().error(new ProgressEvent('error'));

    await applicationRef.whenStable();

    expect(service.response()).toBeUndefined();
    expect(service.errorMessage()).toBe('Request failed.');
  });

  it('does not keep a stale response after a failed re-check', async () => {
    await completeCheck(validHealthResponse);

    expect(service.response()).toStrictEqual(validHealthResponse);

    await failCheckWithHttpError();

    expect(service.response()).toBeUndefined();
    expect(service.errorMessage()).toBe('Request failed.');
  });

  it('clears a previous error after a successful re-check', async () => {
    await failCheckWithHttpError();

    expect(service.errorMessage()).toBe('Request failed.');

    await completeCheck(validHealthResponse);

    expect(service.errorMessage()).toBeUndefined();
    expect(service.response()).toStrictEqual(validHealthResponse);
  });
});
