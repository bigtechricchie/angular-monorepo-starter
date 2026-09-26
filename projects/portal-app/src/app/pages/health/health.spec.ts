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

  it('renders the page description', () => {
    expect(query('p')?.textContent).toContain('Check whether the API is available.');
  });

  it('checks API health when requested', () => {
    query<HTMLButtonElement>('button')?.click();

    expect(healthApi.checkHealth).toHaveBeenCalledOnce();
  });

  it('passes loading state to the shared health status', () => {
    healthApi.isLoading.set(true);
    fixture.detectChanges();

    expect(query<HTMLButtonElement>('button')?.disabled).toBe(true);
  });

  it('passes error state to the shared health status', () => {
    healthApi.errorMessage.set('Request failed.');
    fixture.detectChanges();

    expect(query('[role="alert"]')?.textContent).toContain('Request failed.');
  });

  it('passes response status to the shared health status', () => {
    healthApi.response.set({ status: 'ok' });
    fixture.detectChanges();

    expect(query('strong')?.textContent?.trim()).toBe('ok');
  });
});
