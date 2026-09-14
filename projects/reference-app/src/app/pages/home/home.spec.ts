import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { Home } from './home';

describe('Home', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Home],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('renders the architecture reference heading', () => {
    const fixture = TestBed.createComponent(Home);

    fixture.detectChanges();

    const heading = fixture.nativeElement.querySelector('h2');

    expect(heading?.textContent).toContain(
      'Architecture reference',
    );
  });

  it('renders a link to the health example', () => {
    const fixture = TestBed.createComponent(Home);

    fixture.detectChanges();

    const link = fixture.nativeElement.querySelector(
      'a[href="/health"]',
    );

    expect(link).not.toBeNull();
    expect(link?.textContent).toContain('View API health');
  });
});
