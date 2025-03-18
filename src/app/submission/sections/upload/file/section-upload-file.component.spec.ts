import {
  AsyncPipe,
  CommonModule,
} from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
  NgbModal,
  NgbModule,
} from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import {
  of as observableOf,
  of,
} from 'rxjs';

import { APP_DATA_SERVICES_MAP } from '../../../../../config/app-config.interface';
import { JsonPatchOperationPathCombiner } from '../../../../core/json-patch/builder/json-patch-operation-path-combiner';
import { JsonPatchOperationsBuilder } from '../../../../core/json-patch/builder/json-patch-operations-builder';
import { HALEndpointService } from '../../../../core/shared/hal-endpoint.service';
import { SubmissionJsonPatchOperationsService } from '../../../../core/submission/submission-json-patch-operations.service';
import { ThemedFileDownloadLinkComponent } from '../../../../shared/file-download-link/themed-file-download-link.component';
import { FormBuilderService } from '../../../../shared/form/builder/form-builder.service';
import { FormService } from '../../../../shared/form/form.service';
import { getMockFormService } from '../../../../shared/mocks/form-service.mock';
import { getMockSectionUploadService } from '../../../../shared/mocks/section-upload.service.mock';
import {
  mockSubmissionCollectionId,
  mockSubmissionId,
  mockUploadConfigResponse,
  mockUploadFiles,
} from '../../../../shared/mocks/submission.mock';
import { getMockThemeService } from '../../../../shared/mocks/theme-service.mock';
import { HALEndpointServiceStub } from '../../../../shared/testing/hal-endpoint-service.stub';
import { SubmissionJsonPatchOperationsServiceStub } from '../../../../shared/testing/submission-json-patch-operations-service.stub';
import { SubmissionServiceStub } from '../../../../shared/testing/submission-service.stub';
import { createTestComponent } from '../../../../shared/testing/utils.test';
import { ThemeService } from '../../../../shared/theme-support/theme.service';
import { FileSizePipe } from '../../../../shared/utils/file-size-pipe';
import { SubmissionService } from '../../../submission.service';
import { SectionUploadService } from '../section-upload.service';
import { POLICY_DEFAULT_WITH_LIST } from '../section-upload-constants';
import { SubmissionSectionUploadFileEditComponent } from './edit/section-upload-file-edit.component';
import { SubmissionSectionUploadFileComponent } from './section-upload-file.component';
import { ThemedSubmissionSectionUploadFileComponent } from './themed-section-upload-file.component';
import { SubmissionSectionUploadFileViewComponent } from './view/section-upload-file-view.component';

const configMetadataFormMock = {
  rows: [{
    fields: [{
      selectableMetadata: [
        { metadata: 'dc.title', label: null, closed: false },
        { metadata: 'dc.description', label: null, closed: false },
      ],
    }],
  }],
};

