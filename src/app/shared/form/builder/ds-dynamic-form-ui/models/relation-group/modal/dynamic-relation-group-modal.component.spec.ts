import { HttpClient } from '@angular/common/http';
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
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  UntypedFormControl,
  UntypedFormGroup,
} from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { APP_CONFIG } from '@dspace/config/app-config.interface';
import { FormRowModel } from '@dspace/core/config/models/config-submission-form.model';
import { SubmissionFormsModel } from '@dspace/core/config/models/config-submission-forms.model';
import { APP_DATA_SERVICES_MAP } from '@dspace/core/data-services-map-type';
import { FormFieldModel } from '@dspace/core/shared/form/models/form-field.model';
import { FormFieldMetadataValueObject } from '@dspace/core/shared/form/models/form-field-metadata-value.model';
import { SubmissionServiceStub } from '@dspace/core/testing/submission-service.stub';
import { createTestComponent } from '@dspace/core/testing/utils.test';
import { XSRFService } from '@dspace/core/xsrf/xsrf.service';
import {
  NgbActiveModal,
  NgbModal,
  NgbModule,
} from '@ng-bootstrap/ng-bootstrap';
import {
  DYNAMIC_FORM_CONTROL_MAP_FN,
  DynamicFormLayoutService,
  DynamicFormValidationService,
} from '@ng-dynamic-forms/core';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { environment } from '../../../../../../../../environments/environment.test';
import { SubmissionService } from '../../../../../../../submission/submission.service';
import { SubmissionObjectService } from '../../../../../../../submission/submission-object.service';
import { LiveRegionService } from '../../../../../../live-region/live-region.service';
import { Chips } from '../../../../../chips/models/chips.model';
import { FormComponent } from '../../../../../form.component';
import { FormService } from '../../../../../form.service';
import { FormBuilderService } from '../../../../form-builder.service';
import { dsDynamicFormControlMapFn } from '../../../ds-dynamic-form-control-map-fn';
import { DsDynamicInputModel } from '../../ds-dynamic-input.model';
import {
  DynamicRelationGroupModel,
  DynamicRelationGroupModelConfig,
} from '../dynamic-relation-group.model';
import { DsDynamicRelationGroupModalComponent } from './dynamic-relation-group-modal.components';

export let FORM_GROUP_TEST_MODEL_CONFIG;

export let FORM_GROUP_TEST_GROUP;

const submissionId = '1234';
const metadataSecurity = {
  'uuid': null,
  'metadataSecurityDefault': [
    0,
    1,
  ],
  'metadataCustomSecurity': {},
  'type': 'securitysetting',
  '_links': {
    'self': {
      'href': 'http://localhost:8080/server/api/core/securitysettings',
    },
  },
};

const initialState: any = {
  core: {
    'bitstreamFormats': {},
    'cache/object': {},
    'cache/syncbuffer': {},
    'cache/object-updates': {},
    'data/request': {},
    'history': {},
    'index': {},
    'auth': {},
    'json/patch': {},
    'metaTag': {},
    'route': {},
  },
};

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
          controlledVocabulary: 'RPAuthority',
          closed: false,
          metadata: 'dc.contributor.author',
        }],
      } as FormFieldModel],
    } as FormRowModel, {
      fields: [{
        hints: 'Enter the affiliation of the author.',
        input: { type: 'onebox' },
        label: 'Affiliation',
        languageCodes: [],
        mandatory: 'false',
        repeatable: false,
        selectableMetadata: [{
          controlledVocabulary: 'OUAuthority',
          closed: false,
          metadata: 'local.contributor.affiliation',
        }],
      } as FormFieldModel],
    } as FormRowModel],
    submissionId,
    id: 'dc_contributor_author',
    label: 'Authors',
    isInlineGroup: false,
    mandatoryField: 'dc.contributor.author',
    name: 'dc.contributor.author',
    placeholder: 'Authors',
    readOnly: false,
    relationFields: ['local.contributor.affiliation'],
    required: true,
    scopeUUID: '43fe1f8c-09a6-4fcf-9c78-5d4fed8f2c8f',
    submissionScope: undefined,
    validators: { required: null },
    repeatable: false,
    metadataFields: [],
    hasSelectableMetadata: false,
    securityConfigLevel: [],
  } as DynamicRelationGroupModelConfig;

  FORM_GROUP_TEST_GROUP = new UntypedFormGroup({
    dc_contributor_author: new UntypedFormControl(),
  });

}

