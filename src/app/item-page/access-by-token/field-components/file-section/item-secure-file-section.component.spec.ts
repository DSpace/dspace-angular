import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideMockStore } from '@ngrx/store/testing';
import {
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';
import { of as observableOf } from 'rxjs';
import { APP_CONFIG } from 'src/config/app-config.interface';
import { environment } from 'src/environments/environment';

import { BitstreamDataService } from '../../../../core/data/bitstream-data.service';
import { PaginationService } from '../../../../core/pagination/pagination.service';
import { Bitstream } from '../../../../core/shared/bitstream.model';
import { ThemedFileDownloadLinkComponent } from '../../../../shared/file-download-link/themed-file-download-link.component';
import { MetadataFieldWrapperComponent } from '../../../../shared/metadata-field-wrapper/metadata-field-wrapper.component';
import { MockBitstreamFormat1 } from '../../../../shared/mocks/item.mock';
import { TranslateLoaderMock } from '../../../../shared/mocks/translate-loader.mock';
import { NotificationsService } from '../../../../shared/notifications/notifications.service';
import { PaginationComponent } from '../../../../shared/pagination/pagination.component';
import { createSuccessfulRemoteDataObject$ } from '../../../../shared/remote-data.utils';
import { NotificationsServiceStub } from '../../../../shared/testing/notifications-service.stub';
import { PaginationServiceStub } from '../../../../shared/testing/pagination-service.stub';
import { createPaginatedList } from '../../../../shared/testing/utils.test';
import { FileSizePipe } from '../../../../shared/utils/file-size-pipe';
import { VarDirective } from '../../../../shared/utils/var.directive';
import { ThemedThumbnailComponent } from '../../../../thumbnail/themed-thumbnail.component';
import { ItemSecureFileDownloadLinkComponent } from '../file-download-link/item-secure-file-download-link.component';
import { ItemSecureFileSectionComponent } from './item-secure-file-section.component';

describe('FullFileSectionComponent', () => {
  let comp: ItemSecureFileSectionComponent;
  let fixture: ComponentFixture<ItemSecureFileSectionComponent>;

  const mockBitstream: Bitstream = Object.assign(new Bitstream(), {
    sizeBytes: 10201,
    content: 'test-content-url',
    format: observableOf(MockBitstreamFormat1),
    bundleName: 'ORIGINAL',
    id: 'test-id',
    _links: {
      self: { href: 'test-href' },
      content: { href: 'test-content-href' },
    },
  });

  const bitstreamDataService = jasmine.createSpyObj('bitstreamDataService', {
    findAllByItemAndBundleName: createSuccessfulRemoteDataObject$(createPaginatedList([mockBitstream, mockBitstream, mockBitstream])),
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
        BrowserAnimationsModule,
        ItemSecureFileSectionComponent,
        VarDirective,
        FileSizePipe,
        MetadataFieldWrapperComponent,
      ],
      providers: [
        provideMockStore(),
        { provide: BitstreamDataService, useValue: bitstreamDataService },
        { provide: NotificationsService, useValue: new NotificationsServiceStub() },
        { provide: PaginationService, useValue: new PaginationServiceStub() },
        { provide: APP_CONFIG, useValue: environment },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).overrideComponent(ItemSecureFileSectionComponent, {
      remove: { imports: [PaginationComponent, MetadataFieldWrapperComponent,ItemSecureFileDownloadLinkComponent, ThemedThumbnailComponent, ThemedFileDownloadLinkComponent] },
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemSecureFileSectionComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('when the full file section gets loaded with bitstreams available', () => {
    it('should contain a list with bitstreams', () => {
      const fileSection = fixture.debugElement.queryAll(By.css('.file-section'));
      expect(fileSection.length).toEqual(6);
    });
  });
});
