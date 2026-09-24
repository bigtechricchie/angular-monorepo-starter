import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { beforeEach, describe, expect, it } from 'vitest';

import { NotFound } from './not-found';

describe('NotFound', () => {
  let fixture: ComponentFixture<NotFound>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotFound],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(NotFound);
    fixture.detectChanges();
  });

  it('renders the not-found heading', () => {
    const heading = fixture.debugElement.query(By.css('h2'));

    expect(heading.nativeElement.textContent).toContain('Page not found');
  });

  it('links back to home', () => {
    const link = fixture.debugElement.query(By.css('a[href="/"]'));

    expect(link).not.toBeNull();
    expect(link?.nativeElement.textContent).toContain('Return home');
  });
});