describe('DsDynamicRelationGroupModalComponent test suite', () => {
  let testComp: TestComponent;
  let groupComp: DsDynamicRelationGroupModalComponent;
  let groupCompAsAny: any;
  let testFixture: ComponentFixture<TestComponent>;
  let groupFixture: ComponentFixture<DsDynamicRelationGroupModalComponent>;
  let modelValue: any;
  let html;
  let control1: FormControl;
  let model1: DsDynamicInputModel;
  let control2: FormControl;
  let model2: DsDynamicInputModel;
  const modal = jasmine.createSpyObj('modal', ['close', 'dismiss']);
  const submissionServiceStub: any = new SubmissionServiceStub();
  const liveRegionService = jasmine.createSpyObj('liveRegionService', {
    addMessage: jasmine.createSpy('addMessage'),
    setMessageTimeOutMs: jasmine.createSpy('setMessageTimeOutMs'),
  });

  beforeEach(waitForAsync(() => {
    init();
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        NgbModule,
        TranslateModule.forRoot(),
        FormComponent,
        DsDynamicRelationGroupModalComponent,
        TestComponent,
      ],
      providers: [
        ChangeDetectorRef,
        DsDynamicRelationGroupModalComponent,
        DynamicFormValidationService,
        DynamicFormLayoutService,
        FormBuilderService,
        FormComponent,
        FormService,
        NgbModal,
        provideMockStore({ initialState }),
        provideMockActions(() => new Observable<any>()),
        { provide: SubmissionService, useValue: submissionServiceStub },
        { provide: NgbActiveModal, useValue: modal },
        { provide: XSRFService, useValue: {} },
        { provide: LiveRegionService, useValue: liveRegionService },
        { provide: APP_CONFIG, useValue: environment },
        { provide: APP_DATA_SERVICES_MAP, useValue: {} },
        { provide: DYNAMIC_FORM_CONTROL_MAP_FN, useValue: dsDynamicFormControlMapFn },
        { provide: HttpClient, useValue: {} },
        { provide: SubmissionObjectService, useValue: {} },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    });

  }));

  describe('', () => {
    beforeEach(() => {
      html = `<ds-dynamic-relation-group-modal [model]="model"
                            [formId]="formId"
                            [group]="group"
                            (blur)="onBlur($event)"
                            (change)="onValueChange($event)"
                            (focus)="onFocus($event)"></ds-dynamic-relation-group-modal>`;

      testFixture = createTestComponent(html, TestComponent) as ComponentFixture<TestComponent>;
      testComp = testFixture.componentInstance;
    });

    afterEach(() => {
      testFixture.destroy();
      testComp = null;
    });

    it('should create DsDynamicRelationGroupModalComponent', inject([DsDynamicRelationGroupModalComponent], (app: DsDynamicRelationGroupModalComponent) => {
      expect(app).toBeDefined();
    }));
  });

  describe('when init model value is empty', () => {
    beforeEach(inject([FormBuilderService], (service: FormBuilderService) => {
      groupFixture = TestBed.createComponent(DsDynamicRelationGroupModalComponent);
      service = TestBed.inject(FormBuilderService as any);
      groupComp = groupFixture.componentInstance;
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

    it('should init component properly', inject([FormBuilderService], (service: FormBuilderService) => {
      const formConfig = { rows: groupComp.model.formConfiguration } as SubmissionFormsModel;
      const formModel = service.modelFromConfiguration(submissionId, formConfig, groupComp.model.scopeUUID, {}, groupComp.model.submissionScope, groupComp.model.readOnly);
      const chips = new Chips([], 'value', 'dc.contributor.author');
      expect(groupComp.formModel.length).toEqual(formModel.length);
    }));

    it('should save a new chips item', () => {
      control1.setValue('test author');
      (model1 as any).value = new FormFieldMetadataValueObject('test author');
      control2.setValue('test affiliation');
      (model2 as any).value = new FormFieldMetadataValueObject('test affiliation');

      groupFixture.detectChanges();

      const buttons = groupFixture.debugElement.nativeElement.querySelectorAll('button');
      expect(buttons.length).toBeGreaterThan(0);

    });

    it('should clear form inputs', () => {
      control1.setValue('test author');
      (model1 as any).value = new FormFieldMetadataValueObject('test author');
      control2.setValue('test affiliation');
      (model2 as any).value = new FormFieldMetadataValueObject('test affiliation');

      groupFixture.detectChanges();

      const buttons = groupFixture.debugElement.nativeElement.querySelectorAll('button');
      expect(buttons.length).toBe(2);

      if (buttons.length > 2) {
        const btnEl = buttons[2];
        btnEl.click();
        expect(control1.value).toBeNull();
        expect(control2.value).toBeNull();
      }
    });
  });

  describe('when init model value is not empty', () => {
    beforeEach(inject([FormBuilderService], (service: FormBuilderService) => {
      groupFixture = TestBed.createComponent(DsDynamicRelationGroupModalComponent);
      service = TestBed.inject(FormBuilderService as any);
      groupComp = groupFixture.componentInstance;
      groupCompAsAny = groupComp;
      groupComp.formId = 'testForm';
      groupComp.group = FORM_GROUP_TEST_GROUP;
      groupComp.model = new DynamicRelationGroupModel(FORM_GROUP_TEST_MODEL_CONFIG);
      modelValue = [{
        'dc.contributor.author': new FormFieldMetadataValueObject('test author'),
        'local.contributor.affiliation': new FormFieldMetadataValueObject('test affiliation'),
      }];
      groupComp.model.value = modelValue;
      groupFixture.detectChanges();

      control1 = service.getFormControlById('dc_contributor_author', groupCompAsAny.formRef.formGroup, groupComp.formModel) as FormControl;
      model1 = service.findById('dc_contributor_author', groupComp.formModel) as DsDynamicInputModel;
    }));

    afterEach(() => {
      groupFixture.destroy();
      groupComp = null;
    });

    it('should init component properly', inject([FormBuilderService], (service: FormBuilderService) => {
      const formConfig = { rows: groupComp.model.formConfiguration } as SubmissionFormsModel;
      const chips = new Chips(modelValue, 'value', 'dc.contributor.author');
      expect(groupComp.formModel.length).toEqual(2);
    }));

    it('should modify existing chips item', inject([FormBuilderService], (service: FormBuilderService) => {
      control1.setValue('test author modify');
      (model1 as any).value = new FormFieldMetadataValueObject('test author modify');

      modelValue = [{
        'dc.contributor.author': new FormFieldMetadataValueObject('test author modify'),
        'local.contributor.affiliation': new FormFieldMetadataValueObject('test affiliation'),
      }];
      groupFixture.detectChanges();

      const buttons = groupFixture.debugElement.nativeElement.querySelectorAll('button');
      expect(buttons.length).toBeGreaterThan(0);

      if (buttons.length > 0) {
        const btnEl = buttons[0];
        btnEl.click();
        groupFixture.detectChanges();
        expect(control1.value.toString().trim()).toBe('test author modify');
      }
    }));
  });
});


// declare a test component
@Component({
  selector: 'ds-test-cmp',
  template: ``,
  imports: [
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
  ],
})
class TestComponent {

  group = FORM_GROUP_TEST_GROUP;

  groupModelConfig = FORM_GROUP_TEST_MODEL_CONFIG;

  model = new DynamicRelationGroupModel(this.groupModelConfig);

  showErrorMessages = false;

}
