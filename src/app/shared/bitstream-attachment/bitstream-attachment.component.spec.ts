import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { APP_CONFIG } from '@dspace/config/app-config.interface';
import { BitstreamDataService } from '@dspace/core/data/bitstream-data.service';
import { LocaleService } from '@dspace/core/locale/locale.service';
import { Bitstream } from '@dspace/core/shared/bitstream.model';
import { Item } from '@dspace/core/shared/item.model';
import { TranslateLoaderMock } from '@dspace/core/testing/translate-loader.mock';
import { createSuccessfulRemoteDataObject$ } from '@dspace/core/utilities/remote-data.utils';
import {
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';
import { of } from 'rxjs';
import { ThemedThumbnailComponent } from 'src/app/thumbnail/themed-thumbnail.component';

import { environment } from '../../../environments/environment';
import { TruncatableComponent } from '../truncatable/truncatable.component';
import { TruncatablePartComponent } from '../truncatable/truncatable-part/truncatable-part.component';
import { FileSizePipe } from '../utils/file-size-pipe';
import { FileDownloadButtonComponent } from './attachment-render/types/file-download-button/file-download-button.component';
import { BitstreamAttachmentComponent } from './bitstream-attachment.component';

describe('BitstreamAttachmentComponent', () => {
  let component: BitstreamAttachmentComponent;
  let fixture: ComponentFixture<BitstreamAttachmentComponent>;
  const attachmentMock: any = Object.assign(new Bitstream(),
    {
      checkSum: {
        checkSumAlgorithm: 'MD5',
        value: 'checksum',
      },
      thumbnail: createSuccessfulRemoteDataObject$(new Bitstream()),
    },
  );
  const languageList = ['en;q=1', 'de;q=0.8'];
  const mockLocaleService = jasmine.createSpyObj('LocaleService', {
    getCurrentLanguageCode: of('en'),
    getLanguageCodeList: of(languageList),
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BitstreamAttachmentComponent,
        FileSizePipe,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock,
          },
        }),
      ],
      providers: [
        provideRouter([]),
        { provide: BitstreamDataService, useValue: {} },
        { provide: APP_CONFIG, useValue: environment },
        { provide: LocaleService, useValue: mockLocaleService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideComponent(BitstreamAttachmentComponent, { remove: { imports: [ThemedThumbnailComponent, TruncatableComponent, TruncatablePartComponent, FileDownloadButtonComponent] } }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BitstreamAttachmentComponent);
    component = fixture.componentInstance;
    component.attachment = attachmentMock;
    component.item = new Item();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize attachment properties on init', () => {
    const formatMock$ = createSuccessfulRemoteDataObject$({
      shortDescription: 'PDF',
    } as any);

    attachmentMock.sizeBytes = 12345;
    attachmentMock.checkSum = {
      checkSumAlgorithm: 'MD5',
      value: 'abc123',
    };
    attachmentMock.format = formatMock$;
    attachmentMock.allMetadataValues = jasmine.createSpy()
      .and.returnValue(['provider1']);

    component.ngOnInit();

    expect(component.bitstreamSize).toBe(12345);
    expect(component.checksumInfo.value).toBe('abc123');
    expect(component.allAttachmentProviders).toEqual(['provider1']);
  });

  it('should display the primary badge when primaryBitstreamId matches attachment id', () => {
    component.primaryBitstreamId = attachmentMock.id;
    fixture.detectChanges();
    const badge = fixture.nativeElement.querySelector('.badge.bg-primary');
    expect(badge).toBeTruthy();
  });

  it('should not display the primary badge when primaryBitstreamId does not match', () => {
    component.primaryBitstreamId = 'other-id';
    fixture.detectChanges();
    const badge = fixture.nativeElement.querySelector('.badge.bg-primary');
    expect(badge).toBeNull();
  });
});
