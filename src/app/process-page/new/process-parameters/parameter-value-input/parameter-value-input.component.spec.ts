import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParameterValueInputComponent } from './parameter-value-input.component';

describe('ParameterValueInputComponent', () => {
  let component: ParameterValueInputComponent;
  let fixture: ComponentFixture<ParameterValueInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParameterValueInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParameterValueInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