describe('SubmissionSectionUploadFileComponent test suite', () => {

  let comp: SubmissionSectionUploadFileComponent;
  let compAsAny: any;
  let fixture: ComponentFixture<SubmissionSectionUploadFileComponent>;
  let submissionServiceStub: SubmissionServiceStub;
  let uploadService: any;
  let formService: any;
  let halService: any;
  let operationsBuilder: any;
  let operationsService: any;

  const submissionJsonPatchOperationsServiceStub = new SubmissionJsonPatchOperationsServiceStub();
  const submissionId = mockSubmissionId;
  const sectionId = 'upload';
  const collectionId = mockSubmissionCollectionId;
  const availableAccessConditionOptions = mockUploadConfigResponse.accessConditionOptions;
  const collectionPolicyType = POLICY_DEFAULT_WITH_LIST;
  const fileIndex = '0';
  const fileName = '123456-test-upload.jpg';
  const fileId = '123456-test-upload';
  const fileData: any = mockUploadFiles[0];
  const pathCombiner = new JsonPatchOperationPathCombiner('sections', sectionId);

  const jsonPatchOpBuilder: any = jasmine.createSpyObj('jsonPatchOpBuilder', {
    add: jasmine.createSpy('add'),
    replace: jasmine.createSpy('replace'),
    remove: jasmine.createSpy('remove'),
  });

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        NgbModule,
        TranslateModule.forRoot(),
        FileSizePipe,
        SubmissionSectionUploadFileComponent,
        TestComponent,
      ],
      providers: [
        { provide: FormService, useValue: getMockFormService() },
        { provide: HALEndpointService, useValue: new HALEndpointServiceStub('workspaceitems') },
        { provide: JsonPatchOperationsBuilder, useValue: jsonPatchOpBuilder },
        { provide: SubmissionJsonPatchOperationsService, useValue: submissionJsonPatchOperationsServiceStub },
        { provide: SubmissionService, useClass: SubmissionServiceStub },
        { provide: SectionUploadService, useValue: getMockSectionUploadService() },
        { provide: ThemeService, useValue: getMockThemeService() },
        { provide: APP_DATA_SERVICES_MAP, useValue: {} },
        ChangeDetectorRef,
        NgbModal,
        SubmissionSectionUploadFileComponent,
        SubmissionSectionUploadFileEditComponent,
        FormBuilderService,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideComponent(SubmissionSectionUploadFileComponent, {
        remove: { imports: [
          SubmissionSectionUploadFileViewComponent,
          ThemedFileDownloadLinkComponent,
        ] },
      })
      .compileComponents().then();
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

    it('should create SubmissionSectionUploadFileComponent', () => {
      let app = TestBed.inject(SubmissionSectionUploadFileComponent);
      expect(app).toBeDefined();
    });
  });

  describe('', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(SubmissionSectionUploadFileComponent);
      comp = fixture.componentInstance;
      compAsAny = comp;
      compAsAny.configMetadataForm = configMetadataFormMock;
      submissionServiceStub = TestBed.inject(SubmissionService as any);
      uploadService = TestBed.inject(SectionUploadService);
      formService = TestBed.inject(FormService);
      halService = TestBed.inject(HALEndpointService);
      operationsBuilder = TestBed.inject(JsonPatchOperationsBuilder);
      operationsService = TestBed.inject(SubmissionJsonPatchOperationsService);

      comp.submissionId = submissionId;
      comp.collectionId = collectionId;
      comp.sectionId = sectionId;
      comp.availableAccessConditionOptions = availableAccessConditionOptions;
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

      comp.ngOnChanges({});

      expect(comp.fileData).toEqual(fileData);
    });

    it('should call deleteFile on delete confirmation', async () => {
      spyOn(compAsAny, 'deleteFile');
      comp.fileData = fileData;

      fixture.detectChanges();

      const modalBtn = fixture.debugElement.query(By.css('.fa-trash '));

      modalBtn.nativeElement.click();
      fixture.detectChanges();

      const confirmBtn: any = ((document as any).querySelector('.btn-danger:nth-child(2)'));
      confirmBtn.click();

      fixture.detectChanges();

      await fixture.whenStable();
      expect(compAsAny.deleteFile).toHaveBeenCalled();
    });

    it('should delete primary if file we delete is primary', () => {
      compAsAny.isPrimary = true;
      compAsAny.pathCombiner = pathCombiner;
      operationsService.jsonPatchByResourceID.and.returnValue(observableOf({}));
      compAsAny.deleteFile();
      expect(operationsBuilder.remove).toHaveBeenCalledWith(pathCombiner.getPath('primary'));
      expect(uploadService.updateFilePrimaryBitstream).toHaveBeenCalledWith(submissionId, sectionId, null);
    });

    it('should NOT delete primary if file we delete is NOT primary', () => {
      compAsAny.isPrimary = false;
      compAsAny.pathCombiner = pathCombiner;
      operationsService.jsonPatchByResourceID.and.returnValue(observableOf({}));
      compAsAny.deleteFile();
      expect(uploadService.updateFilePrimaryBitstream).not.toHaveBeenCalledTimes(1);
    });

    it('should delete file properly', () => {
      compAsAny.pathCombiner = pathCombiner;
      operationsService.jsonPatchByResourceID.and.returnValue(observableOf({}));
      submissionServiceStub.getSubmissionObjectLinkName.and.returnValue('workspaceitems');

      compAsAny.deleteFile();

      expect(uploadService.removeUploadedFile).toHaveBeenCalledWith(submissionId, sectionId, fileId);
      expect(operationsBuilder.remove).toHaveBeenCalledWith(pathCombiner.getPath(['files', fileIndex]));

      expect(operationsService.jsonPatchByResourceID).toHaveBeenCalledWith(
        'workspaceitems',
        submissionId,
        pathCombiner.rootElement,
        pathCombiner.subRootElement);
    });

    it('should open edit modal when edit button is clicked', () => {
      spyOn(compAsAny, 'editBitstreamData').and.callThrough();
      comp.fileData = fileData;

      fixture.detectChanges();

      const modalBtn = fixture.debugElement.query(By.css('.fa-edit '));

      modalBtn.nativeElement.click();
      fixture.detectChanges();

      expect(compAsAny.editBitstreamData).toHaveBeenCalled();
    });

  });
});

// declare a test component
@Component({
  selector: 'ds-test-cmp',
  template: ``,
  standalone: true,
  imports: [
    ThemedSubmissionSectionUploadFileComponent,
    CommonModule,
    AsyncPipe,
    NgbModule],
})
class TestComponent {

  availableGroups;
  availableAccessConditionOptions;
  collectionId = mockSubmissionCollectionId;
  collectionPolicyType;
  configMetadataForm$ = of(configMetadataFormMock);
  fileIndexes = [];
  fileList = [];
  fileNames = [];
  sectionId = 'upload';
  submissionId = mockSubmissionId;
}
