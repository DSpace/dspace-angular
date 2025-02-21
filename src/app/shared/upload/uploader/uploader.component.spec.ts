// Load the implementations that should be tested
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
import { TranslateModule } from '@ngx-translate/core';
import { FileUploadModule } from 'ng2-file-upload';

import { DragService } from '../../../../../modules/core/src/lib/core/drag.service';
import { CookieServiceMock } from '../../../../../modules/core/src/lib/core/mocks/cookie.service.mock';
import { HttpXsrfTokenExtractorMock } from '../../../../../modules/core/src/lib/core/mocks/http-xsrf-token-extractor.mock';
import { CookieService } from '../../../../../modules/core/src/lib/core/services/cookie.service';
import { createTestComponent } from '../../../../../modules/core/src/lib/core/utilities/testing/utils.test';
import { UploaderComponent } from './uploader.component';
import { UploaderOptions } from './uploader-options.model';

describe('Chips component', () => {

  let testComp: TestComponent;
  let testFixture: ComponentFixture<TestComponent>;
  let html;

  // waitForAsync beforeEach
  beforeEach(waitForAsync(() => {

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
        { provide: HttpXsrfTokenExtractor, useValue: new HttpXsrfTokenExtractorMock('mock-token') },
        { provide: CookieService, useValue: new CookieServiceMock() },
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

});

// declare a test component
@Component({
  selector: 'ds-test-cmp',
  template: ``,
  standalone: true,
  imports: [FileUploadModule, UploaderComponent],
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
