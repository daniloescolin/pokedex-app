import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Tipo } from './tipo';

describe('Tipo', () => {
  let component: Tipo;
  let fixture: ComponentFixture<Tipo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Tipo],
    }).compileComponents();

    fixture = TestBed.createComponent(Tipo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
