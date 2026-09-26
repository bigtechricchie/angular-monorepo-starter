import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { HealthCheckStatus } from './health-check-status';

describe('HealthCheckStatus', () => {
  let fixture: ComponentFixture<HealthCheckStatus>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HealthCheckStatus],
    }).compileComponents();

    fixture = TestBed.createComponent(HealthCheckStatus);

    fixture.componentRef.setInput('actionLabel', 'Check service health');
    fixture.componentRef.setInput('loadingLabel', 'Checking service health...');
    fixture.componentRef.setInput('statusLabel', 'Service status:');
    fixture.componentRef.setInput('isLoading', false);

    fixture.detectChanges();
  });

  function query<T extends Element>(selector: string): T | null {
    return fixture.nativeElement.querySelector(selector);
  }

  it('renders the supplied action label', () => {
    expect(query<HTMLButtonElement>('button')?.textContent).toContain('Check service health');
  });

  it('renders no message in the initial state', () => {
    expect(query('.health-check-status__message')).toBeNull();
  });

  it('emits when health checking is requested', () => {
    const listener = vi.fn();

    fixture.componentInstance.checkRequested.subscribe(listener);
    query<HTMLButtonElement>('button')?.click();

    expect(listener).toHaveBeenCalledOnce();
  });

  it('shows loading state and disables the action', () => {
    fixture.componentRef.setInput('isLoading', true);
    fixture.detectChanges();

    expect(query<HTMLButtonElement>('button')?.disabled).toBe(true);
    expect(query('[role="status"]')?.textContent).toContain('Checking service health...');
  });

  it('shows an error', () => {
    fixture.componentRef.setInput('errorMessage', 'Request failed.');
    fixture.detectChanges();

    expect(query('[role="alert"]')?.textContent).toContain('Request failed.');
  });

  it('shows a successful status', () => {
    fixture.componentRef.setInput('status', 'ok');
    fixture.detectChanges();

    expect(query('[role="status"]')?.textContent).toContain('Service status:');
    expect(query('strong')?.textContent?.trim()).toBe('ok');
  });

  it('prefers loading over error and status', () => {
    fixture.componentRef.setInput('isLoading', true);
    fixture.componentRef.setInput('errorMessage', 'Request failed.');
    fixture.componentRef.setInput('status', 'ok');
    fixture.detectChanges();

    expect(query('[role="status"]')?.textContent).toContain('Checking service health...');
    expect(query('[role="alert"]')).toBeNull();
    expect(query('strong')).toBeNull();
  });

  it('prefers error over a previous status', () => {
    fixture.componentRef.setInput('errorMessage', 'Request failed.');
    fixture.componentRef.setInput('status', 'ok');
    fixture.detectChanges();

    expect(query('[role="alert"]')).not.toBeNull();
    expect(query('strong')).toBeNull();
  });
});
