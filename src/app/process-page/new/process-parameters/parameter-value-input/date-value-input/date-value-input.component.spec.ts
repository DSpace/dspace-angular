import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DateValueInputComponent } from './date-value-input.component';

describe('StringValueInputComponent', () => {
  let component: DateValueInputComponent;
  let fixture: ComponentFixture<DateValueInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DateValueInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DateValueInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
