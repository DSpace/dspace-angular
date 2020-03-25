import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BooleanValueInputComponent } from './boolean-value-input.component';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('BooleanValueInputComponent', () => {
  let component: BooleanValueInputComponent;
  let fixture: ComponentFixture<BooleanValueInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BooleanValueInputComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BooleanValueInputComponent);
    component = fixture.componentInstance;
    spyOn(component.updateValue, 'emit');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit true onInit', () => {
    expect(component.updateValue.emit).toHaveBeenCalledWith(true);
  });
});
