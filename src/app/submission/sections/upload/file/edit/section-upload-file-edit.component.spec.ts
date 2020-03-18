import { ChangeDetectorRef, Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import {
  DynamicFormArrayGroupModel,
  DynamicFormArrayModel,
  DynamicFormControlEvent,
  DynamicFormGroupModel,
  DynamicSelectModel
} from '@ng-dynamic-forms/core';

import { FormBuilderService } from '../../../../../shared/form/builder/form-builder.service';
import { SubmissionServiceStub } from '../../../../../shared/testing/submission-service.stub';
import { SubmissionService } from '../../../../submission.service';
import { SubmissionSectionUploadFileEditComponent } from './section-upload-file-edit.component';
import { POLICY_DEFAULT_WITH_LIST } from '../../section-upload.component';
import {
  mockGroup,
  mockSubmissionCollectionId,
  mockSubmissionId,
  mockUploadConfigResponse,
  mockUploadFiles
} from '../../../../../shared/mocks/submission.mock';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormComponent } from '../../../../../shared/form/form.component';
import { FormService } from '../../../../../shared/form/form.service';
import { getMockFormService } from '../../../../../shared/mocks/form-service.mock';
import { Group } from '../../../../../core/eperson/models/group.model';
import { createTestComponent } from '../../../../../shared/testing/utils.test';

describe('SubmissionSectionUploadFileEditComponent test suite', () => {

  let comp: SubmissionSectionUploadFileEditComponent;
  let compAsAny: any;
  let fixture: ComponentFixture<SubmissionSectionUploadFileEditComponent>;
  let submissionServiceStub: SubmissionServiceStub;
  let formbuilderService: any;

  const submissionId = mockSubmissionId;
  const sectionId = 'upload';
  const collectionId = mockSubmissionCollectionId;
  const availableAccessConditionOptions = mockUploadConfigResponse.accessConditionOptions;
  const availableGroupsMap: Map<string, Group[]> = new Map([
    [mockUploadConfigResponse.accessConditionOptions[1].name, [mockGroup as any]],
    [mockUploadConfigResponse.accessConditionOptions[2].name, [mockGroup as any]],
  ]);
  const collectionPolicyType = POLICY_DEFAULT_WITH_LIST;
  const configMetadataForm: any = mockUploadConfigResponse.metadata;
  const fileIndex = '0';
  const fileId = '123456-test-upload';
  const fileData: any = mockUploadFiles[0];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule.forRoot()
      ],
      declarations: [
        FormComponent,
        SubmissionSectionUploadFileEditComponent,
        TestComponent
      ],
      providers: [
        { provide: FormService, useValue: getMockFormService() },
        { provide: SubmissionService, useClass: SubmissionServiceStub },
        FormBuilderService,
        ChangeDetectorRef,
        SubmissionSectionUploadFileEditComponent
      ],
      schemas: [NO_ERRORS_SCHEMA]
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

    it('should create SubmissionSectionUploadFileEditComponent', inject([SubmissionSectionUploadFileEditComponent], (app: SubmissionSectionUploadFileEditComponent) => {

      expect(app).toBeDefined();

    }));
  });

  describe('', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(SubmissionSectionUploadFileEditComponent);
      comp = fixture.componentInstance;
      compAsAny = comp;
      submissionServiceStub = TestBed.get(SubmissionService);
      formbuilderService = TestBed.get(FormBuilderService);

      comp.submissionId = submissionId;
      comp.collectionId = collectionId;
      comp.sectionId = sectionId;
      comp.availableAccessConditionOptions = availableAccessConditionOptions;
      comp.availableAccessConditionGroups = availableGroupsMap;
      comp.collectionPolicyType = collectionPolicyType;
      comp.fileIndex = fileIndex;
      comp.fileId = fileId;
      comp.configMetadataForm = configMetadataForm;
    });

    afterEach(() => {
      fixture.destroy();
      comp = null;
      compAsAny = null;
    });

    it('should init form model properly', () => {
      comp.fileData = fileData;
      comp.formId = 'testFileForm';

      comp.ngOnChanges();

      expect(comp.formModel).toBeDefined();
      expect(comp.formModel.length).toBe(2);
      expect(comp.formModel[0] instanceof DynamicFormGroupModel).toBeTruthy();
      expect(comp.formModel[1] instanceof DynamicFormArrayModel).toBeTruthy();
      expect((comp.formModel[1] as DynamicFormArrayModel).groups.length).toBe(2);
    });

    it('should call setOptions method onChange', () => {
      const dynamicFormControlChangeEvent: DynamicFormControlEvent = {
        $event: new Event('change'),
        context: null,
        control: null,
        group: null,
        model: {id: 'name'} as any,
        type: 'change'
      };
      spyOn(comp, 'setOptions');

      comp.onChange(dynamicFormControlChangeEvent);

      expect(comp.setOptions).toHaveBeenCalled();
    });

    it('should update form model on group select', () => {

      comp.fileData = fileData;
      comp.formId = 'testFileForm';

      comp.ngOnChanges();

      const model: DynamicSelectModel<string> = formbuilderService.findById('name', comp.formModel, 0);
      const formGroup = formbuilderService.createFormGroup(comp.formModel);
      const control = formbuilderService.getFormControlById('name', formGroup, comp.formModel, 0);

      spyOn(formbuilderService, 'findById').and.callThrough();

      control.value = 'openaccess';
      comp.setOptions(model, control);
      expect(formbuilderService.findById).not.toHaveBeenCalledWith('groupUUID', (model.parent as DynamicFormArrayGroupModel).group);
      expect(formbuilderService.findById).not.toHaveBeenCalledWith('endDate', (model.parent as DynamicFormArrayGroupModel).group);
      expect(formbuilderService.findById).not.toHaveBeenCalledWith('startDate', (model.parent as DynamicFormArrayGroupModel).group);

      control.value = 'lease';
      comp.setOptions(model, control);
      expect(formbuilderService.findById).toHaveBeenCalledWith('groupUUID', (model.parent as DynamicFormArrayGroupModel).group);
      expect(formbuilderService.findById).toHaveBeenCalledWith('endDate', (model.parent as DynamicFormArrayGroupModel).group);

      control.value = 'embargo';
      comp.setOptions(model, control);
      expect(formbuilderService.findById).toHaveBeenCalledWith('groupUUID', (model.parent as DynamicFormArrayGroupModel).group);
      expect(formbuilderService.findById).toHaveBeenCalledWith('startDate', (model.parent as DynamicFormArrayGroupModel).group);
    });
  });
});

// declare a test component
@Component({
  selector: 'ds-test-cmp',
  template: ``
})
class TestComponent {

  availableGroups;
  availableAccessConditionOptions;
  collectionId = mockSubmissionCollectionId;
  collectionPolicyType;
  configMetadataForm$;
  fileIndexes = [];
  fileList = [];
  fileNames = [];
  sectionId = 'upload';
  submissionId = mockSubmissionId;
}
