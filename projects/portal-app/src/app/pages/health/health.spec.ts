import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Subject, throwError } from 'rxjs';

import { Health } from './health';
import { HealthApiService } from './health-api.service';

describe('Health', () => {
  let fixture: ComponentFixture<Health>;

  const healthApi = {
    checkHealth: vi.fn(),
  };

  beforeEach(async () => {
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

    healthApi.checkHealth.mockReset();
  });

  it('starts idle', () => {
    expect(fixture.nativeElement.textContent).toContain('Health check');
    expect(fixture.nativeElement.textContent).not.toContain('Checking API');
  });

  it('shows loading while the request is pending', () => {
    const response$ = new Subject<{ status: 'ok' }>();

    healthApi.checkHealth.mockReturnValue(response$);

    const button: HTMLButtonElement =
      fixture.nativeElement.querySelector('button');

    button.click();
    fixture.detectChanges();

    expect(button.disabled).toBe(true);
    expect(fixture.nativeElement.textContent).toContain('Checking API');
  });

  it('shows the API status after success', () => {
    const response$ = new Subject<{ status: 'ok' }>();

    healthApi.checkHealth.mockReturnValue(response$);

    const button: HTMLButtonElement =
      fixture.nativeElement.querySelector('button');

    button.click();

    response$.next({
      status: 'ok',
    });

    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('API status: ok');
  });

  it('shows the normalized error message', () => {
    healthApi.checkHealth.mockReturnValue(
      throwError(() => new Error('Request failed.')),
    );

    const button: HTMLButtonElement =
      fixture.nativeElement.querySelector('button');

    button.click();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain(
      'Health check failed: Request failed.',
    );
  });
});
