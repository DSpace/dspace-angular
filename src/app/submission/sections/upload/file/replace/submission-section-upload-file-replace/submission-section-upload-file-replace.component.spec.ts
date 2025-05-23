import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmissionSectionUploadFileReplaceComponent } from './submission-section-upload-file-replace.component';
import { Location } from '@angular/common';
import { NotificationsService } from '../../../../../../shared/notifications/notifications.service';
import { NotificationsServiceStub } from '../../../../../../shared/testing/notifications-service.stub';
import { AuthService } from '../../../../../../core/auth/auth.service';
import { AuthServiceStub } from '../../../../../../shared/testing/auth-service.stub';
import { VarDirective } from '../../../../../../shared/utils/var.directive';
import { FileSizePipe } from '../../../../../../shared/utils/file-size-pipe';
import { TranslateModule } from '@ngx-translate/core';
import { Bitstream } from '../../../../../../core/shared/bitstream.model';
import { UploaderComponent } from '../../../../../../shared/upload/uploader/uploader.component';
import { By } from '@angular/platform-browser';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { UploaderOptions } from '../../../../../../shared/upload/uploader/uploader-options.model';
import { UploaderProperties } from '../../../../../../shared/upload/uploader/uploader-properties.model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HALEndpointService } from '../../../../../../core/shared/hal-endpoint.service';
import { HALEndpointServiceStub } from '../../../../../../shared/testing/hal-endpoint-service.stub';
import { SectionsService } from '../../../../sections.service';
import { SubmissionServiceStub } from '../../../../../../shared/testing/submission-service.stub';
import { SectionsServiceStub } from '../../../../../../shared/testing/sections-service.stub';
import { SubmissionService } from '../../../../../submission.service';

describe('SubmissionSectionUploadFileReplaceComponent', () => {
  let component: SubmissionSectionUploadFileReplaceComponent;
  let fixture: ComponentFixture<SubmissionSectionUploadFileReplaceComponent>;
  let uploadComponent: UploaderComponent;
  const bitstreamReplaceUrl = 'bitstream-replace-endpoint';
  let halService = new HALEndpointServiceStub(bitstreamReplaceUrl);

  const locationObject = jasmine.createSpyObj('location', ['back']);
  const bitstreamSelfLink = 'bitstreams/123';
  const bundleSelfLink = 'bundles/456';
  const bitstream = Object.assign(new Bitstream(), {
    _links: {
      self: { href: bitstreamSelfLink },
      bundle: { href: bundleSelfLink },
      id: '123',
    }
  });
  const fileIndex = '0';
  const submissionId = '0';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [SubmissionSectionUploadFileReplaceComponent, VarDirective, FileSizePipe, TestUploaderComponent],
      providers: [
        { provide: Location, useValue: locationObject },
        { provide: NotificationsService, useClass: NotificationsServiceStub },
        { provide: AuthService, useClass: AuthServiceStub },
        { provide: HALEndpointService, useValue: halService },
        { provide: SectionsService, useClass: SectionsServiceStub },
        { provide: SubmissionService, useClass: SubmissionServiceStub },
        { provide: NgbActiveModal },
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(SubmissionSectionUploadFileReplaceComponent);
    component = fixture.componentInstance;
    component.fileIndex = fileIndex;
    component.submissionId = submissionId;
    component.fileName = bitstream.id;
    fixture.detectChanges();
    uploadComponent = fixture.debugElement.query(By.directive(TestUploaderComponent)).context;
  });

  describe('on init', () => {
    it('should have upload url with replaceFile param', () => {
      expect(uploadComponent.uploadFilesOptions.url)
        .toBe(bitstreamReplaceUrl.concat(`/${bitstream.id}/${submissionId}?replaceFile=${fileIndex}&replaceName=undefined`));
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
  template: ``
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
