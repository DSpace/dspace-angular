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
import { NotificationsService } from '@dspace/core/notification-system/notifications.service';
import { Bitstream } from '@dspace/core/shared/bitstream.model';
import { HALEndpointService } from '@dspace/core/shared/hal-endpoint.service';
import { AuthServiceStub } from '@dspace/core/testing/auth-service.stub';
import { HALEndpointServiceStub } from '@dspace/core/testing/hal-endpoint-service.stub';
import { NotificationsServiceStub } from '@dspace/core/testing/notifications-service.stub';
import { SectionsServiceStub } from '@dspace/core/testing/sections-service.stub';
import { SubmissionServiceStub } from '@dspace/core/testing/submission-service.stub';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

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
    },
  });
  const fileIndex = '0';
  const submissionId = '0';

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
      ],
    }).overrideComponent(SubmissionSectionUploadFileReplaceComponent, {
      remove: { imports: [UploaderComponent] },
      add: { imports: [TestUploaderComponent] },
    }).compileComponents();

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
        .toBe(bitstreamReplaceUrl.concat(`/${bitstream.id}/${submissionId}?replaceFile=${fileIndex}&replaceName=true`));
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
