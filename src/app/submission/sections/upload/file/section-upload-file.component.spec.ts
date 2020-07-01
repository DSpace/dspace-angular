import { ChangeDetectorRef, Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, fakeAsync, inject, TestBed, tick } from '@angular/core/testing';
import { BrowserModule, By } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

import { of as observableOf } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';

import { FileService } from '../../../../core/shared/file.service';
import { FormService } from '../../../../shared/form/form.service';
import { getMockFormService } from '../../../../shared/mocks/form-service.mock';
import { HALEndpointService } from '../../../../core/shared/hal-endpoint.service';
import { HALEndpointServiceStub } from '../../../../shared/testing/hal-endpoint-service.stub';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { JsonPatchOperationsBuilder } from '../../../../core/json-patch/builder/json-patch-operations-builder';
import { SubmissionJsonPatchOperationsServiceStub } from '../../../../shared/testing/submission-json-patch-operations-service.stub';
import { SubmissionJsonPatchOperationsService } from '../../../../core/submission/submission-json-patch-operations.service';
import { SubmissionSectionUploadFileComponent } from './section-upload-file.component';
import { SubmissionServiceStub } from '../../../../shared/testing/submission-service.stub';
import {
  mockFileFormData,
  mockGroup,
  mockSubmissionCollectionId,
  mockSubmissionId,
  mockSubmissionObject,
  mockUploadConfigResponse,
  mockUploadFiles
} from '../../../../shared/mocks/submission.mock';

import { SubmissionService } from '../../../submission.service';
import { SectionUploadService } from '../section-upload.service';
import { createTestComponent } from '../../../../shared/testing/utils.test';
import { FileSizePipe } from '../../../../shared/utils/file-size-pipe';
import { POLICY_DEFAULT_WITH_LIST } from '../section-upload.component';
import { JsonPatchOperationPathCombiner } from '../../../../core/json-patch/builder/json-patch-operation-path-combiner';
import { getMockSectionUploadService } from '../../../../shared/mocks/section-upload.service.mock';
import { FormFieldMetadataValueObject } from '../../../../shared/form/builder/models/form-field-metadata-value.model';
import { Group } from '../../../../core/eperson/models/group.model';
import { SubmissionSectionUploadFileEditComponent } from './edit/section-upload-file-edit.component';
import { FormBuilderService } from '../../../../shared/form/builder/form-builder.service';

function getMockFileService(): FileService {
  return jasmine.createSpyObj('FileService', {
    downloadFile: jasmine.createSpy('downloadFile'),
    getFileNameFromResponseContentDisposition: jasmine.createSpy('getFileNameFromResponseContentDisposition')
  });
}

