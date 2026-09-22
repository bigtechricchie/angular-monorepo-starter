import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';

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

  it('renders the architecture reference heading', () => {
    const heading = fixture.debugElement.query(By.css('h2'));
    expect(heading.nativeElement.textContent).toContain('Architecture reference');
  });

  it('renders a link to the health example', () => {
    const link = fixture.debugElement.query(By.css('a[href="/health"]'));
    expect(link).not.toBeNull();
    expect(link?.nativeElement.textContent).toContain('View API health');
  });
});
