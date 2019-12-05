// Load the implementations that should be tested
import { ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, inject, TestBed, } from '@angular/core/testing';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { Store, StoreModule } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {
  DynamicFormControlEvent,
  DynamicFormGroupModel,
  DynamicFormLayoutService,
  DynamicFormValidationService
} from '@ng-dynamic-forms/core';

import {
  DynamicRelationGroupModel,
  DynamicRelationGroupModelConfig,
  PLACEHOLDER_PARENT_METADATA
} from '../relation-group/dynamic-relation-group.model';
import { DsDynamicRelationInlineGroupComponent } from './dynamic-relation-inline-group.components';
import { SubmissionFormsModel } from '../../../../../../core/config/models/config-submission-forms.model';
import { FormFieldModel } from '../../../models/form-field.model';
import { FormBuilderService } from '../../../form-builder.service';
import { FormService } from '../../../../form.service';
import { GLOBAL_CONFIG, GlobalConfig } from '../../../../../../../config';
import { FormComponent } from '../../../../form.component';
import { FormFieldMetadataValueObject } from '../../../models/form-field-metadata-value.model';
import { DsDynamicInputModel } from '../ds-dynamic-input.model';
import { createTestComponent } from '../../../../../testing/utils';
import { AuthorityService } from '../../../../../../core/integration/authority.service';
import { AuthorityServiceStub } from '../../../../../testing/authority-service-stub';
import { MOCK_SUBMISSION_CONFIG } from '../../../../../testing/mock-submission-config';
import { MockStore } from '../../../../../testing/mock-store';
import { FormRowModel } from '../../../../../../core/config/models/config-submission-form.model';
import { DynamicRowArrayModel } from '../ds-dynamic-row-array-model';
import { DynamicRowGroupModel } from '../ds-dynamic-row-group-model';

export let FORM_GROUP_TEST_MODEL_CONFIG;

export let FORM_GROUP_TEST_GROUP;

const config: GlobalConfig = MOCK_SUBMISSION_CONFIG;

const submissionId = '1234';

function init() {
  FORM_GROUP_TEST_MODEL_CONFIG = {
    disabled: false,
    errorMessages: { required: 'You must specify at least one author.' },
    formConfiguration: [{
      fields: [{
        hints: 'Enter the name of the author.',
        input: { type: 'onebox' },
        label: 'Author',
        languageCodes: [],
        mandatory: 'true',
        mandatoryMessage: 'Required field!',
        repeatable: false,
        selectableMetadata: [{
          authority: 'RPAuthority',
          closed: false,
          metadata: 'dc.contributor.author'
        }],
      } as FormFieldModel, {
        hints: 'Enter the affiliation of the author.',
        input: { type: 'onebox' },
        label: 'Affiliation',
        languageCodes: [],
        mandatory: 'false',
        repeatable: false,
        selectableMetadata: [{
          authority: 'OUAuthority',
          closed: false,
          metadata: 'local.contributor.affiliation'
        }]
      } as FormFieldModel]
    } as FormRowModel],
    submissionId,
    id: 'dc_contributor_author',
    label: 'Authors',
    isInlineGroup: true,
    mandatoryField: 'dc.contributor.author',
    name: 'dc.contributor.author',
    placeholder: 'Authors',
    readOnly: false,
    relationFields: ['local.contributor.affiliation'],
    required: true,
    scopeUUID: '43fe1f8c-09a6-4fcf-9c78-5d4fed8f2c8f',
    submissionScope: undefined,
    validators: { required: null }
  } as DynamicRelationGroupModelConfig;

  FORM_GROUP_TEST_GROUP = new FormGroup({
    dc_contributor_author: new FormControl(),
  });

}

