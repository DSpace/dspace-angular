import { HttpXsrfTokenExtractor } from '@angular/common/http';
import {
  ChangeDetectorRef,
  Component,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import {
  ComponentFixture,
  inject,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from '@dspace/core/auth/auth.service';
import { CookieService } from '@dspace/core/cookies/cookie.service';
import { EntityTypeDataService } from '@dspace/core/data/entity-type-data.service';
import { DragService } from '@dspace/core/drag.service';
import { NotificationsService } from '@dspace/core/notification-system/notifications.service';
import { HALEndpointService } from '@dspace/core/shared/hal-endpoint.service';
import { AuthServiceStub } from '@dspace/core/testing/auth-service.stub';
import { CookieServiceMock } from '@dspace/core/testing/cookie.service.mock';
import { HALEndpointServiceStub } from '@dspace/core/testing/hal-endpoint-service.stub';
import { HostWindowServiceStub } from '@dspace/core/testing/host-window-service.stub';
import { HttpXsrfTokenExtractorMock } from '@dspace/core/testing/http-xsrf-token-extractor.mock';
import { NotificationsServiceStub } from '@dspace/core/testing/notifications-service.stub';
import { getMockScrollToService } from '@dspace/core/testing/scroll-to-service.mock';
import { TranslateLoaderMock } from '@dspace/core/testing/translate-loader.mock';
import { createTestComponent } from '@dspace/core/testing/utils.test';
import {
  NgbModal,
  NgbModule,
} from '@ng-bootstrap/ng-bootstrap';
import {
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';
import { ScrollToService } from '@nicky-lenaers/ngx-scroll-to';

import { HostWindowService } from '../../shared/host-window.service';
import { UploaderComponent } from '../../shared/upload/uploader/uploader.component';
import { MyDSpaceNewSubmissionComponent } from './my-dspace-new-submission.component';
import { getMockEntityTypeService } from './my-dspace-new-submission-dropdown/my-dspace-new-submission-dropdown.component.spec';

describe('MyDSpaceNewSubmissionComponent test', () => {

  const uploader: any = jasmine.createSpyObj('uploader', {
    clearQueue: jasmine.createSpy('clearQueue').and.stub(),
    onBuildItemForm: jasmine.createSpy('onBuildItemForm').and.stub(),
    uploadAll: jasmine.createSpy('uploadAll').and.stub(),
  });

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock,
          },
        }),
        NgbModule,
        RouterTestingModule,
        MyDSpaceNewSubmissionComponent,
        TestComponent,
      ],
      providers: [
        { provide: AuthService, useClass: AuthServiceStub },
        { provide: HALEndpointService, useValue: new HALEndpointServiceStub('workspaceitems') },
        { provide: NotificationsService, useValue: new NotificationsServiceStub() },
        { provide: ScrollToService, useValue: getMockScrollToService() },
        NgbModal,
        ChangeDetectorRef,
        MyDSpaceNewSubmissionComponent,
        DragService,
        { provide: HttpXsrfTokenExtractor, useValue: new HttpXsrfTokenExtractorMock('mock-token') },
        { provide: CookieService, useValue: new CookieServiceMock() },
        { provide: HostWindowService, useValue: new HostWindowServiceStub(800) },
        { provide: EntityTypeDataService, useValue: getMockEntityTypeService() },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  describe('', () => {
    let testComp: TestComponent;
    let testFixture: ComponentFixture<TestComponent>;

    // synchronous beforeEach
    beforeEach(() => {
      const html = `
        <ds-my-dspace-new-submission (uploadEnd)="reload($event)"></ds-my-dspace-new-submission>`;

      testFixture = createTestComponent(html, TestComponent) as ComponentFixture<TestComponent>;
      testComp = testFixture.componentInstance;
    });

    afterEach(() => {
      testFixture.destroy();
    });

    it('should create MyDSpaceNewSubmissionComponent', inject([MyDSpaceNewSubmissionComponent], (app: MyDSpaceNewSubmissionComponent) => {

      expect(app).toBeDefined();

    }));
  });

  describe('', () => {
    let fixture: ComponentFixture<MyDSpaceNewSubmissionComponent>;
    let comp: MyDSpaceNewSubmissionComponent;

    beforeEach(() => {
      fixture = TestBed.createComponent(MyDSpaceNewSubmissionComponent);
      comp = fixture.componentInstance;
      comp.uploadFilesOptions.authToken = 'user-auth-token';
      comp.uploadFilesOptions.url = 'https://fake.upload-api.url';
      comp.uploaderComponent = TestBed.createComponent(UploaderComponent).componentInstance;
      comp.uploaderComponent.uploader = uploader;
    });

    it('should show a collection selector if only one file are uploaded', (done) => {
      spyOn((comp as any).modalService, 'open').and.returnValue({ result: new Promise((res, rej) => {/****/}) });
      comp.afterFileLoaded(['']);
      expect((comp as any).modalService.open).toHaveBeenCalled();
      done();
    });
  });
});

// declare a test component
@Component({
  selector: 'ds-test-cmp',
  template: ``,
  standalone: true,
  imports: [NgbModule,
    RouterTestingModule],
})
class TestComponent {

  reload = (event) => {
    return;
  };
}
