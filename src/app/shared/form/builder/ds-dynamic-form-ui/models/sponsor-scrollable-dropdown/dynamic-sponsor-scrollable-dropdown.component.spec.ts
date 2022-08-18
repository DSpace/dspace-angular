import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { VocabularyOptions } from '../../../../../../core/submission/vocabularies/models/vocabulary-options.model';
import { ComponentFixture, inject, TestBed, waitForAsync } from '@angular/core/testing';
import { VocabularyServiceStub } from '../../../../../testing/vocabulary-service.stub';
import { DynamicFormLayoutService, DynamicFormsCoreModule, DynamicFormValidationService } from '@ng-dynamic-forms/core';
import { DynamicFormsNGBootstrapUIModule } from '@ng-dynamic-forms/ui-ng-bootstrap';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { VocabularyService } from '../../../../../../core/submission/vocabularies/vocabulary.service';
import {
  mockDynamicFormLayoutService,
  mockDynamicFormValidationService
 } from '../../../../../testing/dynamic-form-mock-services';
import { createTestComponent } from '../../../../../testing/utils.test';
import { DynamicScrollableDropdownModel } from '../scrollable-dropdown/dynamic-scrollable-dropdown.model';
import { DsDynamicSponsorScrollableDropdownComponent } from './dynamic-sponsor-scrollable-dropdown.component';
import { VocabularyEntry } from '../../../../../../core/submission/vocabularies/models/vocabulary-entry.model';
import {
  DEFAULT_EU_DISPLAY_VALUE,
  DEFAULT_EU_STORAGE_VALUE
 } from '../sponsor-autocomplete/ds-dynamic-sponsor-autocomplete.model';
import { take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { isNotEmpty } from '../../../../../empty.util';

export const SD_TEST_GROUP = new FormGroup({
  dropdown: new FormControl(),
});

export const SD_TEST_MODEL_CONFIG = {
  vocabularyOptions: {
    closed: false,
    name: 'common_iso_languages'
  } as VocabularyOptions,
  disabled: false,
  errorMessages: { required: 'Required field.' },
  id: 'dropdown',
  label: 'Language',
  maxOptions: 10,
  name: 'dropdown',
  placeholder: 'Language',
  readOnly: false,
  required: false,
  repeatable: false,
  value: undefined,
  metadataFields: [],
  submissionId: '1234',
  hasSelectableMetadata: false
};

export const OWN_FUNDS_VALUE = 'Own funds';

export const FUNDING_TYPE_OPTIONS = [
  Object.assign(new VocabularyEntry(), { authority: 1, display: 'N/A', value: null }),
  Object.assign(new VocabularyEntry(), { authority: 2, display: DEFAULT_EU_DISPLAY_VALUE, value: DEFAULT_EU_STORAGE_VALUE }),
  Object.assign(new VocabularyEntry(), { authority: 2, display: OWN_FUNDS_VALUE, value: 'ownFunds' }),
];

describe('Dynamic Dynamic Sponsor Scrollable Dropdown component', () => {

  let testComp: TestComponent;
  let scrollableDropdownComp: DsDynamicSponsorScrollableDropdownComponent;
  let testFixture: ComponentFixture<TestComponent>;
  let scrollableDropdownFixture: ComponentFixture<DsDynamicSponsorScrollableDropdownComponent>;
  let html;

  const vocabularyServiceStub = new VocabularyServiceStub();
  vocabularyServiceStub.setNewPayload(FUNDING_TYPE_OPTIONS);

  // waitForAsync beforeEach
  beforeEach(waitForAsync(() => {

    TestBed.configureTestingModule({
      imports: [
        DynamicFormsCoreModule,
        DynamicFormsNGBootstrapUIModule,
        FormsModule,
        InfiniteScrollModule,
        ReactiveFormsModule,
        NgbModule,
        TranslateModule.forRoot()
      ],
      declarations: [
        DsDynamicSponsorScrollableDropdownComponent,
        TestComponent,
      ], // declare the test component
      providers: [
        ChangeDetectorRef,
        DsDynamicSponsorScrollableDropdownComponent,
        { provide: VocabularyService, useValue: vocabularyServiceStub },
        { provide: DynamicFormLayoutService, useValue: mockDynamicFormLayoutService },
        { provide: DynamicFormValidationService, useValue: mockDynamicFormValidationService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });

  }));

  describe('', () => {
    // synchronous beforeEach
    beforeEach(() => {
      html = `
      <ds-dynamic-sponsor-scrollable-dropdown [bindId]="bindId"
                                      [group]="group"
                                      [model]="model"
                                      (blur)="onBlur($event)"
                                      (change)="onValueChange($event)"
                                      (focus)="onFocus($event)"></ds-dynamic-sponsor-scrollable-dropdown>`;

      testFixture = createTestComponent(html, TestComponent) as ComponentFixture<TestComponent>;
      testComp = testFixture.componentInstance;
    });

    it('should create DsDynamicSponsorScrollableDropdownComponent', inject([DsDynamicSponsorScrollableDropdownComponent], (app: DsDynamicSponsorScrollableDropdownComponent) => {

      expect(app).toBeDefined();
    }));
  });

  describe('when init model value is empty', () => {
    beforeEach(() => {

      scrollableDropdownFixture = TestBed.createComponent(DsDynamicSponsorScrollableDropdownComponent);
      scrollableDropdownComp = scrollableDropdownFixture.componentInstance; // FormComponent test instance
      scrollableDropdownComp.group = SD_TEST_GROUP;
      scrollableDropdownComp.model = new DynamicScrollableDropdownModel(SD_TEST_MODEL_CONFIG);
      scrollableDropdownFixture.detectChanges();
    });

    afterEach(() => {
      scrollableDropdownFixture.destroy();
      scrollableDropdownComp = null;
    });

    it('should init component properly', () => {
      expect(scrollableDropdownComp.optionsList).toBeDefined();
      expect(scrollableDropdownComp.optionsList).toEqual(FUNDING_TYPE_OPTIONS);
    });

    it('should set value to EU fund after EU select', () => {
      scrollableDropdownComp.setCurrentValue(DEFAULT_EU_DISPLAY_VALUE);

      expect(loadCurrentValueAsString(scrollableDropdownComp.currentValue)).toEqual(DEFAULT_EU_DISPLAY_VALUE);
    });

    it('should set value to Own fund after Own fund select', () => {
      scrollableDropdownComp.setCurrentValue(OWN_FUNDS_VALUE);

      expect(loadCurrentValueAsString(scrollableDropdownComp.currentValue)).toEqual(OWN_FUNDS_VALUE);
    });
  });

});


/**
 * Load the component current value because currentValue in the component is observable object
 * @param currentValue$ in the SponsorScrollableComponent
 */
export function loadCurrentValueAsString(currentValue$: Observable<string>) {
  let currentValue = '';
  if (isNotEmpty(currentValue$)) {
    currentValue$.pipe(take(1)).subscribe( value => {
      currentValue = value;
    });
  }
  return currentValue;
}

// declare a test component
@Component({
  selector: 'ds-test-cmp',
  template: ``
})
class TestComponent {

  group: FormGroup = SD_TEST_GROUP;

  model = new DynamicScrollableDropdownModel(SD_TEST_MODEL_CONFIG);

  showErrorMessages = false;

}
