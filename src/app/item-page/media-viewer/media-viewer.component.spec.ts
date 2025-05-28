import {
  NO_ERRORS_SCHEMA,
  PLATFORM_ID,
} from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import {
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';
import { of } from 'rxjs';

import { AuthService } from '../../core/auth/auth.service';
import { BitstreamDataService } from '../../core/data/bitstream-data.service';
import { AuthorizationDataService } from '../../core/data/feature-authorization/authorization-data.service';
import { Bitstream } from '../../core/shared/bitstream.model';
import { FileService } from '../../core/shared/file.service';
import { MediaViewerItem } from '../../core/shared/media-viewer-item.model';
import { MetadataFieldWrapperComponent } from '../../shared/metadata-field-wrapper/metadata-field-wrapper.component';
import { AuthServiceMock } from '../../shared/mocks/auth.service.mock';
import { MockBitstreamFormat1 } from '../../shared/mocks/item.mock';
import { getMockThemeService } from '../../shared/mocks/theme-service.mock';
import { TranslateLoaderMock } from '../../shared/mocks/translate-loader.mock';
import { createSuccessfulRemoteDataObject$ } from '../../shared/remote-data.utils';
import { ActivatedRouteStub } from '../../shared/testing/active-router.stub';
import { createPaginatedList } from '../../shared/testing/utils.test';
import { ThemeService } from '../../shared/theme-support/theme.service';
import { FileSizePipe } from '../../shared/utils/file-size-pipe';
import { VarDirective } from '../../shared/utils/var.directive';
import { MediaViewerComponent } from './media-viewer.component';

describe('MediaViewerComponent', () => {
  let comp: MediaViewerComponent;
  let fixture: ComponentFixture<MediaViewerComponent>;
  let authService;
  let authorizationService;
  let fileService;

  const mockBitstream: Bitstream = Object.assign(new Bitstream(), {
    sizeBytes: 10201,
    content:
      'https://dspace7.4science.it/dspace-spring-rest/api/core/bitstreams/cf9b0c8e-a1eb-4b65-afd0-567366448713/content',
    format: of(MockBitstreamFormat1),
    bundleName: 'ORIGINAL',
    _links: {
      self: {
        href:
          'https://dspace7.4science.it/dspace-spring-rest/api/core/bitstreams/cf9b0c8e-a1eb-4b65-afd0-567366448713',
      },
      content: {
        href:
          'https://dspace7.4science.it/dspace-spring-rest/api/core/bitstreams/cf9b0c8e-a1eb-4b65-afd0-567366448713/content',
      },
    },
    id: 'cf9b0c8e-a1eb-4b65-afd0-567366448713',
    uuid: 'cf9b0c8e-a1eb-4b65-afd0-567366448713',
    type: 'bitstream',
    metadata: {
      'dc.title': [
        {
          language: null,
          value: 'test_image.jpg',
        },
      ],
    },
  });

  const bitstreamDataService = jasmine.createSpyObj('bitstreamDataService', {
    findAllByItemAndBundleName: createSuccessfulRemoteDataObject$(
      createPaginatedList([mockBitstream]),
    ),
  });

  const mockMediaViewerItem: MediaViewerItem = Object.assign(
    new MediaViewerItem(),
    { bitstream: mockBitstream, format: 'image', thumbnail: null },
  );

  beforeEach(waitForAsync(() => {
    authService = jasmine.createSpyObj('AuthService', {
      isAuthenticated: of(true),
    });
    authorizationService = jasmine.createSpyObj('AuthorizationService', {
      isAuthorized: of(true),
    });
    fileService = jasmine.createSpyObj('FileService', {
      retrieveFileDownloadLink: null,
    });
    return TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock,
          },
        }),
        BrowserAnimationsModule,
        MediaViewerComponent,
        VarDirective,
        FileSizePipe,
        MetadataFieldWrapperComponent,
      ],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: AuthorizationDataService, useValue: authorizationService },
        { provide: FileService, useValue: fileService },
        { provide: PLATFORM_ID, useValue: 'browser' },
        { provide: BitstreamDataService, useValue: bitstreamDataService },
        { provide: ThemeService, useValue: getMockThemeService() },
        { provide: AuthService, useValue: new AuthServiceMock() },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MediaViewerComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('when the bitstreams are loading', () => {
    beforeEach(() => {
      comp.mediaList$.next([mockMediaViewerItem]);
      comp.mediaOptions = {
        image: true,
        video: true,
      };
      comp.isLoading = true;
      fixture.detectChanges();
    });

    it('should call the createMediaViewerItem', () => {
      const mediaItem = comp.createMediaViewerItem(
        mockBitstream,
        MockBitstreamFormat1,
        undefined,
      );
      expect(mediaItem).toBeTruthy();
      expect(mediaItem.thumbnail).toBe(null);
    });

    it('should display a loading component', () => {
      const loading = fixture.debugElement.query(By.css('ds-loading'));
      expect(loading.nativeElement).toBeDefined();
    });
  });

  describe('when the bitstreams loading is failed', () => {
    beforeEach(() => {
      comp.mediaList$.next([]);
      comp.mediaOptions = {
        image: true,
        video: true,
      };
      comp.isLoading = false;
      fixture.detectChanges();
    });

    it('should call the createMediaViewerItem', () => {
      const mediaItem = comp.createMediaViewerItem(
        mockBitstream,
        MockBitstreamFormat1,
        undefined,
      );
      expect(mediaItem).toBeTruthy();
      expect(mediaItem.thumbnail).toBe(null);
    });

    it('should display a default thumbnail', () => {
      const defaultThumbnail = fixture.debugElement.query(
        By.css('ds-thumbnail'),
      );
      expect(defaultThumbnail.nativeElement).toBeDefined();
    });
  });
});
