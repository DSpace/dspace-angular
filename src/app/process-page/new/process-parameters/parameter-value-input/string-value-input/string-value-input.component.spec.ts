import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StringValueInputComponent } from './string-value-input.component';

describe('StringValueInputComponent', () => {
  let component: StringValueInputComponent;
  let fixture: ComponentFixture<StringValueInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StringValueInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StringValueInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
