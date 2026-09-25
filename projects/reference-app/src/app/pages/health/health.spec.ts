import { signal, type WritableSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import type { HealthResponse } from '@lib/api';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { Health } from './health';
import { HealthApiService } from './health-api.service';

describe('Health', () => {
  let fixture: ComponentFixture<Health>;
  let healthApi: {
    isLoading: WritableSignal<boolean>;
    response: WritableSignal<HealthResponse | undefined>;
    errorMessage: WritableSignal<string | undefined>;
    checkHealth: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    healthApi = {
      isLoading: signal(false),
      response: signal<HealthResponse | undefined>(undefined),
      errorMessage: signal<string | undefined>(undefined),
      checkHealth: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [Health],
    })
      .overrideComponent(Health, {
        set: {
          providers: [{ provide: HealthApiService, useValue: healthApi }],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(Health);
    fixture.detectChanges();
  });

  function query<T extends Element>(selector: string): T | null {
    return fixture.nativeElement.querySelector(selector);
  }

  it('renders the page heading', () => {
    expect(query('h2')?.textContent).toContain('Health');
  });

  it('shows no status or alert before a check', () => {
    expect(query('[role="status"]')).toBeNull();
    expect(query('[role="alert"]')).toBeNull();
    expect(query('strong')).toBeNull();
  });

  it('checks API health when requested', () => {
    query<HTMLButtonElement>('button')?.click();

    expect(healthApi.checkHealth).toHaveBeenCalledOnce();
  });

  it('shows loading state and disables the button', () => {
    healthApi.isLoading.set(true);
    fixture.detectChanges();

    expect(query<HTMLButtonElement>('button')?.disabled).toBe(true);
    expect(query('[role="status"]')?.textContent).toContain(
      'Checking API health...',
    );
  });

  it('shows an error message', () => {
    healthApi.errorMessage.set('Request failed.');
    fixture.detectChanges();

    expect(query('[role="alert"]')?.textContent).toContain(
      'Request failed.',
    );
  });

  it('shows a successful health response', () => {
    healthApi.response.set({
      status: 'ok',
    });
    fixture.detectChanges();

    expect(query('[role="status"]')?.textContent).toContain('API status:');
    expect(query('strong')?.textContent?.trim()).toBe('ok');
  });

  it('prefers the loading state over an error or previous response', () => {
    healthApi.isLoading.set(true);
    healthApi.errorMessage.set('Request failed.');
    healthApi.response.set({
      status: 'ok',
    });
    fixture.detectChanges();

    expect(query('[role="status"]')?.textContent).toContain(
      'Checking API health...',
    );
    expect(query('[role="alert"]')).toBeNull();
    expect(query('strong')).toBeNull();
  });

  it('prefers the error over a previous response', () => {
    healthApi.errorMessage.set('Request failed.');
    healthApi.response.set({
      status: 'ok',
    });
    fixture.detectChanges();

    expect(query('[role="alert"]')).not.toBeNull();
    expect(query('[role="status"]')).toBeNull();
    expect(query('strong')).toBeNull();
  });
});
