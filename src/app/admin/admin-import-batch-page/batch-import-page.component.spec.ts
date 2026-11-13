import { Location } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  BATCH_IMPORT_SCRIPT_NAME,
  ScriptDataService,
} from '@dspace/core/data/processes/script-data.service';
import { StagedUploadService } from '@dspace/core/data/staged-upload.service';
import { LocaleService } from '@dspace/core/locale/locale.service';
import { NotificationsService } from '@dspace/core/notification-system/notifications.service';
import { ProcessParameter } from '@dspace/core/processes/process-parameter.model';
import { NotificationsServiceStub } from '@dspace/core/testing/notifications-service.stub';
import {
  createFailedRemoteDataObject$,
  createSuccessfulRemoteDataObject$,
} from '@dspace/core/utilities/remote-data.utils';
import { TranslateModule } from '@ngx-translate/core';
import {
  BehaviorSubject,
  of,
  Subject,
  throwError,
} from 'rxjs';

import { FileDropzoneNoUploaderComponent } from '../../shared/upload/file-dropzone-no-uploader/file-dropzone-no-uploader.component';
import { FileValueAccessorDirective } from '../../shared/utils/file-value-accessor.directive';
import { FileValidator } from '../../shared/utils/require-file.validator';
import { BatchImportPageComponent } from './batch-import-page.component';