describe('SubmissionSectionUploadFileComponent test suite', () => {

  let comp: SubmissionSectionUploadFileComponent;
  let compAsAny: any;
  let fixture: ComponentFixture<SubmissionSectionUploadFileComponent>;
  let submissionServiceStub: SubmissionServiceStub;
  let uploadService: any;
  let fileService: any;
  let formService: any;
  let halService: any;
  let operationsBuilder: any;
  let operationsService: any;

  const submissionJsonPatchOperationsServiceStub = new SubmissionJsonPatchOperationsServiceStub();
  const submissionId = mockSubmissionId;
  const sectionId = 'upload';
  const collectionId = mockSubmissionCollectionId;
  const availableAccessConditionOptions = mockUploadConfigResponse.accessConditionOptions;
  const availableGroupsMap: Map<string, Group[]> = new Map([
    [mockUploadConfigResponse.accessConditionOptions[1].name, [mockGroup as any]],
    [mockUploadConfigResponse.accessConditionOptions[2].name, [mockGroup as any]],
  ]);
  const collectionPolicyType = POLICY_DEFAULT_WITH_LIST;
  const fileIndex = '0';
  const fileName = '123456-test-upload.jpg';
  const fileId = '123456-test-upload';
  const fileData: any = mockUploadFiles[0];
  const pathCombiner = new JsonPatchOperationPathCombiner('sections', sectionId, 'files', fileIndex);

  const jsonPatchOpBuilder: any = jasmine.createSpyObj('jsonPatchOpBuilder', {
    add: jasmine.createSpy('add'),
    replace: jasmine.createSpy('replace'),
    remove: jasmine.createSpy('remove'),
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserModule,
        CommonModule,
        NgbModule,
        TranslateModule.forRoot()
      ],
      declarations: [
        FileSizePipe,
        SubmissionSectionUploadFileComponent,
        TestComponent
      ],
      providers: [
        { provide: FileService, useValue: getMockFileService() },
        { provide: FormService, useValue: getMockFormService() },
        { provide: HALEndpointService, useValue: new HALEndpointServiceStub('workspaceitems') },
        { provide: JsonPatchOperationsBuilder, useValue: jsonPatchOpBuilder },
        { provide: SubmissionJsonPatchOperationsService, useValue: submissionJsonPatchOperationsServiceStub },
        { provide: SubmissionService, useClass: SubmissionServiceStub },
        { provide: SectionUploadService, useValue: getMockSectionUploadService() },
        ChangeDetectorRef,
        NgbModal,
        SubmissionSectionUploadFileComponent,
        SubmissionSectionUploadFileEditComponent,
        FormBuilderService
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
        <ds-submission-upload-section-file [availableAccessConditionGroups]='availableGroups'
                                           [availableAccessConditionOptions]='availableAccessConditionOptions'
                                           [collectionId]='collectionId'
                                           [collectionPolicyType]='collectionPolicyType'
                                           [configMetadataForm]='(configMetadataForm$ | async)'
                                           [fileId]='fileIndexes[fileList.indexOf(fileEntry)]'
                                           [fileIndex]='fileList.indexOf(fileEntry)'
                                           [fileName]='fileNames[fileList.indexOf(fileEntry)]'
                                           [sectionId]='sectionId'
                                           [submissionId]='submissionId'></ds-submission-upload-section-file>`;

      testFixture = createTestComponent(html, TestComponent) as ComponentFixture<TestComponent>;
      testComp = testFixture.componentInstance;
    });

    afterEach(() => {
      testFixture.destroy();
    });

    it('should create SubmissionSectionUploadFileComponent', inject([SubmissionSectionUploadFileComponent], (app: SubmissionSectionUploadFileComponent) => {

      expect(app).toBeDefined();

    }));
  });

  describe('', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(SubmissionSectionUploadFileComponent);
      comp = fixture.componentInstance;
      compAsAny = comp;
      submissionServiceStub = TestBed.get(SubmissionService);
      uploadService = TestBed.get(SectionUploadService);
      fileService = TestBed.get(FileService);
      formService = TestBed.get(FormService);
      halService = TestBed.get(HALEndpointService);
      operationsBuilder = TestBed.get(JsonPatchOperationsBuilder);
      operationsService = TestBed.get(SubmissionJsonPatchOperationsService);

      comp.submissionId = submissionId;
      comp.collectionId = collectionId;
      comp.sectionId = sectionId;
      comp.availableAccessConditionOptions = availableAccessConditionOptions;
      comp.availableAccessConditionGroups = availableGroupsMap;
      comp.collectionPolicyType = collectionPolicyType;
      comp.fileIndex = fileIndex;
      comp.fileId = fileId;
      comp.fileName = fileName;
    });

    afterEach(() => {
      fixture.destroy();
      comp = null;
      compAsAny = null;
    });

    it('should init component properly', () => {
      fixture.detectChanges();

      expect(comp.formId).toBeDefined();
      expect(compAsAny.pathCombiner).toEqual(pathCombiner);
    });

    it('should init file data properly', () => {
      uploadService.getFileData.and.returnValue(observableOf(fileData));

      comp.ngOnChanges();

      expect(comp.fileData).toEqual(fileData);
    });

    it('should call deleteFile on delete confirmation', () => {
      spyOn(compAsAny, 'deleteFile');
      comp.fileData = fileData;

      fixture.detectChanges();

      const modalBtn = fixture.debugElement.query(By.css('.fa-trash '));

      modalBtn.nativeElement.click();
      fixture.detectChanges();

      const confirmBtn: any = ((document as any).querySelector('.btn-danger:nth-child(2)'));
      confirmBtn.click();

      fixture.detectChanges();

      fixture.whenStable().then(() => {
        expect(compAsAny.deleteFile).toHaveBeenCalled();
      });
    });

    it('should delete file properly', () => {
      compAsAny.pathCombiner = pathCombiner;
      operationsService.jsonPatchByResourceID.and.returnValue(observableOf({}));
      submissionServiceStub.getSubmissionObjectLinkName.and.returnValue('workspaceitems');

      compAsAny.deleteFile();

      expect(uploadService.removeUploadedFile).toHaveBeenCalledWith(submissionId, sectionId, fileId);
      expect(operationsBuilder.remove).toHaveBeenCalledWith(pathCombiner.getPath());
      expect(operationsService.jsonPatchByResourceID).toHaveBeenCalledWith(
        'workspaceitems',
        submissionId,
        pathCombiner.rootElement,
        pathCombiner.subRootElement);
    });

    it('should download Bitstream File properly', fakeAsync(() => {
      comp.fileData = fileData;
      comp.downloadBitstreamFile();

      tick();

      expect(fileService.downloadFile).toHaveBeenCalled()
    }));

    it('should save Bitstream File data properly when form is valid', fakeAsync(() => {
      compAsAny.fileEditComp = TestBed.get(SubmissionSectionUploadFileEditComponent);
      compAsAny.fileEditComp.formRef = {formGroup: null};
      compAsAny.pathCombiner = pathCombiner;
      const event = new Event('click', null);
      spyOn(comp, 'switchMode');
      formService.validateAllFormFields.and.callFake(() => null);
      formService.isValid.and.returnValue(observableOf(true));
      formService.getFormData.and.returnValue(observableOf(mockFileFormData));

      const response = [
        Object.assign(mockSubmissionObject, {
          sections: {
            upload: {
              files: mockUploadFiles
            }
          }
        })
      ];
      operationsService.jsonPatchByResourceID.and.returnValue(observableOf(response));

      const accessConditionsToSave = [
        { name: 'openaccess', groupUUID: '123456-g' },
        { name: 'lease', endDate: '2019-01-16T00:00:00Z', groupUUID: '123456-g' },
        { name: 'embargo', startDate: '2019-01-16T00:00:00Z', groupUUID: '123456-g' }
      ];
      comp.saveBitstreamData(event);
      tick();

      let path = 'metadata/dc.title';
      expect(operationsBuilder.add).toHaveBeenCalledWith(
        pathCombiner.getPath(path),
        mockFileFormData.metadata['dc.title'],
        true
      );

      path = 'metadata/dc.description';
      expect(operationsBuilder.add).toHaveBeenCalledWith(
        pathCombiner.getPath(path),
        mockFileFormData.metadata['dc.description'],
        true
      );

      path = 'accessConditions';
      expect(operationsBuilder.add).toHaveBeenCalledWith(
        pathCombiner.getPath(path),
        accessConditionsToSave,
        true
      );

      expect(comp.switchMode).toHaveBeenCalled();
      expect(uploadService.updateFileData).toHaveBeenCalledWith(submissionId, sectionId, mockUploadFiles[0].uuid, mockUploadFiles[0]);

    }));

    it('should not save Bitstream File data properly when form is not valid', fakeAsync(() => {
      compAsAny.fileEditComp = TestBed.get(SubmissionSectionUploadFileEditComponent);
      compAsAny.fileEditComp.formRef = {formGroup: null};
      compAsAny.pathCombiner = pathCombiner;
      const event = new Event('click', null);
      spyOn(comp, 'switchMode');
      formService.validateAllFormFields.and.callFake(() => null);
      formService.isValid.and.returnValue(observableOf(false));

      expect(comp.switchMode).not.toHaveBeenCalled();
      expect(uploadService.updateFileData).not.toHaveBeenCalled();

    }));

    it('should retrieve Value From Field properly', () => {
      let field;
      expect(compAsAny.retrieveValueFromField(field)).toBeUndefined();

      field = new FormFieldMetadataValueObject('test');
      expect(compAsAny.retrieveValueFromField(field)).toBe('test');

      field = [new FormFieldMetadataValueObject('test')];
      expect(compAsAny.retrieveValueFromField(field)).toBe('test');
    });

    it('should switch read mode', () => {
      comp.readMode = false;

      comp.switchMode();
      expect(comp.readMode).toBeTruthy();

      comp.switchMode();

      expect(comp.readMode).toBeFalsy();
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
