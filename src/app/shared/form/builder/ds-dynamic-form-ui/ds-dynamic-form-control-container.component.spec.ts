import {
  CUSTOM_ELEMENTS_SCHEMA,
  DebugElement,
  NgZone,
  SimpleChange,
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
  UntypedFormControl,
  UntypedFormGroup,
} from '@angular/forms';
import { By } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {
  DYNAMIC_FORM_CONTROL_MAP_FN,
  DynamicCheckboxGroupModel,
  DynamicCheckboxModel,
  DynamicColorPickerModel,
  DynamicDatePickerModel,
  DynamicEditorModel,
  DynamicFileUploadModel,
  DynamicFormArrayModel,
  DynamicFormControlModel,
  DynamicFormGroupModel,
  DynamicFormsCoreModule,
  DynamicFormService,
  DynamicInputModel,
  DynamicRadioGroupModel,
  DynamicRatingModel,
  DynamicSelectModel,
  DynamicSliderModel,
  DynamicSwitchModel,
  DynamicTextAreaModel,
  DynamicTimePickerModel,
  MATCH_VISIBLE,
  OR_OPERATOR,
} from '@ng-dynamic-forms/core';
import {
  DynamicNGBootstrapCalendarComponent,
  DynamicNGBootstrapCheckboxComponent,
  DynamicNGBootstrapCheckboxGroupComponent,
  DynamicNGBootstrapInputComponent,
  DynamicNGBootstrapRadioGroupComponent,
  DynamicNGBootstrapSelectComponent,
  DynamicNGBootstrapTextAreaComponent,
  DynamicNGBootstrapTimePickerComponent,
} from '@ng-dynamic-forms/ui-ng-bootstrap';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { NgxMaskModule } from 'ngx-mask';
import { of as observableOf } from 'rxjs';

import {
  APP_CONFIG,
  APP_DATA_SERVICES_MAP,
} from '../../../../../config/app-config.interface';
import { environment } from '../../../../../environments/environment';
import { RelationshipDataService } from '../../../../core/data/relationship-data.service';
import { Item } from '../../../../core/shared/item.model';
import { WorkspaceItem } from '../../../../core/submission/models/workspaceitem.model';
import { SubmissionObjectDataService } from '../../../../core/submission/submission-object-data.service';
import { VocabularyOptions } from '../../../../core/submission/vocabularies/models/vocabulary-options.model';
import { SubmissionService } from '../../../../submission/submission.service';
import { SelectableListService } from '../../../object-list/selectable-list/selectable-list.service';
import { createSuccessfulRemoteDataObject } from '../../../remote-data.utils';
import { FormBuilderService } from '../form-builder.service';
import { DsDynamicFormControlContainerComponent } from './ds-dynamic-form-control-container.component';
import { dsDynamicFormControlMapFn } from './ds-dynamic-form-control-map-fn';
import { DsDynamicTypeBindRelationService } from './ds-dynamic-type-bind-relation.service';
import { DsDynamicFormArrayComponent } from './models/array-group/dynamic-form-array.component';
import { DsDatePickerComponent } from './models/date-picker/date-picker.component';
import { DynamicDsDatePickerModel } from './models/date-picker/date-picker.model';
import { DsDatePickerInlineComponent } from './models/date-picker-inline/dynamic-date-picker-inline.component';
import { DynamicQualdropModel } from './models/ds-dynamic-qualdrop.model';
import { DsDynamicFormGroupComponent } from './models/form-group/dynamic-form-group.component';
import { DsDynamicListComponent } from './models/list/dynamic-list.component';
import { DynamicListCheckboxGroupModel } from './models/list/dynamic-list-checkbox-group.model';
import { DynamicListRadioGroupModel } from './models/list/dynamic-list-radio-group.model';
import { DsDynamicLookupComponent } from './models/lookup/dynamic-lookup.component';
import { DynamicLookupModel } from './models/lookup/dynamic-lookup.model';
import { DynamicLookupNameModel } from './models/lookup/dynamic-lookup-name.model';
import { DsDynamicOneboxComponent } from './models/onebox/dynamic-onebox.component';
import { DynamicOneboxModel } from './models/onebox/dynamic-onebox.model';
import { DsDynamicRelationGroupComponent } from './models/relation-group/dynamic-relation-group.components';
import { DynamicRelationGroupModel } from './models/relation-group/dynamic-relation-group.model';
import { DsDynamicScrollableDropdownComponent } from './models/scrollable-dropdown/dynamic-scrollable-dropdown.component';
import { DynamicScrollableDropdownModel } from './models/scrollable-dropdown/dynamic-scrollable-dropdown.model';
import { DsDynamicTagComponent } from './models/tag/dynamic-tag.component';
import { DynamicTagModel } from './models/tag/dynamic-tag.model';

