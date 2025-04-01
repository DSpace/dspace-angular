import { HttpXsrfTokenExtractor } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import {
  NgbModal,
  NgbModule,
} from '@ng-bootstrap/ng-bootstrap';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap/modal/modal-ref';
import { TranslateModule } from '@ngx-translate/core';

import { AuthService } from '../../core/auth/auth.service';
import { DragService } from '../../core/drag.service';
import { CookieService } from '../../core/services/cookie.service';
import { HALEndpointService } from '../../core/shared/hal-endpoint.service';
import { CookieServiceMock } from '../../shared/mocks/cookie.service.mock';
import { HttpXsrfTokenExtractorMock } from '../../shared/mocks/http-xsrf-token-extractor.mock';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { AuthServiceStub } from '../../shared/testing/auth-service.stub';
import { HALEndpointServiceStub } from '../../shared/testing/hal-endpoint-service.stub';
import { NotificationsServiceStub } from '../../shared/testing/notifications-service.stub';
import { ThemedUploaderComponent } from '../../shared/upload/uploader/themed-uploader.component';
import { UploaderComponent } from '../../shared/upload/uploader/uploader.component';
import { ThemedMyDSpaceNewExternalDropdownComponent } from './my-dspace-new-external-dropdown/themed-my-dspace-new-external-dropdown.component';
import { MyDSpaceNewSubmissionComponent } from './my-dspace-new-submission.component';
import { ThemedMyDSpaceNewSubmissionDropdownComponent } from './my-dspace-new-submission-dropdown/themed-my-dspace-new-submission-dropdown.component';

describe('MyDSpaceNewSubmissionComponent', () => {
  let fixture: ComponentFixture<MyDSpaceNewSubmissionComponent>;
  let comp: MyDSpaceNewSubmissionComponent;

  let modalService: NgbModal;

  const uploader: any = jasmine.createSpyObj('uploader', {
    clearQueue: jasmine.createSpy('clearQueue').and.stub(),
    onBuildItemForm: jasmine.createSpy('onBuildItemForm').and.stub(),
    uploadAll: jasmine.createSpy('uploadAll').and.stub(),
  });

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        NgbModule,
        RouterModule.forRoot([]),
        MyDSpaceNewSubmissionComponent,
      ],
      providers: [
        { provide: AuthService, useClass: AuthServiceStub },
        { provide: HALEndpointService, useValue: new HALEndpointServiceStub('workspaceitems') },
        { provide: NotificationsService, useValue: new NotificationsServiceStub() },
        NgbModal,
        ChangeDetectorRef,
        MyDSpaceNewSubmissionComponent,
        DragService,
        { provide: HttpXsrfTokenExtractor, useValue: new HttpXsrfTokenExtractorMock('mock-token') },
        { provide: CookieService, useValue: new CookieServiceMock() },
      ],
    }).overrideComponent(MyDSpaceNewSubmissionComponent, {
      remove: {
        imports: [
          ThemedMyDSpaceNewExternalDropdownComponent,
          ThemedMyDSpaceNewSubmissionDropdownComponent,
          ThemedUploaderComponent,
        ],
      },
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyDSpaceNewSubmissionComponent);
    comp = fixture.componentInstance;
    modalService = TestBed.inject(NgbModal);
    comp.uploadFilesOptions.authToken = 'user-auth-token';
    comp.uploadFilesOptions.url = 'https://fake.upload-api.url';
    comp.uploaderComponent = TestBed.createComponent(UploaderComponent).componentInstance;
    comp.uploaderComponent.uploader = uploader;
  });

  it('should show a collection selector if only one file are uploaded', () => {
    spyOn(modalService, 'open').and.returnValue({ result: new Promise((res, rej) => {/****/}) } as NgbModalRef);

    comp.afterFileLoaded(['']);

    expect(modalService.open).toHaveBeenCalled();
  });
});
