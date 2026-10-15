import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { beforeEach, describe, expect, it } from 'vitest';

import { REFERENCE_TRANSLATION } from '../i18n';
import { App } from './app';

describe('App', () => {
  let fixture: ComponentFixture<App>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(App);
    fixture.detectChanges();
  });

  it('renders the Reference App heading', () => {
    const heading = fixture.debugElement.query(By.css('h1'));

    expect(heading.nativeElement.textContent).toContain(REFERENCE_TRANSLATION.app.title);
  });

  it('renders primary navigation', () => {
    const navigation = fixture.debugElement.query(By.css('nav'));

    expect(navigation).not.toBeNull();
    expect(navigation.attributes['aria-label']).toBe(
      REFERENCE_TRANSLATION.navigation.label,
    );
  });


  it('renders links to Home and Health', () => {
    const homeLink = fixture.debugElement.query(By.css('a[href="/"]'));
    const healthLink = fixture.debugElement.query(By.css('a[href="/health"]'));

    expect(homeLink.nativeElement.textContent).toContain(
      REFERENCE_TRANSLATION.navigation.home,
    );
    expect(healthLink.nativeElement.textContent).toContain(
      REFERENCE_TRANSLATION.navigation.health,
    );
  });
});
