// Load the implementations that should be tested
import {
  ChangeDetectorRef,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
} from '@angular/core';
import {
  ComponentFixture,
  inject,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import {
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { By } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

import { createTestComponent } from '../../testing/utils.test';
import { NumberPickerComponent } from './number-picker.component';

describe('NumberPickerComponent test suite', () => {

  let testComp: TestComponent;
  let numberPickerComp: NumberPickerComponent;
  let testFixture: ComponentFixture<TestComponent>;
  let numberPickerFixture: ComponentFixture<NumberPickerComponent>;
  let html;

  // waitForAsync beforeEach
  beforeEach(waitForAsync(() => {

    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        NgbModule,
        TranslateModule.forRoot(),
        NumberPickerComponent,
        TestComponent,
      ],
      providers: [
        ChangeDetectorRef,
        NumberPickerComponent,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    });

  }));

  // synchronous beforeEach
  beforeEach(() => {
    html = `
      <ds-number-picker
        [disabled]="disabled"
        [min]="min"
        [max]="max"
        [id]="'ds_test_field'"
        [name]="'test'"
        [size]="size"
        [(ngModel)]="initValue"
        [value]="value"
        [invalid]="showErrorMessages"
        [placeholder]="'test'"
        (blur)="onBlur($event)"
        (change)="onChange($event)"
        (focus)="onFocus($event)"></ds-number-picker>`;

    testFixture = createTestComponent(html, TestComponent) as ComponentFixture<TestComponent>;
    testComp = testFixture.componentInstance;
  });

  it('should create NumberPickerComponent', inject([NumberPickerComponent], (app: NumberPickerComponent) => {
    expect(app).toBeDefined();
  }));

  beforeEach(() => {
    numberPickerFixture = TestBed.createComponent(NumberPickerComponent);
    numberPickerComp = numberPickerFixture.componentInstance; // NumberPickerComponent test instance
    numberPickerFixture.detectChanges();
  });

  afterEach(() => {
    numberPickerFixture.destroy();
    numberPickerComp = null;
  });

  it('should use default value when component\'s property is not passed', () => {

    expect(numberPickerComp.min).toBe(0);
    expect(numberPickerComp.max).toBe(100);
    expect(numberPickerComp.size).toBe(1);
    expect(numberPickerComp.step).toBe(1);
  });

  it('should increase value', () => {
    numberPickerComp.startValue = 0;
    numberPickerComp.toggleUp();

    expect(numberPickerComp.value).toBe(0);

    numberPickerComp.toggleUp();

    expect(numberPickerComp.value).toBe(1);
  });

  it('should set min value when the value exceeds the max', () => {
    numberPickerComp.value = 100;
    numberPickerComp.toggleUp();

    expect(numberPickerComp.value).toBe(0);

  });

  it('should decrease value', () => {
    numberPickerComp.startValue = 2;
    numberPickerComp.toggleDown();

    expect(numberPickerComp.value).toBe(2);

    numberPickerComp.toggleDown();

    expect(numberPickerComp.value).toBe(1);
  });

  it('should set max value when the value is less than the min', () => {
    numberPickerComp.value = 0;
    numberPickerComp.toggleDown();

    expect(numberPickerComp.value).toBe(100);

  });

  it('should update value on input type', () => {
    const de = numberPickerFixture.debugElement.query(By.css('input.form-control'));
    const inputEl = de.nativeElement;

    inputEl.value = 99;
    inputEl.dispatchEvent(new Event('change'));

    expect(numberPickerComp.value).toBe(99);
  });

  it('should not update value when input value is invalid', () => {
    const de = numberPickerFixture.debugElement.query(By.css('input.form-control'));
    const inputEl = de.nativeElement;

    inputEl.value = 101;
    inputEl.dispatchEvent(new Event('change'));

    expect(numberPickerComp.value).toBe(undefined);
  });

});

// declare a test component
@Component({
  selector: 'ds-test-cmp',
  template: ``,
  standalone: true,
  imports: [
    FormsModule,
    NgbModule,
    NumberPickerComponent,
    ReactiveFormsModule,
  ],
})
class TestComponent {

  public disabled = false;
  public max = 100;
  public min = 0;
  public initValue = 0;
  public size = 4;
  public value;

}
