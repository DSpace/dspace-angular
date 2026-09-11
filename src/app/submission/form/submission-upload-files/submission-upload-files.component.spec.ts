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
import { NotificationsService } from '@dspace/core/notification-system/notifications.service';
import { SubmissionJsonPatchOperationsService } from '@dspace/core/submission/submission-json-patch-operations.service';
import { NotificationsServiceStub } from '@dspace/core/testing/notifications-service.stub';
import { SectionsServiceStub } from '@dspace/core/testing/sections-service.stub';
import { SubmissionJsonPatchOperationsServiceStub } from '@dspace/core/testing/submission-json-patch-operations-service.stub';
import { SubmissionServiceStub } from '@dspace/core/testing/submission-service.stub';
import { getMockTranslateService } from '@dspace/core/testing/translate.service.mock';
import { createTestComponent } from '@dspace/core/testing/utils.test';
import { Store } from '@ngrx/store';
import {
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import {
  cold,
  hot,
} from 'jasmine-marbles';
import { of } from 'rxjs';

import { UploaderOptions } from '../../../shared/upload/uploader/uploader-options.model';
import { SectionsService } from '../../sections/sections.service';
import { SubmissionService } from '../../submission.service';
import {
  mockSectionsData,
  mockSubmissionCollectionId,
  mockSubmissionId,
  mockSubmissionObject,
  mockUploadResponse2Errors,
  mockUploadResponse2ParsedErrors,
} from '../../utils/submission.mock';
import { SubmissionUploadFilesComponent } from './submission-upload-files.component';

describe('SubmissionUploadFilesComponent Component', () => {

  let comp: SubmissionUploadFilesComponent;
  let compAsAny: any;
  let fixture: ComponentFixture<SubmissionUploadFilesComponent>;
  let submissionServiceStub: SubmissionServiceStub;
  let sectionsServiceStub: SectionsServiceStub;
  let notificationsServiceStub: NotificationsServiceStub;
  let translateService: any;

  const submissionJsonPatchOperationsServiceStub = new SubmissionJsonPatchOperationsServiceStub();
  const submissionId = mockSubmissionId;
  const collectionId = mockSubmissionCollectionId;
  const uploadRestResponse: any = mockSubmissionObject;

  const store: any = jasmine.createSpyObj('store', {
    dispatch: jasmine.createSpy('dispatch'),
    select: jasmine.createSpy('select'),
  });

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        SubmissionUploadFilesComponent,
        TestComponent,
      ],
      providers: [
        { provide: NotificationsService, useClass: NotificationsServiceStub },
        { provide: SubmissionService, useClass: SubmissionServiceStub },
        { provide: SectionsService, useClass: SectionsServiceStub },
        { provide: TranslateService, useValue: getMockTranslateService() },
        { provide: SubmissionJsonPatchOperationsService, useValue: submissionJsonPatchOperationsServiceStub },
        { provide: Store, useValue: store },
        ChangeDetectorRef,
        SubmissionUploadFilesComponent,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  describe('', () => {
    let testComp: TestComponent;
    let testFixture: ComponentFixture<TestComponent>;

    // synchronous beforeEach
    beforeEach(() => {
      const html = `
        <ds-submission-upload-files [submissionId]="submissionId"
                                    [collectionId]="collectionId"
                                    [uploadFilesOptions]="uploadFilesOptions"></ds-submission-upload-files>`;

      testFixture = createTestComponent(html, TestComponent) as ComponentFixture<TestComponent>;
      testComp = testFixture.componentInstance;
    });

    afterEach(() => {
      testFixture.destroy();
    });

    it('should create SubmissionUploadFilesComponent', inject([SubmissionUploadFilesComponent], (app: SubmissionUploadFilesComponent) => {

      expect(app).toBeDefined();

    }));
  });

  describe('', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(SubmissionUploadFilesComponent);
      comp = fixture.componentInstance;
      compAsAny = comp;
      submissionServiceStub = TestBed.inject(SubmissionService as any);
      sectionsServiceStub = TestBed.inject(SectionsService as any);
      sectionsServiceStub.isSectionTypeAvailable.and.returnValue(of(true));
      notificationsServiceStub = TestBed.inject(NotificationsService as any);
      translateService = TestBed.inject(TranslateService);
      translateService.instant.and.callFake((key: string) => `translated:${key}`);
      comp.submissionId = submissionId;
      comp.collectionId = collectionId;
      comp.uploadFilesOptions = Object.assign(new UploaderOptions(),{
        url: '',
        authToken: null,
        disableMultipart: false,
        itemAlias: null,
      });

    });

    afterEach(() => {
      comp = null;
      compAsAny = null;
      fixture = null;
      submissionServiceStub = null;
      sectionsServiceStub = null;
      notificationsServiceStub = null;
      translateService = null;
    });

    it('should init uploadEnabled properly', () => {
      sectionsServiceStub.isSectionTypeAvailable.and.returnValue(hot('-a-b', {
        a: false,
        b: true,
      }));

      const expected = cold('-c-d', {
        c: false,
        d: true,
      });

      comp.ngOnChanges();
      fixture.detectChanges();

      expect(compAsAny.uploadEnabled).toBeObservable(expected);
    });

    describe('on upload complete', () => {
      beforeEach(() => {
        sectionsServiceStub.isSectionType.and.callFake((_, sectionId, __) => of(sectionId === 'upload'));
        compAsAny.uploadEnabled = of(true);
      });

      it('should show a success notification and call updateSectionData if successful', () => {
        const expectedErrors: any = [];
        fixture.detectChanges();
        const data = {
          upload: {
            files: [{ url: 'testUrl' }],
          } };
        comp.onCompleteItem({
          response: Object.assign({}, uploadRestResponse, { sections: data }),
          fileName: 'test.pdf',
        });

        Object.keys(data).forEach((sectionId) => {
          expect(sectionsServiceStub.updateSectionData).toHaveBeenCalledWith(
            submissionId,
            sectionId,
            data[sectionId],
            expectedErrors[sectionId],
            expectedErrors[sectionId],
          );
        });

        expect(notificationsServiceStub.success).toHaveBeenCalled();

      });

      it('should show an error notification and call updateSectionData if unsuccessful', () => {
        const responseErrors = mockUploadResponse2Errors;
        const expectedErrors: any = mockUploadResponse2ParsedErrors;
        fixture.detectChanges();

        comp.onCompleteItem({
          response: Object.assign({}, uploadRestResponse, {
            sections: mockSectionsData,
            errors: responseErrors.errors,
          }),
          fileName: 'test.pdf',
        });

        Object.keys(mockSectionsData).forEach((sectionId) => {
          expect(sectionsServiceStub.updateSectionData).toHaveBeenCalledWith(
            submissionId,
            sectionId,
            mockSectionsData[sectionId],
            expectedErrors[sectionId],
            expectedErrors[sectionId],
          );
        });

        expect(notificationsServiceStub.success).not.toHaveBeenCalled();

      });

      it('should include the file name in the success notification content', () => {
        fixture.detectChanges();

        comp.onCompleteItem({
          response: Object.assign({}, uploadRestResponse, { sections: mockSectionsData }),
          fileName: 'test.pdf',
        });

        expect(translateService.get).toHaveBeenCalledWith(
          'submission.sections.upload.upload-successful-file',
          {
            fileName: 'test.pdf',
            default: 'translated:submission.sections.upload.upload-successful',
          },
        );
        expect(translateService.get).not.toHaveBeenCalledWith('submission.sections.upload.upload-successful');
        expect(notificationsServiceStub.success).toHaveBeenCalledTimes(1);
      });

      it('should fall back to the generic success key when no file name is available', () => {
        fixture.detectChanges();

        comp.onCompleteItem({
          response: Object.assign({}, uploadRestResponse, { sections: mockSectionsData }),
        });

        expect(translateService.get).toHaveBeenCalledWith('submission.sections.upload.upload-successful');
        expect(translateService.get).not.toHaveBeenCalledWith('submission.sections.upload.upload-successful-file', jasmine.anything());
        expect(notificationsServiceStub.success).toHaveBeenCalledTimes(1);
      });

      it('should fall back to the generic success key when the file name is an empty string', () => {
        fixture.detectChanges();

        comp.onCompleteItem({
          response: Object.assign({}, uploadRestResponse, { sections: mockSectionsData }),
          fileName: '',
        });

        expect(translateService.get).toHaveBeenCalledWith('submission.sections.upload.upload-successful');
        expect(translateService.get).not.toHaveBeenCalledWith('submission.sections.upload.upload-successful-file', jasmine.anything());
      });

      it('should include the file name in the error notification content when the upload section has errors', () => {
        fixture.detectChanges();

        comp.onCompleteItem({
          response: Object.assign({}, uploadRestResponse, {
            sections: mockSectionsData,
            errors: mockUploadResponse2Errors.errors,
          }),
          fileName: 'test.pdf',
        });

        expect(translateService.get).toHaveBeenCalledWith(
          'submission.sections.upload.upload-failed-file',
          {
            fileName: 'test.pdf',
            default: 'translated:submission.sections.upload.upload-failed',
          },
        );
        expect(translateService.get).not.toHaveBeenCalledWith('submission.sections.upload.upload-failed');
        expect(notificationsServiceStub.error).toHaveBeenCalledTimes(1);
        expect(notificationsServiceStub.success).not.toHaveBeenCalled();
      });

      it('should fall back to the generic error key when the upload section has errors and no file name is available', () => {
        fixture.detectChanges();

        comp.onCompleteItem({
          response: Object.assign({}, uploadRestResponse, {
            sections: mockSectionsData,
            errors: mockUploadResponse2Errors.errors,
          }),
        });

        expect(translateService.get).toHaveBeenCalledWith('submission.sections.upload.upload-failed');
        expect(translateService.get).not.toHaveBeenCalledWith('submission.sections.upload.upload-failed-file', jasmine.anything());
        expect(notificationsServiceStub.error).toHaveBeenCalledTimes(1);
      });

      it('should not notify when the completion response carries no sections', () => {
        fixture.detectChanges();

        comp.onCompleteItem({ response: { message: 'forced' }, fileName: 'x.pdf' });

        expect(notificationsServiceStub.success).not.toHaveBeenCalled();
        expect(notificationsServiceStub.error).not.toHaveBeenCalled();
      });

      it('should not throw when the completion event is malformed', () => {
        fixture.detectChanges();

        expect(() => comp.onCompleteItem(undefined as any)).not.toThrow();
        expect(() => comp.onCompleteItem({ response: undefined })).not.toThrow();

        expect(notificationsServiceStub.success).not.toHaveBeenCalled();
        expect(notificationsServiceStub.error).not.toHaveBeenCalled();
      });

      it('should raise file-name notifications on the escaped rendering path', () => {
        const hostileName = '<img src=x onerror=alert(1)>.pdf';
        fixture.detectChanges();

        comp.onCompleteItem({
          response: Object.assign({}, uploadRestResponse, { sections: mockSectionsData }),
          fileName: hostileName,
        });
        comp.onUploadError({ item: { file: { name: hostileName } }, response: 'boom', status: 500, headers: {} });

        // Two arguments only: NotificationsService.success/error(title, content, options?, html = false).
        // A 4th positional `true` would move the content to the [innerHTML] branch of
        // notification.component.html, where an attacker-controlled file name would be parsed as markup.
        expect(notificationsServiceStub.success.calls.mostRecent().args.length).toBe(2);
        expect(notificationsServiceStub.error.calls.mostRecent().args.length).toBe(2);
        expect(translateService.get).toHaveBeenCalledWith(
          'submission.sections.upload.upload-successful-file',
          jasmine.objectContaining({ fileName: hostileName }),
        );
        expect(translateService.get).toHaveBeenCalledWith(
          'submission.sections.upload.upload-failed-file',
          jasmine.objectContaining({ fileName: hostileName }),
        );
      });
    });

    describe('on upload error', () => {
      it('should show an error notification including the file name when available', () => {
        comp.onUploadError({ item: { file: { name: 'broken.zip' } }, response: 'boom', status: 500, headers: {} });

        expect(notificationsServiceStub.error).toHaveBeenCalledTimes(1);
        expect(translateService.get).toHaveBeenCalledWith(
          'submission.sections.upload.upload-failed-file',
          {
            fileName: 'broken.zip',
            default: 'translated:submission.sections.upload.upload-failed',
          },
        );
        expect(translateService.get).not.toHaveBeenCalledWith('submission.sections.upload.upload-failed');
      });

      it('should fall back to the generic error key when no file name is available', () => {
        comp.onUploadError();

        expect(notificationsServiceStub.error).toHaveBeenCalledTimes(1);
        expect(translateService.get).toHaveBeenCalledWith('submission.sections.upload.upload-failed');
        expect(translateService.get).not.toHaveBeenCalledWith('submission.sections.upload.upload-failed-file', jasmine.anything());
      });

      it('should fall back to the generic error key when the error carries no item', () => {
        comp.onUploadError({});

        expect(notificationsServiceStub.error).toHaveBeenCalledTimes(1);
        expect(translateService.get).toHaveBeenCalledWith('submission.sections.upload.upload-failed');
        expect(translateService.get).not.toHaveBeenCalledWith('submission.sections.upload.upload-failed-file', jasmine.anything());
      });
    });
  });
});

// declare a test component
@Component({
  selector: 'ds-test-cmp',
  template: ``,
})
class TestComponent {

  submissionId = mockSubmissionId;
  collectionId = mockSubmissionCollectionId;
  uploadFilesOptions = Object.assign(new UploaderOptions(), {
    url: '',
    authToken: null,
    disableMultipart: false,
    itemAlias: null,
  });

}
