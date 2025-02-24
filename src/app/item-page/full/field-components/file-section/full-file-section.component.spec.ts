import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  APP_CONFIG,
  Bitstream,
  BitstreamDataService,
  createPaginatedList,
  createSuccessfulRemoteDataObject$,
  MockBitstreamFormat1,
  NotificationsService,
  NotificationsServiceStub,
  PaginationService,
  PaginationServiceStub,
  SearchConfigurationService,
  TranslateLoaderMock,
} from '@dspace/core';
import { provideMockStore } from '@ngrx/store/testing';
import {
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';
import { of as observableOf } from 'rxjs';
import { environment } from 'src/environments/environment';

import { ThemedFileDownloadLinkComponent } from '../../../../shared/file-download-link/themed-file-download-link.component';
import { MetadataFieldWrapperComponent } from '../../../../shared/metadata-field-wrapper/metadata-field-wrapper.component';
import { PaginationComponent } from '../../../../shared/pagination/pagination.component';
import { FileSizePipe } from '../../../../shared/utils/file-size-pipe';
import { VarDirective } from '../../../../shared/utils/var.directive';
import { ThemedThumbnailComponent } from '../../../../thumbnail/themed-thumbnail.component';
import { FullFileSectionComponent } from './full-file-section.component';

describe('FullFileSectionComponent', () => {
  let comp: FullFileSectionComponent;
  let fixture: ComponentFixture<FullFileSectionComponent>;

  const mockBitstream: Bitstream = Object.assign(new Bitstream(),
    {
      sizeBytes: 10201,
      content: 'https://dspace7.4science.it/dspace-spring-rest/api/core/bitstreams/cf9b0c8e-a1eb-4b65-afd0-567366448713/content',
      format: observableOf(MockBitstreamFormat1),
      bundleName: 'ORIGINAL',
      _links: {
        self: {
          href: 'https://dspace7.4science.it/dspace-spring-rest/api/core/bitstreams/cf9b0c8e-a1eb-4b65-afd0-567366448713',
        },
        content: {
          href: 'https://dspace7.4science.it/dspace-spring-rest/api/core/bitstreams/cf9b0c8e-a1eb-4b65-afd0-567366448713/content',
        },
      },
      id: 'cf9b0c8e-a1eb-4b65-afd0-567366448713',
      uuid: 'cf9b0c8e-a1eb-4b65-afd0-567366448713',
      type: 'bitstream',
      metadata: {
        'dc.title': [
          {
            language: null,
            value: 'test_word.docx',
          },
        ],
      },
    });

  const bitstreamDataService = jasmine.createSpyObj('bitstreamDataService', {
    findAllByItemAndBundleName: createSuccessfulRemoteDataObject$(createPaginatedList([mockBitstream, mockBitstream, mockBitstream])),
  });

  const paginationService = new PaginationServiceStub();

  beforeEach(waitForAsync(() => {

    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock,
          },
        }),
        BrowserAnimationsModule,
        FullFileSectionComponent,
        VarDirective,
        FileSizePipe,
        MetadataFieldWrapperComponent,
      ],
      providers: [
        provideMockStore(),
        { provide: BitstreamDataService, useValue: bitstreamDataService },
        { provide: NotificationsService, useValue: new NotificationsServiceStub() },
        { provide: SearchConfigurationService, useValue: jasmine.createSpyObj(['getCurrentConfiguration']) },
        { provide: PaginationService, useValue: paginationService },
        { provide: APP_CONFIG, useValue: environment },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideComponent(FullFileSectionComponent, {
        remove: { imports: [PaginationComponent, MetadataFieldWrapperComponent, ThemedFileDownloadLinkComponent, ThemedThumbnailComponent] },
      })
      .compileComponents();
  }));

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(FullFileSectionComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();
  }));

  describe('when the full file section gets loaded with bitstreams available', () => {
    it('should contain a list with bitstreams', () => {
      const fileSection = fixture.debugElement.queryAll(By.css('.file-section'));
      expect(fileSection.length).toEqual(6);
    });
  });
});
