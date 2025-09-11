import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import {
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  NgbActiveModal,
  NgbModal,
} from '@ng-bootstrap/ng-bootstrap';
import {
  DynamicFormArrayModel,
  DynamicFormControlEvent,
  DynamicFormGroupModel,
  DynamicSelectModel,
} from '@ng-dynamic-forms/core';
import { provideMockStore } from '@ngrx/store/testing';
import { TranslateModule } from '@ngx-translate/core';
import { NgxMaskModule } from 'ngx-mask';
import { of } from 'rxjs';

import {
  APP_CONFIG,
  APP_DATA_SERVICES_MAP,
} from '../../../../../../config/app-config.interface';
import { environment } from '../../../../../../environments/environment.test';
import { JsonPatchOperationPathCombiner } from '../../../../../core/json-patch/builder/json-patch-operation-path-combiner';
import { JsonPatchOperationsBuilder } from '../../../../../core/json-patch/builder/json-patch-operations-builder';
import { SubmissionJsonPatchOperationsService } from '../../../../../core/submission/submission-json-patch-operations.service';
import { XSRFService } from '../../../../../core/xsrf/xsrf.service';
import { dateToISOFormat } from '../../../../../shared/date.util';
import { DsDynamicTypeBindRelationService } from '../../../../../shared/form/builder/ds-dynamic-form-ui/ds-dynamic-type-bind-relation.service';
import { DynamicCustomSwitchModel } from '../../../../../shared/form/builder/ds-dynamic-form-ui/models/custom-switch/custom-switch.model';
import { FormBuilderService } from '../../../../../shared/form/builder/form-builder.service';
import { FormFieldMetadataValueObject } from '../../../../../shared/form/builder/models/form-field-metadata-value.model';
import { FormComponent } from '../../../../../shared/form/form.component';
import { FormService } from '../../../../../shared/form/form.service';
import { getMockFormService } from '../../../../../shared/mocks/form-service.mock';
import { getMockSectionUploadService } from '../../../../../shared/mocks/section-upload.service.mock';
import {
  mockFileFormData,
  mockSubmissionCollectionId,
  mockSubmissionId,
  mockSubmissionObject,
  mockUploadConfigResponse,
  mockUploadConfigResponseMetadata,
  mockUploadFiles,
} from '../../../../../shared/mocks/submission.mock';
import { SubmissionJsonPatchOperationsServiceStub } from '../../../../../shared/testing/submission-json-patch-operations-service.stub';
import { SubmissionServiceStub } from '../../../../../shared/testing/submission-service.stub';
import { createTestComponent } from '../../../../../shared/testing/utils.test';
import { SubmissionService } from '../../../../submission.service';
import { SectionUploadService } from '../../section-upload.service';
import { POLICY_DEFAULT_WITH_LIST } from '../../section-upload-constants';
import { SubmissionSectionUploadFileEditComponent } from './section-upload-file-edit.component';

function getMockDsDynamicTypeBindRelationService(): DsDynamicTypeBindRelationService {
  return jasmine.createSpyObj('DsDynamicTypeBindRelationService', {
    getRelatedFormModel: jasmine.createSpy('getRelatedFormModel'),
    matchesCondition: jasmine.createSpy('matchesCondition'),
    subscribeRelations: jasmine.createSpy('subscribeRelations'),
  });
}

const jsonPatchOpBuilder: any = jasmine.createSpyObj('jsonPatchOpBuilder', {
  add: jasmine.createSpy('add'),
  replace: jasmine.createSpy('replace'),
  remove: jasmine.createSpy('remove'),
});

const formMetadataMock = ['dc.title', 'dc.description'];

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

