import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Subject, throwError } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { Health } from './health';
import { HealthApiService } from './health-api.service';

describe('Health', () => {
  let fixture: ComponentFixture<Health>;

  const healthApi = {
    checkHealth: vi.fn(),
  };

  beforeEach(async () => {
    healthApi.checkHealth.mockReset();

    await TestBed.configureTestingModule({
      imports: [Health],
      providers: [
        {
          provide: HealthApiService,
          useValue: healthApi,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Health);
    fixture.detectChanges();
  });

  it('starts idle', () => {
    const heading = fixture.debugElement.query(By.css('h2'));

    expect(heading.nativeElement.textContent).toContain('Health check');
    expect(fixture.nativeElement.textContent).not.toContain('Checking API health');
  });

  it('shows loading while the request is pending', () => {
    const response$ = new Subject<{ status: 'ok' }>();

    healthApi.checkHealth.mockReturnValue(response$);

    const button = fixture.debugElement.query(By.css('button'));

    button.nativeElement.click();
    fixture.detectChanges();

    expect(button.nativeElement.disabled).toBe(true);
    expect(fixture.nativeElement.textContent).toContain('Checking API health');
  });

  it('shows the API status after success', () => {
    const response$ = new Subject<{ status: 'ok' }>();

    healthApi.checkHealth.mockReturnValue(response$);

    const button = fixture.debugElement.query(By.css('button'));

    button.nativeElement.click();

    response$.next({
      status: 'ok',
    });

    fixture.detectChanges();

    const status = fixture.debugElement.query(By.css('strong'));

    expect(status.nativeElement.textContent).toContain('ok');
  });

  it('shows the normalized error message as an alert', () => {
    healthApi.checkHealth.mockReturnValue(
      throwError(() => new Error('Request failed.')),
    );

    const button = fixture.debugElement.query(By.css('button'));

    button.nativeElement.click();
    fixture.detectChanges();

    const alert = fixture.debugElement.query(By.css('[role="alert"]'));

    expect(alert.nativeElement.textContent).toContain(
      'Health check failed: Request failed.',
    );
  });
});