function getMockDsDynamicTypeBindRelationService(): DsDynamicTypeBindRelationService {
  return jasmine.createSpyObj('DsDynamicTypeBindRelationService', {
    getRelatedFormModel: jasmine.createSpy('getRelatedFormModel'),
    matchesCondition: jasmine.createSpy('matchesCondition'),
    subscribeRelations: jasmine.createSpy('subscribeRelations'),
  });
}

describe('DsDynamicFormControlContainerComponent test suite', () => {

  const vocabularyOptions: VocabularyOptions = {
    name: 'type_programme',
    closed: false,
  };
  const formModel = [
    new DynamicCheckboxModel({ id: 'checkbox' }),
    new DynamicCheckboxGroupModel({ id: 'checkboxGroup', group: [] }),
    new DynamicColorPickerModel({ id: 'colorpicker' }),
    new DynamicDatePickerModel({ id: 'datepicker' }),
    new DynamicEditorModel({ id: 'editor' }),
    new DynamicFileUploadModel({ id: 'upload', url: '' }),
    new DynamicFormArrayModel({ id: 'formArray', groupFactory: () => [] }),
    new DynamicFormGroupModel({ id: 'formGroup', group: [] }),
    new DynamicInputModel({ id: 'input', maxLength: 51 }),
    new DynamicRadioGroupModel({ id: 'radioGroup' }),
    new DynamicRatingModel({ id: 'rating' }),
    new DynamicSelectModel({
      id: 'select',
      options: [{ value: 'One' }, { value: 'Two' }],
      value: 'One',
    }),
    new DynamicSliderModel({ id: 'slider' }),
    new DynamicSwitchModel({ id: 'switch' }),
    new DynamicTextAreaModel({ id: 'textarea' }),
    new DynamicTimePickerModel({ id: 'timepicker' }),
    new DynamicOneboxModel({
      id: 'typeahead',
      metadataFields: [],
      repeatable: false,
      submissionId: '1234',
      hasSelectableMetadata: false,
      typeBindRelations: [{
        match: MATCH_VISIBLE,
        operator: OR_OPERATOR,
        when: [{ id: 'dc.type', value: 'Book' }],
      }],
    }),
    new DynamicScrollableDropdownModel({
      id: 'scrollableDropdown',
      vocabularyOptions: vocabularyOptions,
      metadataFields: [],
      repeatable: false,
      submissionId: '1234',
      hasSelectableMetadata: false,
    }),
    new DynamicTagModel({
      id: 'tag',
      metadataFields: [],
      repeatable: false,
      submissionId: '1234',
      hasSelectableMetadata: false,
    }),
    new DynamicListCheckboxGroupModel({
      id: 'checkboxList',
      vocabularyOptions: vocabularyOptions,
      repeatable: true,
      required: false,
    }),
    new DynamicListRadioGroupModel({
      id: 'radioList',
      vocabularyOptions: vocabularyOptions,
      repeatable: false,
      required: false,
    }),
    new DynamicRelationGroupModel({
      submissionId: '1234',
      id: 'relationGroup',
      formConfiguration: [],
      mandatoryField: '',
      name: 'relationGroup',
      relationFields: [],
      scopeUUID: '',
      submissionScope: '',
      repeatable: false,
      metadataFields: [],
      hasSelectableMetadata: false,
    }),
    new DynamicDsDatePickerModel({ id: 'datepicker', repeatable: false }),
    new DynamicLookupModel({
      id: 'lookup',
      metadataFields: [],
      repeatable: false,
      submissionId: '1234',
      hasSelectableMetadata: false,
    }),
    new DynamicLookupNameModel({
      id: 'lookupName',
      metadataFields: [],
      repeatable: false,
      submissionId: '1234',
      hasSelectableMetadata: false,
    }),
    new DynamicQualdropModel({ id: 'combobox', readOnly: false, required: false }),
  ];
  const testModel = formModel[8];
  let formGroup: UntypedFormGroup;
  let fixture: ComponentFixture<DsDynamicFormControlContainerComponent>;
  let component: DsDynamicFormControlContainerComponent;
  let debugElement: DebugElement;
  let testElement: DebugElement;
  const testItem: Item = new Item();
  const testWSI: WorkspaceItem = new WorkspaceItem();
  testWSI.item = observableOf(createSuccessfulRemoteDataObject(testItem));
  beforeEach(waitForAsync(() => {

    TestBed.configureTestingModule({

      imports: [
        FormsModule,
        ReactiveFormsModule,
        NgbModule,
        DynamicFormsCoreModule.forRoot(),
        TranslateModule.forRoot(),
        NgxMaskModule.forRoot(),
      ],
      providers: [
        DsDynamicFormControlContainerComponent,
        DynamicFormService,
        { provide: DsDynamicTypeBindRelationService, useValue: getMockDsDynamicTypeBindRelationService() },
        { provide: RelationshipDataService, useValue: {} },
        { provide: SelectableListService, useValue: {} },
        { provide: Store, useValue: {} },
        { provide: RelationshipDataService, useValue: {} },
        { provide: SelectableListService, useValue: {} },
        { provide: FormBuilderService, useValue: {} },
        { provide: SubmissionService, useValue: {} },
        {
          provide: SubmissionObjectDataService,
          useValue: {
            findById: () => observableOf(createSuccessfulRemoteDataObject(testWSI)),
          },
        },
        { provide: APP_CONFIG, useValue: environment },
        { provide: APP_DATA_SERVICES_MAP, useValue: {} },
        { provide: DYNAMIC_FORM_CONTROL_MAP_FN, useValue: dsDynamicFormControlMapFn },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents().then(() => {

      fixture = TestBed.createComponent(DsDynamicFormControlContainerComponent);

      const ngZone = TestBed.inject(NgZone);


      // eslint-disable-next-line @typescript-eslint/ban-types
      spyOn(ngZone, 'runOutsideAngular').and.callFake((fn: Function) => fn());
      component = fixture.componentInstance;
      debugElement = fixture.debugElement;
    });
  }));

  beforeEach(inject([DynamicFormService, FormBuilderService], (service: DynamicFormService, formBuilderService: FormBuilderService) => {

    formGroup = service.createFormGroup(formModel);

    component.group = formGroup;
    component.model = testModel;

    component.ngOnChanges({

      group: new SimpleChange(null, component.group, true),
      model: new SimpleChange(null, component.model, true),
    });

    fixture.detectChanges();
    testElement = debugElement.query(By.css(`input[id='${testModel.id}']`));
  }));

  it('should initialize correctly', () => {
    expect(component.context).toBeNull();
    expect(component.control instanceof UntypedFormControl).toBe(true);
    expect(component.group instanceof UntypedFormGroup).toBe(true);
    expect(component.model instanceof DynamicFormControlModel).toBe(true);
    expect(component.hasErrorMessaging).toBe(false);

    expect(component.onControlValueChanges).toBeDefined();
    expect(component.onModelDisabledUpdates).toBeDefined();
    expect(component.onModelValueUpdates).toBeDefined();

    expect(component.blur).toBeDefined();
    expect(component.change).toBeDefined();
    expect(component.focus).toBeDefined();

    expect(component.componentType).toBe(DynamicNGBootstrapInputComponent);
  });

  it('should have an input element', () => {

    expect(testElement instanceof DebugElement).toBe(true);
  });

  it('should listen to native blur events', () => {

    spyOn(component, 'onBlur');

    testElement.triggerEventHandler('blur', null);

    expect(component.onBlur).toHaveBeenCalled();
  });

  it('should listen to native focus events', () => {

    spyOn(component, 'onFocus');

    testElement.triggerEventHandler('focus', null);

    expect(component.onFocus).toHaveBeenCalled();
  });

  it('should listen to native change event', () => {

    spyOn(component, 'onChange');

    testElement.triggerEventHandler('change', null);

    expect(component.onChange).toHaveBeenCalled();
  });

  it('should update model value when control value changes', () => {

    spyOn(component, 'onControlValueChanges');

    component.control.setValue('test');

    expect(component.onControlValueChanges).toHaveBeenCalled();
  });

  it('should update control value when model value changes', () => {

    spyOn(component, 'onModelValueUpdates');

    (testModel as DynamicInputModel).value = 'test';

    expect(component.onModelValueUpdates).toHaveBeenCalled();
  });

  it('should update control activation when model disabled property changes', () => {

    spyOn(component, 'onModelDisabledUpdates');

    testModel.disabled = true;

    expect(component.onModelDisabledUpdates).toHaveBeenCalled();
  });

  it('should map a form control model to a form control component', () => {
    const testFn = dsDynamicFormControlMapFn;
    expect(testFn(formModel[0])).toEqual(DynamicNGBootstrapCheckboxComponent);
    expect(testFn(formModel[1])).toEqual(DynamicNGBootstrapCheckboxGroupComponent);
    expect(testFn(formModel[2])).toBeNull();
    expect(testFn(formModel[3])).toEqual(DsDatePickerInlineComponent);
    (formModel[3] as DynamicDatePickerModel).inline = true;
    expect(testFn(formModel[3])).toEqual(DynamicNGBootstrapCalendarComponent);
    expect(testFn(formModel[4])).toBeNull();
    expect(testFn(formModel[5])).toBeNull();
    expect(testFn(formModel[6])).toEqual(DsDynamicFormArrayComponent);
    expect(testFn(formModel[7])).toEqual(DsDynamicFormGroupComponent);
    expect(testFn(formModel[8])).toEqual(DynamicNGBootstrapInputComponent);
    expect(testFn(formModel[9])).toEqual(DynamicNGBootstrapRadioGroupComponent);
    expect(testFn(formModel[10])).toBeNull();
    expect(testFn(formModel[11])).toEqual(DynamicNGBootstrapSelectComponent);
    expect(testFn(formModel[12])).toBeNull();
    expect(testFn(formModel[13])).toBeNull();
    expect(testFn(formModel[14])).toEqual(DynamicNGBootstrapTextAreaComponent);
    expect(testFn(formModel[15])).toEqual(DynamicNGBootstrapTimePickerComponent);
    expect(testFn(formModel[16])).toEqual(DsDynamicOneboxComponent);
    expect(testFn(formModel[17])).toEqual(DsDynamicScrollableDropdownComponent);
    expect(testFn(formModel[18])).toEqual(DsDynamicTagComponent);
    expect(testFn(formModel[19])).toEqual(DsDynamicListComponent);
    expect(testFn(formModel[20])).toEqual(DsDynamicListComponent);
    expect(testFn(formModel[21])).toEqual(DsDynamicRelationGroupComponent);
    expect(testFn(formModel[22])).toEqual(DsDatePickerComponent);
    expect(testFn(formModel[23])).toEqual(DsDynamicLookupComponent);
    expect(testFn(formModel[24])).toEqual(DsDynamicLookupComponent);
    expect(testFn(formModel[25])).toEqual(DsDynamicFormGroupComponent);
  });

});
