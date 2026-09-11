import { TestBed } from '@angular/core/testing';
import { Subject, throwError } from 'rxjs';

import { Health } from './health';
import { HealthApiService } from './health-api.service';

describe('Health', () => {
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
  });

  it('shows loading while the health check is pending', () => {
    const healthResult = new Subject<{ status: 'ok' }>();

    healthApi.checkHealth.mockReturnValue(
      healthResult.asObservable(),
    );

    const fixture = TestBed.createComponent(Health);

    fixture.componentInstance.checkHealth();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain(
      'Checking API health...',
    );

    healthResult.complete();
  });

  it('shows the successful API status', () => {
    const healthResult = new Subject<{ status: 'ok' }>();

    healthApi.checkHealth.mockReturnValue(
      healthResult.asObservable(),
    );

    const fixture = TestBed.createComponent(Health);

    fixture.componentInstance.checkHealth();

    healthResult.next({
      status: 'ok',
    });
    healthResult.complete();

    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain(
      'API status:',
    );
    expect(fixture.nativeElement.textContent).toContain('ok');
  });

  it('shows the API error message', () => {
    healthApi.checkHealth.mockReturnValue(
      throwError(() => new Error('Request failed.')),
    );

    const fixture = TestBed.createComponent(Health);

    fixture.componentInstance.checkHealth();
    fixture.detectChanges();

    const alert = fixture.nativeElement.querySelector(
      '[role="alert"]',
    );

    expect(alert?.textContent).toContain('Request failed.');
  });
});
