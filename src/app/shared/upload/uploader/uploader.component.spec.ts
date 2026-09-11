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

  /**
   * Bring an injected UploaderComponent instance to the state in which its ng2-file-upload
   * callbacks are installed, so that `app.uploader.onCompleteItem(...)` runs the component's code.
   */
  const driveUploader = (app: UploaderComponent): void => {
    app.uploadFilesOptions = Object.assign(new UploaderOptions(), {
      url: 'http://test',
      authToken: null,
      disableMultipart: false,
      itemAlias: null,
    });
    app.ngOnInit();
    app.ngAfterViewInit();
  };

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

  it('should emit both the legacy completion output and the new completion event on a completed upload', inject([UploaderComponent], (app: UploaderComponent) => {
    driveUploader(app);
    spyOn(app.onCompleteItem, 'emit');
    spyOn(app.onCompleteItemWithFile, 'emit');

    const parsed = { foo: 'bar' };
    app.uploader.onCompleteItem({ file: { name: 'test.pdf' } } as any, JSON.stringify(parsed), 200, {});

    expect(app.onCompleteItem.emit).toHaveBeenCalledWith(parsed);
    expect(app.onCompleteItem.emit).toHaveBeenCalledTimes(1);
    expect(app.onCompleteItemWithFile.emit).toHaveBeenCalledWith({ response: parsed, fileName: 'test.pdf' });
  }));

  it('should emit a distinct file name for each of two sequential completed uploads', inject([UploaderComponent], (app: UploaderComponent) => {
    driveUploader(app);
    spyOn(app.onCompleteItemWithFile, 'emit');

    app.uploader.onCompleteItem({ file: { name: 'first.pdf' } } as any, JSON.stringify({ n: 1 }), 200, {});
    app.uploader.onCompleteItem({ file: { name: 'second.pdf' } } as any, JSON.stringify({ n: 2 }), 200, {});

    const calls = (app.onCompleteItemWithFile.emit as jasmine.Spy).calls;
    expect(calls.count()).toBe(2);
    expect(calls.argsFor(0)[0]).toEqual({ response: { n: 1 }, fileName: 'first.pdf' });
    expect(calls.argsFor(1)[0]).toEqual({ response: { n: 2 }, fileName: 'second.pdf' });
  }));

  it('should omit fileName from the completion event when the item is undefined', inject([UploaderComponent], (app: UploaderComponent) => {
    driveUploader(app);
    spyOn(app.onCompleteItemWithFile, 'emit');

    app.uploader.onCompleteItem(undefined, JSON.stringify({ foo: 'bar' }), 200, {});

    const arg = (app.onCompleteItemWithFile.emit as jasmine.Spy).calls.mostRecent().args[0];
    expect(app.onCompleteItemWithFile.emit).toHaveBeenCalledWith({ response: { foo: 'bar' } });
    expect(Object.keys(arg)).toEqual(['response']);
    expect('fileName' in arg).toBeFalse();
  }));

  it('should omit fileName from the completion event when the item has no file', inject([UploaderComponent], (app: UploaderComponent) => {
    driveUploader(app);
    spyOn(app.onCompleteItemWithFile, 'emit');

    app.uploader.onCompleteItem({} as any, JSON.stringify({ foo: 'bar' }), 200, {});

    const arg = (app.onCompleteItemWithFile.emit as jasmine.Spy).calls.mostRecent().args[0];
    expect(app.onCompleteItemWithFile.emit).toHaveBeenCalledWith({ response: { foo: 'bar' } });
    expect(Object.keys(arg)).toEqual(['response']);
    expect('fileName' in arg).toBeFalse();
  }));

  it('should omit fileName from the completion event when the file has no name', inject([UploaderComponent], (app: UploaderComponent) => {
    driveUploader(app);
    spyOn(app.onCompleteItemWithFile, 'emit');

    app.uploader.onCompleteItem({ file: {} } as any, JSON.stringify({ foo: 'bar' }), 200, {});

    const arg = (app.onCompleteItemWithFile.emit as jasmine.Spy).calls.mostRecent().args[0];
    expect(app.onCompleteItemWithFile.emit).toHaveBeenCalledWith({ response: { foo: 'bar' } });
    expect(Object.keys(arg)).toEqual(['response']);
    expect('fileName' in arg).toBeFalse();
  }));

  it('should omit fileName from the completion event when the file name is an empty string', inject([UploaderComponent], (app: UploaderComponent) => {
    driveUploader(app);
    spyOn(app.onCompleteItemWithFile, 'emit');

    app.uploader.onCompleteItem({ file: { name: '' } } as any, JSON.stringify({ foo: 'bar' }), 200, {});

    const arg = (app.onCompleteItemWithFile.emit as jasmine.Spy).calls.mostRecent().args[0];
    expect(app.onCompleteItemWithFile.emit).toHaveBeenCalledWith({ response: { foo: 'bar' } });
    expect('fileName' in arg).toBeFalse();
  }));

  it('should keep a whitespace-only file name on the completion event', inject([UploaderComponent], (app: UploaderComponent) => {
    driveUploader(app);
    spyOn(app.onCompleteItemWithFile, 'emit');

    app.uploader.onCompleteItem({ file: { name: '   ' } } as any, JSON.stringify({ foo: 'bar' }), 200, {});

    expect(app.onCompleteItemWithFile.emit).toHaveBeenCalledWith({ response: { foo: 'bar' }, fileName: '   ' });
  }));

  it('should not emit either completion output when the response body is empty', inject([UploaderComponent], (app: UploaderComponent) => {
    driveUploader(app);
    spyOn(app.onCompleteItem, 'emit');
    spyOn(app.onCompleteItemWithFile, 'emit');

    app.uploader.onCompleteItem({ file: { name: 'test.pdf' } } as any, '', 204, {});

    expect(app.onCompleteItem.emit).not.toHaveBeenCalled();
    expect(app.onCompleteItemWithFile.emit).not.toHaveBeenCalled();
  }));

  it('should emit onUploadError with the item, response, status and headers of the failed upload', inject([UploaderComponent], (app: UploaderComponent) => {
    driveUploader(app);
    spyOn(app.onUploadError, 'emit');

    app.uploader.onErrorItem({ file: { name: 'broken.zip' } } as any, 'boom', 500, {});

    expect(app.onUploadError.emit).toHaveBeenCalledWith({
      item: { file: { name: 'broken.zip' } },
      response: 'boom',
      status: 500,
      headers: {},
    });
  }));

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
