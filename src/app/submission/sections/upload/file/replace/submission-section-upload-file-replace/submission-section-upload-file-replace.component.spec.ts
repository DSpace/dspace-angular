import { Location } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AuthService } from '@dspace/core/auth/auth.service';
import { LocaleService } from '@dspace/core/locale/locale.service';
import { NotificationsService } from '@dspace/core/notification-system/notifications.service';
import { HALEndpointService } from '@dspace/core/shared/hal-endpoint.service';
import { AuthServiceStub } from '@dspace/core/testing/auth-service.stub';
import { HALEndpointServiceStub } from '@dspace/core/testing/hal-endpoint-service.stub';
import { NotificationsServiceStub } from '@dspace/core/testing/notifications-service.stub';
import { SectionsServiceStub } from '@dspace/core/testing/sections-service.stub';
import { SubmissionServiceStub } from '@dspace/core/testing/submission-service.stub';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { UploaderComponent } from '../../../../../../shared/upload/uploader/uploader.component';
import { UploaderOptions } from '../../../../../../shared/upload/uploader/uploader-options.model';
import { UploaderProperties } from '../../../../../../shared/upload/uploader/uploader-properties.model';
import { FileSizePipe } from '../../../../../../shared/utils/file-size-pipe';
import { VarDirective } from '../../../../../../shared/utils/var.directive';
import { SubmissionService } from '../../../../../submission.service';
import { SectionsService } from '../../../../sections.service';
import { SubmissionSectionUploadFileReplaceComponent } from './submission-section-upload-file-replace.component';

