import { HttpXsrfTokenExtractor } from '@angular/common/http';
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
import { By } from '@angular/platform-browser';
import { AuthService } from '@dspace/core/auth/auth.service';
import { CookieService } from '@dspace/core/cookies/cookie.service';
import { DragService } from '@dspace/core/drag.service';
import { CookieServiceMock } from '@dspace/core/testing/cookie.service.mock';
import { HttpXsrfTokenExtractorMock } from '@dspace/core/testing/http-xsrf-token-extractor.mock';
import { createTestComponent } from '@dspace/core/testing/utils.test';
import { TranslateModule } from '@ngx-translate/core';
import { FileUploadModule } from 'ng2-file-upload';

import { LiveRegionService } from '../../live-region/live-region.service';
import { getLiveRegionServiceStub } from '../../live-region/live-region.service.stub';
import { UploaderComponent } from './uploader.component';
import { UploaderOptions } from './uploader-options.model';

describe('UploaderComponent', () => {

  let testComp: TestComponent;
  let testFixture: ComponentFixture<TestComponent>;
  let html;
  let authService: jasmine.SpyObj<AuthService>;

  // waitForAsync beforeEach
  beforeEach(waitForAsync(() => {
    authService = jasmine.createSpyObj('AuthService', ['buildAuthHeader']);
    authService.buildAuthHeader.and.returnValue('Bearer initial-jwt');

    TestBed.configureTestingModule({
      imports: [
        FileUploadModule,
        TranslateModule.forRoot(),
        UploaderComponent,
        TestComponent,
      ],
      providers: [
        ChangeDetectorRef,
        UploaderComponent,
        DragService,
        { provide: AuthService, useValue: authService },
        { provide: HttpXsrfTokenExtractor, useValue: new HttpXsrfTokenExtractorMock('mock-token') },
        { provide: CookieService, useValue: new CookieServiceMock() },
        { provide: LiveRegionService, useValue: getLiveRegionServiceStub() },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    });

  }));

  // synchronous beforeEach
  beforeEach(() => {
    html = `
      <ds-uploader [onBeforeUpload]="onBeforeUpload"
                   [uploadFilesOptions]="uploadFilesOptions"
                   (onCompleteItem)="onCompleteItem($event)"></ds-uploader>`;

    testFixture = createTestComponent(html, TestComponent) as ComponentFixture<TestComponent>;
    testComp = testFixture.componentInstance;
  });

  it('should create Uploader Component', inject([UploaderComponent], (app: UploaderComponent) => {

    expect(app).toBeDefined();
  }));

  it('should send only the current JWT when uploading again after token refresh', () => {
    const component: UploaderComponent = testFixture.debugElement.query(By.directive(UploaderComponent)).componentInstance;
    component.uploader.options.autoUpload = false;
    const requests: any[] = [];
    spyOn(window, 'XMLHttpRequest').and.callFake(function () {
      const xhr = jasmine.createSpyObj('XMLHttpRequest', ['open', 'setRequestHeader', 'send', 'getAllResponseHeaders']);
      xhr.upload = {};
      xhr.status = 200;
      xhr.response = '{}';
      xhr.getAllResponseHeaders.and.returnValue('');
      requests.push(xhr);
      return xhr;
    });

    component.uploader.addToQueue([new File(['first'], 'first.txt')]);
    component.uploader.uploadAll();
    expect(requests.length).withContext('first upload').toBe(1);
    expect(requests[0].setRequestHeader.calls.allArgs().filter(([name]) => name === 'Authorization'))
      .toEqual([['Authorization', 'Bearer initial-jwt']]);
    requests[0].onload();

    authService.buildAuthHeader.and.returnValue('Bearer refreshed-jwt');
    component.uploader.addToQueue([new File(['second'], 'second.txt')]);
    component.uploader.uploadAll();
    expect(requests.length).withContext('second upload').toBe(2);
    expect(requests[1].setRequestHeader.calls.allArgs().filter(([name]) => name === 'Authorization'))
      .toEqual([['Authorization', 'Bearer refreshed-jwt']]);
    expect(requests[1].setRequestHeader).toHaveBeenCalledWith('X-XSRF-TOKEN', 'mock-token');
    requests[1].onload();
  });

  it('should clear the cached JWT when authentication is no longer available', () => {
    const component: UploaderComponent = testFixture.debugElement.query(By.directive(UploaderComponent)).componentInstance;
    component.uploader.authToken = 'Bearer expired-jwt';
    authService.buildAuthHeader.and.returnValue('');

    component.uploader.onBeforeUploadItem({ url: component.uploader.options.url } as any);

    expect(component.uploader.authToken).toBe('');
  });

});

// declare a test component
@Component({
  selector: 'ds-test-cmp',
  template: `<ds-uploader></ds-uploader>`,
  imports: [
    FileUploadModule,
    UploaderComponent,
  ],
})
class TestComponent {
  public uploadFilesOptions: UploaderOptions = Object.assign(new UploaderOptions(), {
    url: 'http://test',
    authToken: null,
    disableMultipart: false,
    itemAlias: null,
  });

  /* eslint-disable no-empty,@typescript-eslint/no-empty-function */
  public onBeforeUpload = () => {
  };

  onCompleteItem(event) {
  }

  /* eslint-enable no-empty, @typescript-eslint/no-empty-function */
}
