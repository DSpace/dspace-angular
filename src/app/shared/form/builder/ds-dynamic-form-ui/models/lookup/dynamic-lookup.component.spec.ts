// Load the implementations that should be tested
import { ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { async, ComponentFixture, fakeAsync, inject, TestBed, tick, } from '@angular/core/testing';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AuthorityOptions } from '../../../../../../core/integration/models/authority-options.model';
import { DynamicFormsCoreModule, DynamicFormValidationService } from '@ng-dynamic-forms/core';
import { DynamicFormsNGBootstrapUIModule } from '@ng-dynamic-forms/ui-ng-bootstrap';
import { AuthorityService } from '../../../../../../core/integration/authority.service';
import { AuthorityServiceStub } from '../../../../../testing/authority-service-stub';
import { DsDynamicLookupComponent } from './dynamic-lookup.component';
import { DynamicLookupModel } from './dynamic-lookup.model';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { TranslateModule } from '@ngx-translate/core';
import { FormBuilderService } from '../../../form-builder.service';
import { FormService } from '../../../../form.service';
import { FormComponent } from '../../../../form.component';
import { FormFieldMetadataValueObject } from '../../../models/form-field-metadata-value.model';
import { By } from '@angular/platform-browser';
import { AuthorityValueModel } from '../../../../../../core/integration/models/authority-value.model';
import { DynamicLookupNameModel } from './dynamic-lookup-name.model';
import { createTestComponent } from '../../../../../testing/utils';

export const LOOKUP_TEST_MODEL_CONFIG = {
  authorityOptions: {
    closed: false,
    metadata: 'lookup',
    name: 'RPAuthority',
    scope: 'c1c16450-d56f-41bc-bb81-27f1d1eb5c23'
  } as AuthorityOptions,
  disabled: false,
  errorMessages: {required: 'Required field.'},
  id: 'lookup',
  label: 'Author',
  maxOptions: 10,
  name: 'lookup',
  placeholder: 'Author',
  readOnly: false,
  required: true,
  repeatable: true,
  separator: ',',
  validators: {required: null},
  value: undefined
};

export const LOOKUP_NAME_TEST_MODEL_CONFIG = {
  authorityOptions: {
    closed: false,
    metadata: 'lookup-name',
    name: 'RPAuthority',
    scope: 'c1c16450-d56f-41bc-bb81-27f1d1eb5c23'
  } as AuthorityOptions,
  disabled: false,
  errorMessages: {required: 'Required field.'},
  id: 'lookupName',
  label: 'Author',
  maxOptions: 10,
  name: 'lookupName',
  placeholder: 'Author',
  readOnly: false,
  required: true,
  repeatable: true,
  separator: ',',
  validators: {required: null},
  value: undefined
};

export const LOOKUP_TEST_GROUP = new FormGroup({
  lookup: new FormControl(),
  lookupName: new FormControl()
});

