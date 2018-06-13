// Load the implementations that should be tested
import { ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, inject, TestBed, } from '@angular/core/testing';
import 'rxjs/add/observable/of';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SortablejsModule } from 'angular-sortablejs';
import { DsDatePickerComponent } from './date-picker.component';
import { FormControl, FormGroup } from '@angular/forms';
import { DynamicDsDatePickerModel } from './date-picker.model';

function createTestComponent<T>(html: string, type: { new(...args: any[]): T }): ComponentFixture<T> {
  TestBed.overrideComponent(type, {
    set: {template: html}
  });
  const fixture = TestBed.createComponent(type);

  fixture.detectChanges();
  return fixture as ComponentFixture<T>;
}

describe('Date Picker component', () => {

  let testComp: TestComponent;
  let testFixture: ComponentFixture<TestComponent>;
  let html;

  // async beforeEach
  beforeEach(async(() => {

    TestBed.configureTestingModule({
      imports: [
        NgbModule.forRoot()
      ],
      declarations: [
        DsDatePickerComponent,
        TestComponent,
      ], // declare the test component
      providers: [
        ChangeDetectorRef,
        DsDatePickerComponent,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });

  }));

  // synchronous beforeEach
  beforeEach(() => {
    html = `
           <ds-date-picker
            [bindId]='bindId'
            [group]='group'
            [model]='model'
            [showErrorMessages]='showErrorMessages'
            (blur)='onBlur($event)'
            (change)='onValueChange($event)'
            (focus)='onFocus($event)'></ds-date-picker>`;

    testFixture = createTestComponent(html, TestComponent) as ComponentFixture<TestComponent>;
    testComp = testFixture.componentInstance;
  });

  it('should create DsDatePickerComponent', inject([DsDatePickerComponent], (app: DsDatePickerComponent) => {

    expect(app).toBeDefined();
  }));

});

// declare a test component
@Component({
  selector: 'ds-test-cmp',
  template: ``
})
class TestComponent {

  group = new FormGroup({
    date: new FormControl(),
  });

  inputDateModelConfig = {
    disabled: false,
    errorMessages: { required: 'You must enter at least the year.' },
    id: 'date',
    label: 'Date',
    name: 'date',
    placeholder: 'Date',
    readOnly: false,
    required: true,
    toggleIcon: 'fa fa-calendar'
  };

  model = new DynamicDsDatePickerModel(this.inputDateModelConfig);

  showErrorMessages = false;

}