describe('SubmissionSectionUploadFileEditComponent test suite', () => {

  let comp: SubmissionSectionUploadFileEditComponent;
  let compAsAny: any;
  let fixture: ComponentFixture<SubmissionSectionUploadFileEditComponent>;
  let submissionServiceStub: SubmissionServiceStub;
  let formbuilderService: any;
  let operationsBuilder: any;
  let operationsService: any;
  let formService: any;
  let uploadService: any;

  const submissionJsonPatchOperationsServiceStub = new SubmissionJsonPatchOperationsServiceStub();
  const submissionId = mockSubmissionId;
  const sectionId = 'upload';
  const collectionId = mockSubmissionCollectionId;
  const availableAccessConditionOptions = mockUploadConfigResponse.accessConditionOptions;
  const collectionPolicyType = POLICY_DEFAULT_WITH_LIST;
  const configMetadataForm: any = mockUploadConfigResponseMetadata;
  const fileIndex = '0';
  const fileId = '123456-test-upload';
  const fileData: any = mockUploadFiles[0];
  const pathCombiner = new JsonPatchOperationPathCombiner('sections', sectionId);

  let noAccessConditionsMock = Object.assign({}, mockFileFormData);
  delete noAccessConditionsMock.accessConditions;

  const mockCdRef = Object.assign({
    detectChanges: () => undefined,
  });

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule.forRoot(),
        FormComponent,
        SubmissionSectionUploadFileEditComponent,
        TestComponent,
        NgxMaskModule.forRoot(),
      ],
      providers: [
        { provide: FormService, useValue: getMockFormService() },
        { provide: SubmissionService, useClass: SubmissionServiceStub },
        { provide: SubmissionJsonPatchOperationsService, useValue: submissionJsonPatchOperationsServiceStub },
        { provide: JsonPatchOperationsBuilder, useValue: jsonPatchOpBuilder },
        { provide: SectionUploadService, useValue: getMockSectionUploadService() },
        provideMockStore({ initialState }),
        FormBuilderService,
        { provide: ChangeDetectorRef, useValue: mockCdRef },
        SubmissionSectionUploadFileEditComponent,
        NgbModal,
        NgbActiveModal,
        { provide: DsDynamicTypeBindRelationService, useValue: getMockDsDynamicTypeBindRelationService() },
        { provide: APP_CONFIG, useValue: environment },
        { provide: APP_DATA_SERVICES_MAP, useValue: {} },
        { provide: XSRFService, useValue: {} },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents().then();
  }));

  describe('', () => {
    let testComp: TestComponent;
    let testFixture: ComponentFixture<TestComponent>;

    // synchronous beforeEach
    beforeEach(() => {
      const html = `
      <ds-submission-section-upload-file-edit [availableAccessConditionGroups]="availableAccessConditionGroups"
                                              [availableAccessConditionOptions]="availableAccessConditionOptions"
                                              [collectionId]="collectionId"
                                              [collectionPolicyType]="collectionPolicyType"
                                              [configMetadataForm]="configMetadataForm"
                                              [fileData]="fileData"
                                              [fileId]="fileId"
                                              [fileIndex]="fileIndex"
                                              [formId]="formId"
                                              [sectionId]="sectionId"></ds-submission-section-upload-file-edit>`;

      testFixture = createTestComponent(html, TestComponent) as ComponentFixture<TestComponent>;
      testComp = testFixture.componentInstance;
    });

    afterEach(() => {
      testFixture.destroy();
    });

    it('should create SubmissionSectionUploadFileEditComponent', () => {
      let app = TestBed.inject(SubmissionSectionUploadFileEditComponent);
      expect(app).toBeDefined();
    });
  });

  describe('', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(SubmissionSectionUploadFileEditComponent);
      comp = fixture.componentInstance;
      compAsAny = comp;
      submissionServiceStub = TestBed.inject(SubmissionService as any);
      formbuilderService = TestBed.inject(FormBuilderService);
      operationsBuilder = TestBed.inject(JsonPatchOperationsBuilder);
      operationsService = TestBed.inject(SubmissionJsonPatchOperationsService);
      formService = TestBed.inject(FormService);
      uploadService = TestBed.inject(SectionUploadService);

      comp.submissionId = submissionId;
      comp.collectionId = collectionId;
      comp.sectionId = sectionId;
      comp.availableAccessConditionOptions = availableAccessConditionOptions;
      comp.collectionPolicyType = collectionPolicyType;
      comp.fileIndex = fileIndex;
      comp.fileId = fileId;
      comp.configMetadataForm = configMetadataForm;
      comp.formMetadata = formMetadataMock;

      formService.isValid.and.returnValue(of(true));
    });

    afterEach(() => {
      fixture.destroy();
      comp = null;
      compAsAny = null;
    });

    it('should init form model properly', () => {
      comp.fileData = fileData;
      comp.formId = 'testFileForm';
      const maxStartDate = { year: 2022, month: 1, day: 12 };
      const maxEndDate = { year: 2019, month: 7, day: 12 };

      comp.formModel = compAsAny.buildFileEditForm();

      const models = [DynamicCustomSwitchModel, DynamicFormGroupModel, DynamicFormArrayModel];

      expect(comp.formModel).toBeDefined();
      expect(comp.formModel.length).toBe(models.length);
      models.forEach((model, i) => {
        expect(comp.formModel[i] instanceof model).toBeTruthy();
      });

      expect((comp.formModel[2] as DynamicFormArrayModel).groups.length).toBe(2);
      const startDateModel = formbuilderService.findById('startDate', comp.formModel);
      expect(startDateModel.max).toEqual(maxStartDate);
      const endDateModel = formbuilderService.findById('endDate', comp.formModel);
      expect(endDateModel.max).toEqual(maxEndDate);
    });

    it('should call setOptions method onChange', () => {
      const dynamicFormControlChangeEvent: DynamicFormControlEvent = {
        $event: new Event('change'),
        context: null,
        control: null,
        group: null,
        model: { id: 'name' } as any,
        type: 'change',
      };
      spyOn(comp, 'setOptions');

      comp.onChange(dynamicFormControlChangeEvent);

      expect(comp.setOptions).toHaveBeenCalled();
    });

    it('should update form model on group select', () => {

      comp.fileData = fileData;
      comp.formId = 'testFileForm';

      comp.formModel = compAsAny.buildFileEditForm();

      const model: DynamicSelectModel<string> = formbuilderService.findById('name', comp.formModel, 0);
      const formGroup = formbuilderService.createFormGroup(comp.formModel);
      const control = formbuilderService.getFormControlById('name', formGroup, comp.formModel, 0);

      spyOn(control.parent, 'markAsDirty').and.callThrough();

      control.value = 'openaccess';
      comp.setOptions(model, control);
      expect(control.parent.markAsDirty).toHaveBeenCalled();

      control.value = 'lease';
      comp.setOptions(model, control);
      expect(control.parent.markAsDirty).toHaveBeenCalled();

      control.value = 'embargo';
      comp.setOptions(model, control);
      expect(control.parent.markAsDirty).toHaveBeenCalled();
    });

    it('should retrieve Value From Field properly', () => {
      let field;
      expect(compAsAny.retrieveValueFromField(field)).toBeUndefined();

      field = new FormFieldMetadataValueObject('test');
      expect(compAsAny.retrieveValueFromField(field)).toBe('test');

      field = [new FormFieldMetadataValueObject('test')];
      expect(compAsAny.retrieveValueFromField(field)).toBe('test');
    });

    it('should save Bitstream File data properly when form is valid', fakeAsync(() => {
      compAsAny.formRef = { formGroup: null };
      compAsAny.fileData = fileData;
      compAsAny.pathCombiner = pathCombiner;
      compAsAny.isPrimary = null;
      formService.validateAllFormFields.and.callFake(() => null);
      formService.isValid.and.returnValue(of(true));
      formService.getFormData.and.returnValue(of(mockFileFormData));

      const response = [
        Object.assign(mockSubmissionObject, {
          sections: {
            upload: {
              primary: true,
              files: mockUploadFiles,
            },
          },
        }),
      ];
      operationsService.jsonPatchByResourceID.and.returnValue(of(response));

      const accessConditionsToSave = [
        { name: 'openaccess' },
        { name: 'lease', endDate: dateToISOFormat('2019-01-16T00:00:00Z') },
        { name: 'embargo', startDate: dateToISOFormat('2019-01-16T00:00:00Z') },
      ];
      comp.saveBitstreamData();
      tick();

      let path = 'primary';
      expect(uploadService.updatePrimaryBitstreamOperation).toHaveBeenCalledWith(pathCombiner.getPath(path),  compAsAny.isPrimary,  mockFileFormData.primary[0], compAsAny.fileId);

      const pathFragment = ['files', fileIndex];

      path = 'metadata/dc.title';
      expect(operationsBuilder.add).toHaveBeenCalledWith(
        pathCombiner.getPath([...pathFragment, path]),
        mockFileFormData.metadata['dc.title'],
        true,
      );

      path = 'metadata/dc.description';
      expect(operationsBuilder.add).toHaveBeenCalledWith(
        pathCombiner.getPath([...pathFragment, path]),
        mockFileFormData.metadata['dc.description'],
        true,
      );

      path = 'accessConditions';
      expect(operationsBuilder.add).toHaveBeenCalledWith(
        pathCombiner.getPath([...pathFragment, path]),
        accessConditionsToSave,
        true,
      );

      expect(uploadService.updateFileData).toHaveBeenCalledWith(submissionId, sectionId, mockUploadFiles[0].uuid, mockUploadFiles[0]);

    }));

    it('should update Bitstream data properly when access options are omitted', fakeAsync(() => {
      compAsAny.formRef = { formGroup: null };
      compAsAny.fileData = fileData;
      compAsAny.pathCombiner = pathCombiner;
      formService.validateAllFormFields.and.callFake(() => null);
      formService.isValid.and.returnValue(of(true));
      formService.getFormData.and.returnValue(of(noAccessConditionsMock));
      const response = [
        Object.assign(mockSubmissionObject, {
          sections: {
            upload: {
              files: mockUploadFiles,
            },
          },
        }),
      ];
      operationsService.jsonPatchByResourceID.and.returnValue(of(response));
      comp.saveBitstreamData();
      tick();
      expect(uploadService.updateFileData).toHaveBeenCalled();
    }));

    it('should not save Bitstream File data properly when form is not valid', fakeAsync(() => {
      compAsAny.formRef = { formGroup: null };
      compAsAny.pathCombiner = pathCombiner;
      formService.validateAllFormFields.and.callFake(() => null);
      formService.isValid.and.returnValue(of(false));
      comp.saveBitstreamData();
      tick();

      expect(uploadService.updateFileData).not.toHaveBeenCalled();

    }));

  });
});

// declare a test component
@Component({
  selector: 'ds-test-cmp',
  template: ``,
  standalone: true,
  imports: [
    FormComponent,
    FormsModule,
    ReactiveFormsModule,
    SubmissionSectionUploadFileEditComponent,
  ],
})
class TestComponent {
}