describe('Dynamic Lookup component', () => {

  let testComp: TestComponent;
  let lookupComp: DsDynamicLookupComponent;
  let testFixture: ComponentFixture<TestComponent>;
  let lookupFixture: ComponentFixture<DsDynamicLookupComponent>;
  let html;

  const authorityServiceStub = new AuthorityServiceStub();

  // async beforeEach
  beforeEach(async(() => {

    TestBed.configureTestingModule({
      imports: [
        DynamicFormsCoreModule,
        DynamicFormsNGBootstrapUIModule,
        FormsModule,
        InfiniteScrollModule,
        ReactiveFormsModule,
        NgbModule.forRoot(),
        TranslateModule.forRoot()
      ],
      declarations: [
        DsDynamicLookupComponent,
        TestComponent,
      ], // declare the test component
      providers: [
        ChangeDetectorRef,
        DsDynamicLookupComponent,
        DynamicFormValidationService,
        FormBuilderService,
        FormComponent,
        FormService,
        {provide: AuthorityService, useValue: authorityServiceStub},
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });

  }));

  describe('', () => {
    // synchronous beforeEach
    beforeEach(() => {
      html = `
      <ds-dynamic-lookup
        [bindId]="bindId"
        [group]="group"
        [model]="model"
        [showErrorMessages]="showErrorMessages"
        (blur)="onBlur($event)"
        (change)="onValueChange($event)"
        (focus)="onFocus($event)"></ds-dynamic-lookup>`;

      testFixture = createTestComponent(html, TestComponent) as ComponentFixture<TestComponent>;
      testComp = testFixture.componentInstance;
    });

    it('should create DsDynamicLookupComponent', inject([DsDynamicLookupComponent], (app: DsDynamicLookupComponent) => {
      expect(app).toBeDefined();
    }));
  });

  describe('when model is DynamicLookupModel', () => {

    describe('', () => {
      beforeEach(() => {

        lookupFixture = TestBed.createComponent(DsDynamicLookupComponent);
        lookupComp = lookupFixture.componentInstance; // FormComponent test instance
        lookupComp.group = LOOKUP_TEST_GROUP;
        lookupComp.model = new DynamicLookupModel(LOOKUP_TEST_MODEL_CONFIG);
        lookupFixture.detectChanges();
      });

      it('should render only an input element', () => {
        const de = lookupFixture.debugElement.queryAll(By.css('input.form-control'));
        expect(de.length).toBe(1);
      });

    });

    describe('and init model value is empty', () => {
      beforeEach(() => {

        lookupFixture = TestBed.createComponent(DsDynamicLookupComponent);
        lookupComp = lookupFixture.componentInstance; // FormComponent test instance
        lookupComp.group = LOOKUP_TEST_GROUP;
        lookupComp.model = new DynamicLookupModel(LOOKUP_TEST_MODEL_CONFIG);
        lookupFixture.detectChanges();
      });

      it('should init component properly', () => {
        expect(lookupComp.firstInputValue).toBe('');
      });

      it('should return search results', fakeAsync(() => {
        const de = lookupFixture.debugElement.queryAll(By.css('button'));
        const btnEl = de[0].nativeElement;
        const results$ = authorityServiceStub.getEntriesByName({} as  any);

        lookupComp.firstInputValue = 'test';
        lookupFixture.detectChanges();

        btnEl.click();
        tick();
        lookupFixture.detectChanges();
        results$.subscribe((results) => {
          expect(lookupComp.optionsList).toEqual(results.payload);
        })

      }));

      it('should select a results entry properly', fakeAsync(() => {
        let de = lookupFixture.debugElement.queryAll(By.css('button'));
        const btnEl = de[0].nativeElement;
        const selectedValue = Object.assign(new AuthorityValueModel(), {id: 1, display: 'one', value: 1});
        spyOn(lookupComp.change, 'emit');

        lookupComp.firstInputValue = 'test';
        lookupFixture.detectChanges();
        btnEl.click();
        tick();
        lookupFixture.detectChanges();
        de = lookupFixture.debugElement.queryAll(By.css('button.dropdown-item'));
        const entryEl = de[0].nativeElement;
        entryEl.click();

        expect(lookupComp.firstInputValue).toEqual('one');
        expect(lookupComp.model.value).toEqual(selectedValue);
        expect(lookupComp.change.emit).toHaveBeenCalled();
      }));

      it('should set model.value on input type when AuthorityOptions.closed is false', fakeAsync(() => {
        lookupComp.firstInputValue = 'test';
        lookupFixture.detectChanges();

        lookupComp.onInput(new Event('input'));
        expect(lookupComp.model.value).toEqual(new FormFieldMetadataValueObject('test'))

      }));

      it('should not set model.value on input type when AuthorityOptions.closed is true', () => {
        lookupComp.model.authorityOptions.closed = true;
        lookupComp.firstInputValue = 'test';
        lookupFixture.detectChanges();

        lookupComp.onInput(new Event('input'));
        expect(lookupComp.model.value).not.toBeDefined();

      });
    });

    describe('and init model value is not empty', () => {
      beforeEach(() => {

        lookupFixture = TestBed.createComponent(DsDynamicLookupComponent);
        lookupComp = lookupFixture.componentInstance; // FormComponent test instance
        lookupComp.group = LOOKUP_TEST_GROUP;
        lookupComp.model = new DynamicLookupModel(LOOKUP_TEST_MODEL_CONFIG);
        lookupComp.model.value = new FormFieldMetadataValueObject('test', null, 'test001');
        lookupFixture.detectChanges();

        // spyOn(store, 'dispatch');
      });

      it('should init component properly', () => {
        expect(lookupComp.firstInputValue).toBe('test')
      });
    });
  });

  describe('when model is DynamicLookupNameModel', () => {

    describe('', () => {
      beforeEach(() => {

        lookupFixture = TestBed.createComponent(DsDynamicLookupComponent);
        lookupComp = lookupFixture.componentInstance; // FormComponent test instance
        lookupComp.group = LOOKUP_TEST_GROUP;
        lookupComp.model = new DynamicLookupNameModel(LOOKUP_NAME_TEST_MODEL_CONFIG);
        lookupFixture.detectChanges();

        // spyOn(store, 'dispatch');
      });

      it('should render two input element', () => {
        const de = lookupFixture.debugElement.queryAll(By.css('input.form-control'));
        expect(de.length).toBe(2);
      });

    });

    describe('and init model value is empty', () => {

      beforeEach(() => {

        lookupFixture = TestBed.createComponent(DsDynamicLookupComponent);
        lookupComp = lookupFixture.componentInstance; // FormComponent test instance
        lookupComp.group = LOOKUP_TEST_GROUP;
        lookupComp.model = new DynamicLookupNameModel(LOOKUP_NAME_TEST_MODEL_CONFIG);
        lookupFixture.detectChanges();
      });

      it('should select a results entry properly', fakeAsync(() => {
        const payload = [
          Object.assign(new AuthorityValueModel(), {id: 1, display: 'Name, Lastname', value: 1}),
          Object.assign(new AuthorityValueModel(), {id: 2, display: 'NameTwo, LastnameTwo', value: 2}),
        ];
        let de = lookupFixture.debugElement.queryAll(By.css('button'));
        const btnEl = de[0].nativeElement;
        const selectedValue = Object.assign(new AuthorityValueModel(), {id: 1, display: 'Name, Lastname', value: 1});

        spyOn(lookupComp.change, 'emit');
        authorityServiceStub.setNewPayload(payload);
        lookupComp.firstInputValue = 'test';
        lookupFixture.detectChanges();
        btnEl.click();
        tick();
        lookupFixture.detectChanges();
        de = lookupFixture.debugElement.queryAll(By.css('button.dropdown-item'));
        const entryEl = de[0].nativeElement;
        entryEl.click();

        expect(lookupComp.firstInputValue).toEqual('Name');
        expect(lookupComp.secondInputValue).toEqual('Lastname');
        expect(lookupComp.model.value).toEqual(selectedValue);
        expect(lookupComp.change.emit).toHaveBeenCalled();
      }));

    });

    describe('and init model value is not empty', () => {
      beforeEach(() => {

        lookupFixture = TestBed.createComponent(DsDynamicLookupComponent);
        lookupComp = lookupFixture.componentInstance; // FormComponent test instance
        lookupComp.group = LOOKUP_TEST_GROUP;
        lookupComp.model = new DynamicLookupNameModel(LOOKUP_NAME_TEST_MODEL_CONFIG);
        lookupComp.model.value = new FormFieldMetadataValueObject('Name, Lastname', null, 'test001');
        lookupFixture.detectChanges();

      });

      it('should init component properly', () => {
        expect(lookupComp.firstInputValue).toBe('Name');
        expect(lookupComp.secondInputValue).toBe('Lastname');
      });
    });

  });
});

// declare a test component
@Component({
  selector: 'ds-test-cmp',
  template: ``
})
class TestComponent {

  group: FormGroup = LOOKUP_TEST_GROUP;

  inputLookupModelConfig = LOOKUP_TEST_MODEL_CONFIG;

  model = new DynamicLookupModel(this.inputLookupModelConfig);

  showErrorMessages = false;

}
