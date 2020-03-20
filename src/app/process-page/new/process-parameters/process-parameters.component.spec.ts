import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessParametersComponent } from './process-parameters.component';

describe('ProcessParametersComponent', () => {
  let component: ProcessParametersComponent;
  let fixture: ComponentFixture<ProcessParametersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcessParametersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessParametersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
