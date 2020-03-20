import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParameterSelectComponent } from './parameter-select.component';

describe('ParameterSelectComponent', () => {
  let component: ParameterSelectComponent;
  let fixture: ComponentFixture<ParameterSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParameterSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParameterSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