describe('DsDynamicRelationInlineGroupComponent test suite', () => {
  let testComp: TestComponent;
  let groupComp: DsDynamicRelationInlineGroupComponent;
  let groupCompAsAny: any;
  let testFixture: ComponentFixture<TestComponent>;
  let groupFixture: ComponentFixture<DsDynamicRelationInlineGroupComponent>;
  let modelValue: any;
  let html;
  let control1: FormControl;
  let model1: DsDynamicInputModel;
  let control2: FormControl;
  let model2: DsDynamicInputModel;
  let event: DynamicFormControlEvent;

  // async beforeEach
  beforeEach(async(() => {
    init();

    /* TODO make sure these files use mocks instead of real services/components https://github.com/DSpace/dspace-angular/issues/281 */
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        NgbModule.forRoot(),
        StoreModule.forRoot({}),
        TranslateModule.forRoot()
      ],
      declarations: [
        FormComponent,
        DsDynamicRelationInlineGroupComponent,
        TestComponent,
      ], // declare the test component
      providers: [
        ChangeDetectorRef,
        DsDynamicRelationInlineGroupComponent,
        DynamicFormValidationService,
        DynamicFormLayoutService,
        FormBuilderService,
        FormComponent,
        FormService,
        { provide: AuthorityService, useValue: new AuthorityServiceStub() },
        { provide: GLOBAL_CONFIG, useValue: config },
        { provide: Store, useClass: MockStore }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });

  }));

  describe('', () => {
    // synchronous beforeEach
    beforeEach(() => {
      html = `<ds-dynamic-relation-group [model]="model"
                            [formId]="formId"
                            [group]="group"
                            (blur)="onBlur($event)"
                            (change)="onValueChange($event)"
                            (focus)="onFocus($event)"></ds-dynamic-relation-group>`;

      testFixture = createTestComponent(html, TestComponent) as ComponentFixture<TestComponent>;
      testComp = testFixture.componentInstance;
    });

    afterEach(() => {
      testFixture.destroy();
      testComp = null;
    });

    it('should create DsDynamicRelationGroupComponent', inject([DsDynamicRelationInlineGroupComponent], (app: DsDynamicRelationInlineGroupComponent) => {

      expect(app).toBeDefined();
    }));
  });

  describe('when init model value is empty', () => {
    beforeEach(inject([FormBuilderService], (service: FormBuilderService) => {

      groupFixture = TestBed.createComponent(DsDynamicRelationInlineGroupComponent);
      groupComp = groupFixture.componentInstance; // FormComponent test instance
      groupCompAsAny = groupComp;
      groupComp.formId = 'testForm';
      groupComp.group = FORM_GROUP_TEST_GROUP;
      groupComp.model = new DynamicRelationGroupModel(FORM_GROUP_TEST_MODEL_CONFIG);
      groupFixture.detectChanges();
      control1 = service.getFormControlById('dc_contributor_author', groupCompAsAny.formRef.formGroup, groupComp.formModel) as FormControl;
      model1 = service.findById('dc_contributor_author', groupComp.formModel) as DsDynamicInputModel;
      control2 = service.getFormControlById('local_contributor_affiliation', groupCompAsAny.formRef.formGroup, groupComp.formModel) as FormControl;
      model2 = service.findById('local_contributor_affiliation', groupComp.formModel) as DsDynamicInputModel;

    }));

    afterEach(() => {
      groupFixture.destroy();
      groupComp = null;
    });

    it('should init component properly', () => {

      expect(groupComp.formModel.length).toEqual(1);
      expect((groupComp.formModel[0]) instanceof DynamicRowArrayModel).toBeTruthy();
    });

    it('should init array model', () => {
      const formConfig = { rows: groupComp.model.formConfiguration } as SubmissionFormsModel;
      const formArrayModel = groupComp.initArrayModel(formConfig);

      expect(formArrayModel.length).toEqual(1);
      expect((formArrayModel[0]) instanceof DynamicRowArrayModel).toBeTruthy();
      expect(formArrayModel[0].id).toBe('dc_contributor_author_array');

    });

    it('should init array item model', inject([FormBuilderService], (service: FormBuilderService) => {
      const formConfig = { rows: groupComp.model.formConfiguration } as SubmissionFormsModel;
      const expectedFormArrayItemModel = service.modelFromConfiguration(
        submissionId,
        formConfig,
        groupComp.model.scopeUUID,
        {},
        groupComp.model.submissionScope,
        groupComp.model.readOnly
      );

      const formArrayItemModel: DynamicFormGroupModel = groupComp.initArrayItemModel(formConfig) as DynamicFormGroupModel;

      expect(formArrayItemModel.group.length).toBe((expectedFormArrayItemModel[0] as DynamicFormGroupModel).group.length);
      expect(formArrayItemModel.type).toBe('GROUP');
    }));

    it('should return emit blur event on blur', () => {
      event = {
        $event: new Event('blur'),
        context: null,
        control: null,
        group: null,
        model: null,
        type: 'blur'
      };
      spyOn(groupCompAsAny.blur, 'emit');

      groupComp.onBlur(event);

      expect(groupCompAsAny.blur.emit).toHaveBeenCalled();
    });

    describe('onChange', () => {
      beforeEach(() => {
        const formConfig = { rows: groupComp.model.formConfiguration } as SubmissionFormsModel;
        const formArrayModel: DynamicRowArrayModel[] = groupComp.initArrayModel(formConfig) as DynamicRowArrayModel[];
        const group = formArrayModel[0].groups[0];
        const model = (group.group[0] as DynamicRowGroupModel).group[0];
        model.parent = group;

        event = {
          $event: new Event('change'),
          context: null,
          control: null,
          group: null,
          model: model,
          type: 'change'
        };

      });

      it('should remove array item when group model is empty', () => {

        spyOn(groupComp, 'hasEmptyGroupValue').and.returnValue(true);
        spyOn(groupCompAsAny, 'getRowValue');
        spyOn(groupCompAsAny, 'removeItemFromArray');
        spyOn(groupCompAsAny, 'removeItemFromModelValue');
        spyOn((groupCompAsAny).change, 'emit');

        groupComp.onChange(event);

        expect(groupCompAsAny.getRowValue).toHaveBeenCalled();
        expect(groupCompAsAny.removeItemFromArray).toHaveBeenCalled();
        expect(groupCompAsAny.removeItemFromModelValue).toHaveBeenCalled();
        expect(groupCompAsAny.change.emit).toHaveBeenCalled();
      });

      it('should validate form when mandatory group field is empty', () => {

        spyOn(groupComp, 'hasEmptyGroupValue').and.returnValue(false);
        spyOn(groupCompAsAny, 'getRowValue').and.returnValue({'dc.contributor.author': null, 'local.contributor.affiliation': 'test'});
        spyOn(groupCompAsAny.formService, 'validateAllFormFields');
        spyOn(groupCompAsAny.change, 'emit');

        groupComp.onChange(event);

        expect(groupCompAsAny.getRowValue).toHaveBeenCalled();
        expect(groupCompAsAny.formService.validateAllFormFields).toHaveBeenCalled();
        expect(groupCompAsAny.change.emit).toHaveBeenCalled();
      });

      it('should update Array Model Value', () => {

        spyOn(groupComp, 'hasEmptyGroupValue').and.returnValue(false);
        spyOn(groupCompAsAny, 'getRowValue').and.returnValue({'dc.contributor.author': 'test', 'local.contributor.affiliation': 'test'});
        spyOn(groupCompAsAny, 'updateArrayModelValue');
        spyOn(groupCompAsAny.change, 'emit');

        groupComp.onChange(event);

        expect(groupCompAsAny.getRowValue).toHaveBeenCalled();
        expect(groupCompAsAny.change.emit).toHaveBeenCalled();
      });
    });

    it('should return true when group Value is empty', () => {

      let groupValue: any = {'dc.contributor.author': '', 'local.contributor.affiliation': PLACEHOLDER_PARENT_METADATA};

      groupComp.hasEmptyGroupValue(groupValue);

      expect(groupComp.hasEmptyGroupValue(groupValue)).toBeTruthy();

      groupValue = {'dc.contributor.author': '', 'local.contributor.affiliation': ''};

      groupComp.hasEmptyGroupValue(groupValue);

      expect(groupComp.hasEmptyGroupValue(groupValue)).toBeTruthy();

      groupValue = {};

      groupComp.hasEmptyGroupValue(groupValue);

      expect(groupComp.hasEmptyGroupValue(groupValue)).toBeTruthy();
    });

    it('should return false when group Value is not empty', () => {

      let groupValue: any = {'dc.contributor.author': 'test', 'local.contributor.affiliation': PLACEHOLDER_PARENT_METADATA};

      groupComp.hasEmptyGroupValue(groupValue);

      expect(groupComp.hasEmptyGroupValue(groupValue)).toBeFalsy();

      groupValue = {'dc.contributor.author': '', 'local.contributor.affiliation': 'test'};

      groupComp.hasEmptyGroupValue(groupValue);

      expect(groupComp.hasEmptyGroupValue(groupValue)).toBeFalsy();
    });

    it('should return emit focus event on focus', () => {
      event = {
        $event: new Event('focus'),
        context: null,
        control: null,
        group: null,
        model: null,
        type: 'focus'
      };
      spyOn(groupCompAsAny.focus, 'emit');

      groupComp.onFocus(event);

      expect(groupCompAsAny.focus.emit).toHaveBeenCalled();
    });

    it('should call removeItemFromModelValue method', () => {
      const model: any = {
        parent: {
          index: 1,
          parent: {
            size: 2
          }
        }
      };
      event = {
        $event: new Event('remove'),
        context: null,
        control: null,
        group: null,
        model: model,
        type: 'remove'
      };
      modelValue = [{
        'dc.contributor.author': new FormFieldMetadataValueObject('test author'),
        'local.contributor.affiliation': new FormFieldMetadataValueObject('test affiliation')
      }, {
        'dc.contributor.author': new FormFieldMetadataValueObject('test author 2'),
        'local.contributor.affiliation': new FormFieldMetadataValueObject('test affiliation 2')
      }];
      groupComp.model.valueUpdates.next(modelValue);
      spyOn(groupCompAsAny, 'removeItemFromModelValue');

      groupComp.remove(event);

      expect(groupCompAsAny.removeItemFromModelValue).toHaveBeenCalled();
    });

    it('should not call removeItemFromModelValue method', () => {
      const model: any = {
        parent: {
          index: 1,
          parent: {
            size: 1
          }
        }
      };
      event = {
        $event: new Event('remove'),
        context: null,
        control: null,
        group: null,
        model: model,
        type: 'remove'
      };
      modelValue = [{
        'dc.contributor.author': new FormFieldMetadataValueObject('test author'),
        'local.contributor.affiliation': new FormFieldMetadataValueObject('test affiliation')
      }, {
        'dc.contributor.author': new FormFieldMetadataValueObject('test author 2'),
        'local.contributor.affiliation': new FormFieldMetadataValueObject('test affiliation 2')
      }];
      groupComp.model.valueUpdates.next(modelValue);
      spyOn(groupCompAsAny, 'removeItemFromModelValue');

      groupComp.remove(event);

      expect(groupCompAsAny.removeItemFromModelValue).not.toHaveBeenCalled();
    });

    it('should return form row value properly', () => {
      const formGroup: any = {
        group:[
          {
            name: 'dc.contributor.author',
            value: new FormFieldMetadataValueObject('test author')
          },
          {
            name: 'local.contributor.affiliation',
            value: new FormFieldMetadataValueObject('test affiliation')
          }
        ]
      };
      const expectedValue = {
        'dc.contributor.author': new FormFieldMetadataValueObject('test author'),
        'local.contributor.affiliation': new FormFieldMetadataValueObject('test affiliation')
      };

      expect(groupCompAsAny.getRowValue(formGroup)).toEqual(expectedValue);
    });

    it('should normalize Group Form Value', () => {
      const groupValue: any = {
        'dc.contributor.author': new FormFieldMetadataValueObject('test author'),
        'local.contributor.affiliation': new FormFieldMetadataValueObject(PLACEHOLDER_PARENT_METADATA)
      };
      const normalizedValue = {
        'dc.contributor.author': [new FormFieldMetadataValueObject('test author')]
      };

      expect(groupCompAsAny.normalizeGroupFormValue(groupValue)).toEqual(normalizedValue);
    });

    it('should remove item from model value array', () => {
      modelValue = [{
        'dc.contributor.author': new FormFieldMetadataValueObject('test author'),
        'local.contributor.affiliation': new FormFieldMetadataValueObject('test affiliation')
      }, {
        'dc.contributor.author': new FormFieldMetadataValueObject('test author 2'),
        'local.contributor.affiliation': new FormFieldMetadataValueObject('test affiliation 2')
      }];
      groupComp.model.valueUpdates.next(modelValue);

      const expectedModelValue = [{
        'dc.contributor.author': new FormFieldMetadataValueObject('test author 2'),
        'local.contributor.affiliation': new FormFieldMetadataValueObject('test affiliation 2')
      }];
      spyOn(groupCompAsAny.change, 'emit');
      groupCompAsAny.removeItemFromModelValue(0);

      expect(groupCompAsAny.model.value).toEqual(expectedModelValue);
      expect(groupCompAsAny.change.emit).toHaveBeenCalled();
    });

    it('should remove item from array model', () => {
      const model: any = {
        parent: {
          index: 1,
          parent: {
            parent: {
              size: 2
            }
          }
        }
      };
      event = {
        $event: new Event('remove'),
        context: null,
        control: null,
        group: null,
        model: model,
        type: 'remove'
      };

      spyOn(groupCompAsAny.formBuilderService, 'getPath');
      spyOn(groupCompAsAny.formBuilderService, 'removeFormArrayGroup');
      spyOn(groupCompAsAny.formService, 'changeForm');
      spyOn(groupCompAsAny.formGroup, 'get');

      groupCompAsAny.removeItemFromArray(event);

      expect(groupCompAsAny.formService.changeForm).toHaveBeenCalled();
      expect(groupCompAsAny.formBuilderService.removeFormArrayGroup).toHaveBeenCalled();
    });

    it('should not remove item from array model when size is less than 2', () => {
      const model: any = {
        parent: {
          index: 1,
          parent: {
            parent: {
              size: 1
            }
          }
        }
      };
      event = {
        $event: new Event('remove'),
        context: null,
        control: null,
        group: null,
        model: model,
        type: 'remove'
      };

      spyOn(groupCompAsAny.formBuilderService, 'getPath');
      spyOn(groupCompAsAny.formBuilderService, 'removeFormArrayGroup');
      spyOn(groupCompAsAny.formService, 'changeForm');
      spyOn(groupCompAsAny.formGroup, 'get');

      groupCompAsAny.removeItemFromArray(event);

      expect(groupCompAsAny.formService.changeForm).not.toHaveBeenCalled();
      expect(groupCompAsAny.formBuilderService.removeFormArrayGroup).not.toHaveBeenCalled();
    });

    it('should update model properly', () => {
      const groupValue: any = {
        'dc.contributor.author': new FormFieldMetadataValueObject('test author'),
        'local.contributor.affiliation': new FormFieldMetadataValueObject('test affiliation')
      };

      const expectedModelValue: any = [{
        'dc.contributor.author': new FormFieldMetadataValueObject('test author'),
        'local.contributor.affiliation': new FormFieldMetadataValueObject('test affiliation')
      }];

      spyOn(groupCompAsAny.model.valueUpdates, 'next');
      spyOn(groupCompAsAny.change, 'emit');

      groupCompAsAny.updateArrayModelValue(groupValue, 0);

      expect(groupCompAsAny.model.valueUpdates.next).toHaveBeenCalledWith(expectedModelValue);
    });

    it('should update model properly when model value is not empty', () => {
      const groupValue: any = {
        'dc.contributor.author': new FormFieldMetadataValueObject('test author 2'),
        'local.contributor.affiliation': new FormFieldMetadataValueObject('test affiliation 2')
      };

      modelValue = [{
        'dc.contributor.author': new FormFieldMetadataValueObject('test author'),
        'local.contributor.affiliation': new FormFieldMetadataValueObject('test affiliation')
      }];

      groupComp.model.valueUpdates.next(modelValue);

      const expectedModelValue: any = [
        {
          'dc.contributor.author': new FormFieldMetadataValueObject('test author'),
          'local.contributor.affiliation': new FormFieldMetadataValueObject('test affiliation')
        },
        {
          'dc.contributor.author': new FormFieldMetadataValueObject('test author 2'),
          'local.contributor.affiliation': new FormFieldMetadataValueObject('test affiliation 2')
        }
      ];

      spyOn(groupCompAsAny.model.valueUpdates, 'next');
      spyOn(groupCompAsAny.change, 'emit');

      groupCompAsAny.updateArrayModelValue(groupValue, 1);

      expect(groupCompAsAny.model.valueUpdates.next).toHaveBeenCalledWith(expectedModelValue);
    });
  });

  describe('when init model value is not empty', () => {
    beforeEach(() => {

      groupFixture = TestBed.createComponent(DsDynamicRelationInlineGroupComponent);
      groupComp = groupFixture.componentInstance; // FormComponent test instance
      groupComp.formId = 'testForm';
      groupComp.group = FORM_GROUP_TEST_GROUP;
      groupComp.model = new DynamicRelationGroupModel(FORM_GROUP_TEST_MODEL_CONFIG);
      modelValue = [{
        'dc.contributor.author': new FormFieldMetadataValueObject('test author'),
        'local.contributor.affiliation': new FormFieldMetadataValueObject('test affiliation')
      }];
      groupComp.model.value = modelValue;
      groupFixture.detectChanges();

    });

    afterEach(() => {
      groupFixture.destroy();
      groupComp = null;
    });

    it('should init component properly', () => {

      expect(groupComp.formModel.length).toEqual(1);
      expect((groupComp.formModel[0]) instanceof DynamicRowArrayModel).toBeTruthy();
    });

  });
});

// declare a test component
@Component({
  selector: 'ds-test-cmp',
  template: ``
})
class TestComponent {

  group = FORM_GROUP_TEST_GROUP;

  groupModelConfig = FORM_GROUP_TEST_MODEL_CONFIG;

  model = new DynamicRelationGroupModel(this.groupModelConfig);

  showErrorMessages = false;

}
