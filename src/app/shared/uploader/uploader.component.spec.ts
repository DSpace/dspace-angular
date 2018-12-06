import { ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { TranslateModule } from '@ngx-translate/core';
import { ScrollToService } from '@nicky-lenaers/ngx-scroll-to';
import { FileUploadModule } from 'ng2-file-upload';

import { UploaderOptions } from './uploader-options.model';
import { UploaderComponent } from './uploader.component';
import { UploaderService } from './uploader.service';
import { createTestComponent } from '../testing/utils';
import { async, ComponentFixture, inject, TestBed, } from '@angular/core/testing';

describe('Chips component', () => {

  let testComp: TestComponent;
  let testFixture: ComponentFixture<TestComponent>;
  let html;

  // async beforeEach
  beforeEach(async(() => {

    TestBed.configureTestingModule({
      imports: [
        FileUploadModule,
        TranslateModule.forRoot()
      ],
      declarations: [
        UploaderComponent,
        TestComponent,
      ], // declare the test component
      providers: [
        ChangeDetectorRef,
        ScrollToService,
        UploaderComponent,
        UploaderService
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
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
  template: ``
})
class TestComponent {
  public uploadFilesOptions: UploaderOptions = {
    url: 'http://test',
    authToken: null,
    disableMultipart: false,
    itemAlias: null
  };

  /* tslint:disable:no-empty */
  public onBeforeUpload = () => {
  };

  onCompleteItem(event) {
  }

  /* tslint:enable:no-empty */
}
