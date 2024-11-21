// Load the implementations that should be tested
import {
  ChangeDetectorRef,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  EventEmitter,
  Renderer2,
} from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  inject,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import {
  UntypedFormControl,
  UntypedFormGroup,
} from '@angular/forms';
import { By } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {
  DynamicFormLayoutService,
  DynamicFormValidationService,
} from '@ng-dynamic-forms/core';
import { TranslateService } from '@ngx-translate/core';
import { of as observableOf } from 'rxjs';

import {
  mockDynamicFormLayoutService,
  mockDynamicFormValidationService,
} from '../../../../../testing/dynamic-form-mock-services';
import { createTestComponent } from '../../../../../testing/utils.test';
import { DsDatePickerComponent } from './date-picker.component';
import { DynamicDsDatePickerModel } from './date-picker.model';

export const DATE_TEST_GROUP = new UntypedFormGroup({
  date: new UntypedFormControl(),
});

export const DATE_TEST_MODEL_CONFIG = {
  disabled: false,
  errorMessages: { required: 'You must enter at least the year.' },
  id: 'date',
  label: 'Date',
  name: 'date',
  placeholder: 'Date',
  readOnly: false,
  required: true,
  repeatable: false,
  toggleIcon: 'fas fa-calendar',
};

describe('DsDatePickerComponent test suite', () => {

  let testComp: TestComponent;
  let dateComp: DsDatePickerComponent;
  let testFixture: ComponentFixture<TestComponent>;
  let dateFixture: ComponentFixture<DsDatePickerComponent>;
  let html;

  const renderer2: Renderer2 = {
    selectRootElement: jasmine.createSpy('selectRootElement'),
    querySelector: jasmine.createSpy('querySelector'),
  } as unknown as Renderer2;

  // waitForAsync beforeEach
  beforeEach(waitForAsync(() => {

    const translateServiceStub = {
      get: () => observableOf('test-message'),
      onLangChange: new EventEmitter(),
      onTranslationChange: new EventEmitter(),
      onDefaultLangChange: new EventEmitter(),
    };

    TestBed.configureTestingModule({
      imports: [
        NgbModule,
        DsDatePickerComponent,
        TestComponent,
      ],
      providers: [
        ChangeDetectorRef,
        DsDatePickerComponent,
        { provide: TranslateService, useValue: translateServiceStub },
        { provide: DynamicFormLayoutService, useValue: mockDynamicFormLayoutService },
        { provide: DynamicFormValidationService, useValue: mockDynamicFormValidationService },
        { provide: Renderer2, useValue: renderer2 },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    });

  }));

  describe('', () => {
    // synchronous beforeEach
    beforeEach(() => {
      html = `
           <ds-date-picker
            [bindId]='bindId'
            [group]='group'
            [model]='model'
            [legend]='legend'
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

  describe('', () => {
    describe('when init model value is empty', () => {
      beforeEach(() => {

        dateFixture = TestBed.createComponent(DsDatePickerComponent);
        dateComp = dateFixture.componentInstance; // FormComponent test instance
        dateComp.group = DATE_TEST_GROUP;
        dateComp.model = new DynamicDsDatePickerModel(DATE_TEST_MODEL_CONFIG);
        dateFixture.detectChanges();
      });

      it('should init component properly', () => {
        expect(dateComp.initialYear).toBeDefined();
        expect(dateComp.initialMonth).toBeDefined();
        expect(dateComp.initialDay).toBeDefined();
        expect(dateComp.maxYear).toBeDefined();
        expect(dateComp.disabledMonth).toBeTruthy();
        expect(dateComp.disabledDay).toBeTruthy();
      });

      it('should set year and enable month field when year field is entered', () => {
        const event = {
          field: 'year',
          value: '1983',
        };
        dateComp.onChange(event);

        expect(dateComp.year).toEqual('1983');
        expect(dateComp.disabledMonth).toBeFalsy();
        expect(dateComp.disabledDay).toBeTruthy();
      });

      it('should set month and enable day field when month field is entered', () => {
        const event = {
          field: 'month',
          value: '11',
        };

        dateComp.year = '1983';
        dateComp.disabledMonth = false;
        dateFixture.detectChanges();

        dateComp.onChange(event);

        expect(dateComp.year).toEqual('1983');
        expect(dateComp.month).toEqual('11');
        expect(dateComp.disabledMonth).toBeFalsy();
        expect(dateComp.disabledDay).toBeFalsy();
      });

      it('should set day when day field is entered', () => {
        const event = {
          field: 'day',
          value: '18',
        };

        dateComp.year = '1983';
        dateComp.month = '11';
        dateComp.disabledMonth = false;
        dateComp.disabledDay = false;
        dateFixture.detectChanges();

        dateComp.onChange(event);

        expect(dateComp.year).toEqual('1983');
        expect(dateComp.month).toEqual('11');
        expect(dateComp.day).toEqual('18');
        expect(dateComp.disabledMonth).toBeFalsy();
        expect(dateComp.disabledDay).toBeFalsy();
      });

      it('should emit blur Event onBlur', () => {
        spyOn(dateComp.blur, 'emit');
        dateComp.onBlur(new Event('blur'));
        expect(dateComp.blur.emit).toHaveBeenCalled();
      });

      it('should emit focus Event onFocus', () => {
        spyOn(dateComp.focus, 'emit');
        dateComp.onFocus(new Event('focus'));
        expect(dateComp.focus.emit).toHaveBeenCalled();
      });
    });

    describe('when init model value is not empty', () => {
      beforeEach(() => {

        dateFixture = TestBed.createComponent(DsDatePickerComponent);
        dateComp = dateFixture.componentInstance; // FormComponent test instance
        dateComp.group = DATE_TEST_GROUP;
        dateComp.model = new DynamicDsDatePickerModel(DATE_TEST_MODEL_CONFIG);
        dateComp.model.value = '1983-11-18';
        dateFixture.detectChanges();
      });

      it('should init component properly', () => {
        expect(dateComp.initialYear).toBeDefined();
        expect(dateComp.initialMonth).toBeDefined();
        expect(dateComp.initialDay).toBeDefined();
        expect(dateComp.maxYear).toBeDefined();
        expect(dateComp.year).toBe(1983);
        expect(dateComp.month).toBe(11);
        expect(dateComp.day).toBe(18);
        expect(dateComp.disabledMonth).toBeFalsy();
        expect(dateComp.disabledDay).toBeFalsy();
      });

      it('should disable month and day fields when year field is canceled', () => {
        const event = {
          field: 'year',
          value: null,
        };
        dateComp.onChange(event);

        expect(dateComp.year).not.toBeDefined();
        expect(dateComp.month).not.toBeDefined();
        expect(dateComp.day).not.toBeDefined();
        expect(dateComp.disabledMonth).toBeTruthy();
        expect(dateComp.disabledDay).toBeTruthy();
      });

      it('should disable day field when month field is canceled', () => {
        const event = {
          field: 'month',
          value: null,
        };
        dateComp.onChange(event);

        expect(dateComp.year).toBe(1983);
        expect(dateComp.month).not.toBeDefined();
        expect(dateComp.day).not.toBeDefined();
        expect(dateComp.disabledMonth).toBeFalsy();
        expect(dateComp.disabledDay).toBeTruthy();
      });

      it('should not disable day field when day field is canceled', () => {
        const event = {
          field: 'day',
          value: null,
        };
        dateComp.onChange(event);

        expect(dateComp.year).toBe(1983);
        expect(dateComp.month).toBe(11);
        expect(dateComp.day).not.toBeDefined();
        expect(dateComp.disabledMonth).toBeFalsy();
        expect(dateComp.disabledDay).toBeFalsy();
      });

      it('should move focus on month field when on year field and tab pressed', fakeAsync(() => {
        const event = {
          field: 'day',
          value: null,
        };
        const event1 = {
          field: 'month',
          value: null,
        };
        dateComp.onChange(event);
        dateComp.onChange(event1);

        const yearElement = dateFixture.debugElement.query(By.css(`#${dateComp.model.id}_year`));
        const monthElement = dateFixture.debugElement.query(By.css(`#${dateComp.model.id}_month`));

        yearElement.nativeElement.focus();
        dateFixture.detectChanges();

        expect(document.activeElement).toBe(yearElement.nativeElement);

        dateFixture.nativeElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'tab' }));
        dateFixture.detectChanges();

        tick(200);
        dateFixture.detectChanges();

        expect(document.activeElement).toBe(monthElement.nativeElement);
      }));

      it('should move focus on day field when on month field and tab pressed', fakeAsync(() => {
        const event = {
          field: 'day',
          value: null,
        };
        dateComp.onChange(event);

        const monthElement = dateFixture.debugElement.query(By.css(`#${dateComp.model.id}_month`));
        const dayElement = dateFixture.debugElement.query(By.css(`#${dateComp.model.id}_day`));

        monthElement.nativeElement.focus();
        dateFixture.detectChanges();

        expect(document.activeElement).toBe(monthElement.nativeElement);

        dateFixture.nativeElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'tab' }));
        dateFixture.detectChanges();

        tick(200);
        dateFixture.detectChanges();

        expect(document.activeElement).toBe(dayElement.nativeElement);
      }));

      it('should move focus on month field when on day field and shift tab pressed', fakeAsync(() => {
        const event = {
          field: 'day',
          value: null,
        };
        dateComp.onChange(event);

        const monthElement = dateFixture.debugElement.query(By.css(`#${dateComp.model.id}_month`));
        const dayElement = dateFixture.debugElement.query(By.css(`#${dateComp.model.id}_day`));

        dayElement.nativeElement.focus();
        dateFixture.detectChanges();

        expect(document.activeElement).toBe(dayElement.nativeElement);

        dateFixture.nativeElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'shift.tab' }));
        dateFixture.detectChanges();

        tick(200);
        dateFixture.detectChanges();

        expect(document.activeElement).toBe(monthElement.nativeElement);
      }));

      it('should move focus on year field when on month field and shift tab pressed', fakeAsync(() => {
        const yearElement = dateFixture.debugElement.query(By.css(`#${dateComp.model.id}_year`));
        const monthElement = dateFixture.debugElement.query(By.css(`#${dateComp.model.id}_month`));

        monthElement.nativeElement.focus();
        dateFixture.detectChanges();

        expect(document.activeElement).toBe(monthElement.nativeElement);

        dateFixture.nativeElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'shift.tab' }));
        dateFixture.detectChanges();

        tick(200);
        dateFixture.detectChanges();

        expect(document.activeElement).toBe(yearElement.nativeElement);
      }));

    });
  });

});

// declare a test component
@Component({
  selector: 'ds-test-cmp',
  template: ``,
  standalone: true,
  imports: [NgbModule],
})
class TestComponent {

  group = DATE_TEST_GROUP;

  model = new DynamicDsDatePickerModel(DATE_TEST_MODEL_CONFIG);

  showErrorMessages = false;

}