describe('SubmissionSectionUploadFileReplaceComponent', () => {
  let component: SubmissionSectionUploadFileReplaceComponent;
  let fixture: ComponentFixture<SubmissionSectionUploadFileReplaceComponent>;
  let uploadComponent;
  let activeModal: NgbActiveModal;
  let notificationsService: NotificationsServiceStub;
  let sectionsService: SectionsServiceStub;
  let submissionService: SubmissionServiceStub;

  const bitstreamReplaceUrl = 'bitstream-replace-endpoint';
  const halService = new HALEndpointServiceStub(bitstreamReplaceUrl);
  const locationObject = jasmine.createSpyObj('location', ['back']);
  const bitstreamUuid = 'test-bitstream-uuid-123';
  const fileIndex = '0';
  const submissionId = 'test-submission-id';
  const editItemsLinkName = 'edititems';

  const mockSections = { upload: [{ uuid: bitstreamUuid }] };
  const mockWorkspaceItem = { sections: mockSections, errors: [] };
  const mockRemoteData = { isSuccess: true, payload: mockWorkspaceItem };

  const mockLocaleService = jasmine.createSpyObj('LocaleService', {
    getCurrentLanguageCode: jasmine.createSpy('getCurrentLanguageCode'),
    getLanguageCodeList: of(['en;q=1', 'de;q=0.8']),
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        SubmissionSectionUploadFileReplaceComponent,
        TranslateModule.forRoot(),
        VarDirective,
        FileSizePipe,
      ],
      providers: [
        { provide: Location, useValue: locationObject },
        { provide: NotificationsService, useClass: NotificationsServiceStub },
        { provide: AuthService, useClass: AuthServiceStub },
        { provide: HALEndpointService, useValue: halService },
        { provide: SectionsService, useClass: SectionsServiceStub },
        { provide: SubmissionService, useClass: SubmissionServiceStub },
        { provide: NgbActiveModal },
        { provide: LocaleService, useValue: mockLocaleService },
      ],
    }).overrideComponent(SubmissionSectionUploadFileReplaceComponent, {
      remove: { imports: [UploaderComponent] },
      add: { imports: [TestUploaderComponent] },
    }).compileComponents();

    mockLocaleService.getCurrentLanguageCode.and.returnValue(of('en'));
    fixture = TestBed.createComponent(SubmissionSectionUploadFileReplaceComponent);
    component = fixture.componentInstance;
    component.fileIndex = fileIndex;
    component.submissionId = submissionId;
    component.bitstreamUuid = bitstreamUuid;
    activeModal = TestBed.inject(NgbActiveModal);
    notificationsService = TestBed.inject(NotificationsService) as unknown as NotificationsServiceStub;
    sectionsService = TestBed.inject(SectionsService) as unknown as SectionsServiceStub;
    submissionService = TestBed.inject(SubmissionService) as unknown as SubmissionServiceStub;
    submissionService.getSubmissionObjectLinkName.and.returnValue(editItemsLinkName);
    fixture.detectChanges();
    uploadComponent = fixture.debugElement.query(By.directive(TestUploaderComponent)).context;
  });

  describe('on init', () => {
    it('should build the upload URL pointing to the edititems endpoint with replaceFile param', () => {
      // URL must be: {halBase}/{editItemsLinkName}/{submissionId}?replaceFile={bitstreamUuid}&replaceName=true
      const expectedUrl = `${bitstreamReplaceUrl}/${editItemsLinkName}/${submissionId}?replaceFile=${bitstreamUuid}&replaceName=true`;
      expect(uploadComponent.uploadFilesOptions.url).toBe(expectedUrl);
    });
  });

  describe('onCompleteItem', () => {
    beforeEach(() => {
      submissionService.retrieveSubmission.and.returnValue(of(mockRemoteData));
      spyOn(activeModal, 'close');
    });

    it('should close the modal immediately', () => {
      (component as any).onCompleteItem({});
      expect(activeModal.close).toHaveBeenCalled();
    });

    it('should show a success notification', () => {
      (component as any).onCompleteItem({});
      expect(notificationsService.success).toHaveBeenCalled();
    });

    it('should retrieve the submission to refresh the store', () => {
      (component as any).onCompleteItem({});
      expect(submissionService.retrieveSubmission).toHaveBeenCalledWith(submissionId);
    });

    it('should update section data for each section in the retrieved submission', () => {
      (component as any).onCompleteItem({});
      expect(sectionsService.updateSectionData).toHaveBeenCalledWith(
        submissionId, 'upload', jasmine.anything(), undefined, undefined,
      );
    });

    it('should not update section data when retrieval fails', () => {
      submissionService.retrieveSubmission.and.returnValue(of({ isSuccess: false }));
      (component as any).onCompleteItem({});
      expect(sectionsService.updateSectionData).not.toHaveBeenCalled();
    });
  });

  describe('drop multiple files', () => {
    let fileMock;
    let fileMock2;

    beforeEach(async () => {
      fileMock = new File([''], 'filename.txt', { type: 'text/plain' });
      uploadComponent.uploader.queue.push(fileMock);
      fileMock2 = new File([''], 'filename2.txt', { type: 'text/plain' });
      uploadComponent.uploader.queue.push(fileMock2);
      uploadComponent.onFileSelected.emit();
    });

    it('should only keep the last one', () => {
      expect(uploadComponent.uploader.queue).toHaveSize(1);
      expect(uploadComponent.uploader.queue).toContain(fileMock2);
    });
  });
});

@Component({
  selector: 'ds-uploader',
  template: ``,
})
class TestUploaderComponent {
  @Input() dropMsg: string;
  @Input() dropOverDocumentMsg: string;
  @Input() enableDragOverDocument: boolean;
  @Input() onBeforeUpload: () => void;
  @Input() uploadFilesOptions: UploaderOptions;
  @Input() uploadProperties: UploaderProperties;
  @Output() onCompleteItem: EventEmitter<any> = new EventEmitter<any>();
  @Output() onUploadError: EventEmitter<any> = new EventEmitter<any>();
  @Output() onFileSelected: EventEmitter<any> = new EventEmitter<any>();
  uploader = {
    queue: [],
    removeFromQueue: undefined,
    uploadAll: jasmine.createSpy('uploadAll'),
  };
  constructor() {
    this.uploader.removeFromQueue = jasmine.createSpy('removeFromQueue').and.callFake(
      (file) => this.uploader.queue = this.uploader.queue.filter((f) => file !== f));
  }
}
