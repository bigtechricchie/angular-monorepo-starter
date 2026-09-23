import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';

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

  it('renders the Portal App heading', () => {
    const heading = fixture.debugElement.query(By.css('h1'));

    expect(heading.nativeElement.textContent).toContain(
      'Portal App',
    );
  });

  it('renders primary navigation', () => {
    const navigation = fixture.debugElement.query(
      By.css('nav[aria-label="Primary navigation"]'),
    );

    expect(navigation).not.toBeNull();
  });

  it('renders links to Home and Health', () => {
    const homeLink = fixture.debugElement.query(
      By.css('a[href="/"]'),
    );

    const healthLink = fixture.debugElement.query(
      By.css('a[href="/health"]'),
    );

    expect(homeLink.nativeElement.textContent).toContain('Home');
    expect(healthLink.nativeElement.textContent).toContain(
      'Health',
    );
  });
});
