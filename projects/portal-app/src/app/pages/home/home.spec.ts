import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { beforeEach, describe, expect, it } from 'vitest';

import { Home } from './home';

describe('Home', () => {
  let fixture: ComponentFixture<Home>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Home],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Home);
    fixture.detectChanges();
  });

  it('renders the Home heading', () => {
    const heading = fixture.debugElement.query(By.css('h2'));

    expect(heading.nativeElement.textContent).toContain('Home');
  });

  it('links to the health check', () => {
    const link = fixture.debugElement.query(By.css('a'));

    expect(link.nativeElement.textContent).toContain('Check API health');
    expect(link.nativeElement.getAttribute('href')).toBe('/health');
  });
});
