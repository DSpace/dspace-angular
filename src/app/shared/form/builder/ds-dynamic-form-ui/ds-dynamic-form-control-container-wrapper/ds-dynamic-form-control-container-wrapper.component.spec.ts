import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DsDynamicFormControlContainerWrapperComponent } from './ds-dynamic-form-control-container-wrapper.component';

describe('DsDynamicFormControlContainerWrapperComponent', () => {
  let component: DsDynamicFormControlContainerWrapperComponent;
  let fixture: ComponentFixture<DsDynamicFormControlContainerWrapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DsDynamicFormControlContainerWrapperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DsDynamicFormControlContainerWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