describe('BatchImportPageComponent', () => {
  let component: BatchImportPageComponent;
  let fixture: ComponentFixture<BatchImportPageComponent>;

  let notificationService: NotificationsServiceStub;
  let scriptService: any;
  let stagedUploads: any;
  let router;
  let locationStub;

  function init() {
    notificationService = new NotificationsServiceStub();
    scriptService = jasmine.createSpyObj('scriptService',
      {
        invoke: createSuccessfulRemoteDataObject$({ processId: '46' }),
      },
    );
    stagedUploads = {
      start: jasmine.createSpy('start').and.returnValue(of(46)),
      cancel: jasmine.createSpy('cancel').and.returnValue(of(undefined)),
      retained: undefined,
      progress$: new BehaviorSubject({ phase: 'idle', loaded: 0, total: 0, bytesPerSecond: null }),
    };
    router = jasmine.createSpyObj('router', {
      navigateByUrl: jasmine.createSpy('navigateByUrl'),
    });
    locationStub = jasmine.createSpyObj('location', {
      back: jasmine.createSpy('back'),
    });
  }

  beforeEach(waitForAsync(() => {
    init();
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        TranslateModule.forRoot(),
        RouterTestingModule.withRoutes([]),
        BatchImportPageComponent, FileValueAccessorDirective, FileValidator,
      ],
      providers: [
        { provide: NotificationsService, useValue: notificationService },
        { provide: ScriptDataService, useValue: scriptService },
        { provide: StagedUploadService, useValue: stagedUploads },
        { provide: LocaleService, useValue: { getCurrentLanguageCode: () => of('en') } },
        { provide: Router, useValue: router },
        { provide: Location, useValue: locationStub },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideComponent(BatchImportPageComponent, {
        remove: {
          imports: [FileDropzoneNoUploaderComponent],
        },
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BatchImportPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('if back button is pressed', () => {
    beforeEach(fakeAsync(() => {
      const proceed = fixture.debugElement.query(By.css('#backButton')).nativeElement;
      proceed.click();
      fixture.detectChanges();
    }));
    it('should do location.back', () => {
      expect(locationStub.back).toHaveBeenCalled();
    });
  });

  describe('if file is set', () => {
    let fileMock: File;

    beforeEach(() => {
      component.isUpload = true;
      fileMock = new File([''], 'filename.zip', { type: 'application/zip' });
      component.setFile(fileMock);
    });

    it('should show the file dropzone', () => {
      const fileDropzone = fixture.debugElement.query(By.css('[data-test="file-dropzone"]'));
      const fileUrlInput = fixture.debugElement.query(By.css('[data-test="file-url-input"]'));
      expect(fileDropzone).toBeTruthy();
      expect(fileUrlInput).toBeFalsy();
    });

    describe('if proceed button is pressed without validate only', () => {
      beforeEach(fakeAsync(() => {
        component.validateOnly = false;
        const proceed = fixture.debugElement.query(By.css('#proceedButton')).nativeElement;
        proceed.click();
        fixture.detectChanges();
      }));
      it('metadata-import script is invoked with --zip fileName and the mockFile', () => {
        const parameterValues: ProcessParameter[] = [
          Object.assign(new ProcessParameter(), { name: '--add' }),
          Object.assign(new ProcessParameter(), { name: '--zip', value: 'filename.zip' }),
        ];
        expect(stagedUploads.start).toHaveBeenCalledWith(fileMock, jasmine.any(Function),
          { parameters: parameterValues, collectionName: undefined });
        expect(scriptService.invoke).not.toHaveBeenCalled();
      });
      it('success notification is shown', () => {
        expect(notificationService.success).toHaveBeenCalled();
      });
      it('redirected to process page', () => {
        expect(router.navigateByUrl).toHaveBeenCalledWith('/processes/46');
      });
    });

    describe('if proceed button is pressed with validate only', () => {
      beforeEach(fakeAsync(() => {
        component.validateOnly = true;
        const proceed = fixture.debugElement.query(By.css('#proceedButton')).nativeElement;
        proceed.click();
        fixture.detectChanges();
      }));
      it('metadata-import script is invoked with --zip fileName and the mockFile and -v validate-only', () => {
        const parameterValues: ProcessParameter[] = [
          Object.assign(new ProcessParameter(), { name: '--add' }),
          Object.assign(new ProcessParameter(), { name: '--zip', value: 'filename.zip' }),
          Object.assign(new ProcessParameter(), { name: '-v', value: true }),
        ];
        expect(stagedUploads.start).toHaveBeenCalledWith(fileMock, jasmine.any(Function),
          { parameters: parameterValues, collectionName: undefined });
      });
      it('success notification is shown', () => {
        expect(notificationService.success).toHaveBeenCalled();
      });
      it('redirected to process page', () => {
        expect(router.navigateByUrl).toHaveBeenCalledWith('/processes/46');
      });
    });

    describe('if proceed is pressed; but script invoke fails', () => {
      beforeEach(fakeAsync(() => {
        jasmine.getEnv().allowRespy(true);
        stagedUploads.start.and.returnValue(throwError(() => new Error('Upload failed')));
        const proceed = fixture.debugElement.query(By.css('#proceedButton')).nativeElement;
        proceed.click();
        fixture.detectChanges();
      }));
      it('error notification is shown', () => {
        expect(notificationService.error).toHaveBeenCalled();
      });
    });
  });

  it('shows the file, collection, progress and speed, and offers only cancellation while uploading', () => {
    const process = new Subject<number>();
    const file = new File(['abcdef'], 'batch.zip');
    stagedUploads.start.and.returnValue(process);
    component.setFile(file);
    component.importMetadata();
    component.importMetadata();
    stagedUploads.retained = { file, context: { parameters: [], collectionName: 'SAF collection' } };
    stagedUploads.progress$.next({ phase: 'uploading', loaded: 3, total: 6, bytesPerSecond: 1024 });
    fixture.detectChanges();
    const page = fixture.nativeElement;
    expect(stagedUploads.start).toHaveBeenCalledTimes(1);
    expect(page.textContent).not.toContain('admin.batch-import.page.help');
    expect(page.querySelector('[data-test="upload-file"]')).toBeTruthy();
    expect(page.querySelector('[data-test="upload-collection"]').textContent).toContain('admin.batch-import.upload.collection');
    expect(page.querySelector('[data-test="file-dropzone"]')).toBeNull();
    expect(page.querySelector('progress').value).toBe(3);
    expect(page.querySelector('[data-test="upload-speed"]')).toBeTruthy();
    expect(page.querySelector('#proceedButton')).toBeNull();
    expect(page.querySelector('#backButton')).toBeNull();
    const cancel = page.querySelector('#cancelUploadButton');
    expect(cancel.classList).toContain('btn-danger');
    expect(cancel.getAttribute('aria-disabled')).not.toBe('true');
    expect(router.navigateByUrl).not.toHaveBeenCalled();

    stagedUploads.progress$.next({ phase: 'starting', loaded: 6, total: 6, bytesPerSecond: null });
    fixture.detectChanges();
    expect(page.querySelector('[data-test="upload-speed"]')).toBeNull();
    expect(page.querySelector('#saf-upload-label').textContent).toContain('admin.batch-import.upload.starting');
    expect(page.querySelector('#cancelUploadButton').getAttribute('aria-disabled')).toBe('true');
    expect(router.navigateByUrl).not.toHaveBeenCalled();
    process.next(46);
    process.complete();
    expect(router.navigateByUrl).toHaveBeenCalledOnceWith('/processes/46');
    expect(component.uploading).toBeFalse();
  });

  it('offers resume and cancel, and confirms the original target, when a file is retained', () => {
    stagedUploads.retained = { file: new File(['abcdef'], 'retained.zip'), context: { parameters: [] } };
    fixture.detectChanges();
    const page = fixture.nativeElement;
    expect(page.textContent).not.toContain('admin.batch-import.page.help');
    expect(page.querySelector('[data-test="upload-collection"]').textContent).toContain('admin.batch-import.upload.collection.none');
    expect(page.querySelector('[role="status"]').textContent).toContain('admin.batch-import.upload.resume');
    expect(page.querySelector('[data-test="file-dropzone"]')).toBeNull();
    expect(page.querySelector('#proceedButton')).toBeTruthy();
    expect(page.querySelector('#backButton')).toBeTruthy();
    expect(page.querySelector('#cancelUploadButton').classList).toContain('btn-danger');
    page.querySelector('#cancelUploadButton').click();
    expect(stagedUploads.cancel).toHaveBeenCalled();
  });

  it('does not round an unacknowledged upload up to 100 percent', () => {
    expect(component.uploadPercentage(999, 1000)).toBe(99);
    expect(component.uploadPercentage(1000, 1000)).toBe(100);
  });

  describe('if url is set', () => {
    beforeEach(fakeAsync(() => {
      component.isUpload = false;
      component.fileURL = 'example.fileURL.com';
      fixture.detectChanges();
    }));

    it('should show the file url input', () => {
      const fileDropzone = fixture.debugElement.query(By.css('[data-test="file-dropzone"]'));
      const fileUrlInput = fixture.debugElement.query(By.css('[data-test="file-url-input"]'));
      expect(fileDropzone).toBeFalsy();
      expect(fileUrlInput).toBeTruthy();
    });

    describe('if proceed button is pressed without validate only', () => {
      beforeEach(fakeAsync(() => {
        component.validateOnly = false;
        const proceed = fixture.debugElement.query(By.css('#proceedButton')).nativeElement;
        proceed.click();
        fixture.detectChanges();
      }));
      it('metadata-import script is invoked with --url and the file url', () => {
        const parameterValues: ProcessParameter[] = [
          Object.assign(new ProcessParameter(), { name: '--add' }),
          Object.assign(new ProcessParameter(), { name: '--url', value: 'example.fileURL.com' }),
        ];
        expect(scriptService.invoke).toHaveBeenCalledWith(BATCH_IMPORT_SCRIPT_NAME, parameterValues, [null]);
      });
      it('success notification is shown', () => {
        expect(notificationService.success).toHaveBeenCalled();
      });
      it('redirected to process page', () => {
        expect(router.navigateByUrl).toHaveBeenCalledWith('/processes/46');
      });
    });

    describe('if proceed button is pressed with validate only', () => {
      beforeEach(fakeAsync(() => {
        component.validateOnly = true;
        const proceed = fixture.debugElement.query(By.css('#proceedButton')).nativeElement;
        proceed.click();
        fixture.detectChanges();
      }));
      it('metadata-import script is invoked with --url and the file url and -v validate-only', () => {
        const parameterValues: ProcessParameter[] = [
          Object.assign(new ProcessParameter(), { name: '--add' }),
          Object.assign(new ProcessParameter(), { name: '--url', value: 'example.fileURL.com' }),
          Object.assign(new ProcessParameter(), { name: '-v', value: true }),
        ];
        expect(scriptService.invoke).toHaveBeenCalledWith(BATCH_IMPORT_SCRIPT_NAME, parameterValues, [null]);
      });
      it('success notification is shown', () => {
        expect(notificationService.success).toHaveBeenCalled();
      });
      it('redirected to process page', () => {
        expect(router.navigateByUrl).toHaveBeenCalledWith('/processes/46');
      });
    });

    describe('if proceed is pressed; but script invoke fails', () => {
      beforeEach(fakeAsync(() => {
        jasmine.getEnv().allowRespy(true);
        spyOn(scriptService, 'invoke').and.returnValue(createFailedRemoteDataObject$('Error', 500));
        const proceed = fixture.debugElement.query(By.css('#proceedButton')).nativeElement;
        proceed.click();
        fixture.detectChanges();
      }));
      it('error notification is shown', () => {
        expect(notificationService.error).toHaveBeenCalled();
      });
    });
  });
});
