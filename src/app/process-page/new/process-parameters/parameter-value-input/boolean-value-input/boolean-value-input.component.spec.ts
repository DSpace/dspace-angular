import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BooleanValueInputComponent } from './boolean-value-input.component';

describe('StringValueInputComponent', () => {
  let component: BooleanValueInputComponent;
  let fixture: ComponentFixture<BooleanValueInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BooleanValueInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BooleanValueInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
