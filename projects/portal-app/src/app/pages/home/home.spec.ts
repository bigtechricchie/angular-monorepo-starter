import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { beforeEach, describe, expect, it } from 'vitest';

import { PORTAL_TRANSLATION } from '../../../i18n';
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

    expect(heading.nativeElement.textContent).toContain(
      PORTAL_TRANSLATION.home.title,
    );
  });

  it('links to the health check', () => {
    const link = fixture.debugElement.query(By.css('a[href="/health"]'));

    expect(link).not.toBeNull();
    expect(link.nativeElement.textContent).toContain(
      PORTAL_TRANSLATION.home.healthLink,
    );
  });
});
