import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NumberValueInputComponent } from './number-value-input.component';

describe('NumberValueInputComponent', () => {
  let component: NumberValueInputComponent;
  let fixture: ComponentFixture<NumberValueInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NumberValueInputComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NumberValueInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
