import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateLoaderMock } from '../../../shared/mocks/translate-loader.mock';
import { FileSizePipe } from '../../../shared/utils/file-size-pipe';
import { VarDirective } from '../../../shared/utils/var.directive';
import { MetadataFieldWrapperComponent } from '../../field-components/metadata-field-wrapper/metadata-field-wrapper.component';

import { MediaViewerVideoComponent } from './media-viewer-video.component';

describe('MediaViewerVideoComponent', () => {
  let component: MediaViewerVideoComponent;
  let fixture: ComponentFixture<MediaViewerVideoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock,
          },
        }),
        BrowserAnimationsModule,
      ],
      declarations: [
        MediaViewerVideoComponent,
        VarDirective,
        FileSizePipe,
        MetadataFieldWrapperComponent,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MediaViewerVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
