import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { APP_CONFIG } from '@dspace/config/app-config.interface';
import { BitstreamDataService } from '@dspace/core/data/bitstream-data.service';
import { BitstreamFormatDataService } from '@dspace/core/data/bitstream-format-data.service';
import { LocaleService } from '@dspace/core/locale/locale.service';
import { NotificationsService } from '@dspace/core/notification-system/notifications.service';
import { PaginationService } from '@dspace/core/pagination/pagination.service';
import { Bitstream } from '@dspace/core/shared/bitstream.model';
import { BitstreamFormat } from '@dspace/core/shared/bitstream-format.model';
import { Item } from '@dspace/core/shared/item.model';
import { ActivatedRouteStub } from '@dspace/core/testing/active-router.stub';
import { NotificationsServiceStub } from '@dspace/core/testing/notifications-service.stub';
import { PaginationServiceStub } from '@dspace/core/testing/pagination-service.stub';
import { TranslateLoaderMock } from '@dspace/core/testing/translate-loader.mock';
import { createPaginatedList } from '@dspace/core/testing/utils.test';
import { createSuccessfulRemoteDataObject$ } from '@dspace/core/utilities/remote-data.utils';
import { XSRFService } from '@dspace/core/xsrf/xsrf.service';
import { provideMockStore } from '@ngrx/store/testing';
import {
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';
import { of } from 'rxjs';

import { environment } from '../../../../../environments/environment';
import { ThemedFileDownloadLinkComponent } from '../../../../shared/file-download-link/themed-file-download-link.component';
import { PaginationComponent } from '../../../../shared/pagination/pagination.component';
import { SearchConfigurationService } from '../../../../shared/search/search-configuration.service';
import { getMockThemeService } from '../../../../shared/theme-support/test/theme-service.mock';
import { ThemeService } from '../../../../shared/theme-support/theme.service';
import { FileSizePipe } from '../../../../shared/utils/file-size-pipe';
import { VarDirective } from '../../../../shared/utils/var.directive';
import { ExtendedFileSectionComponent } from './extended-file-section.component';

describe('ExtendedFileSectionComponent', () => {
  let component: ExtendedFileSectionComponent;
  let fixture: ComponentFixture<ExtendedFileSectionComponent>;
  let localeService: any;
  const languageList = ['en;q=1', 'de;q=0.8'];
  const mockLocaleService = jasmine.createSpyObj('LocaleService', {
    getCurrentLanguageCode: jasmine.createSpy('getCurrentLanguageCode'),
    getLanguageCodeList: of(languageList),
  });

  const paginationServiceStub = new PaginationServiceStub();

  const mockItem = Object.assign(new Item(), {
    id: 'test-item-id',
    uuid: 'test-item-id',
    _links: {
      self: { href: 'test-item-selflink' },
    },
  });

  const mockBitstream = Object.assign(new Bitstream(), {
    id: 'test-bitstream-id',
    uuid: 'test-bitstream-id',
    name: 'test-bitstream.pdf',
    sizeBytes: 1024,
    _links: {
      self: { href: 'test-bitstream-selflink' },
    },
  });

  const mockBitstreamFormat = Object.assign(new BitstreamFormat(), {
    resourceType: 'testResourceType',
    shortDescription: 'testShortDescription',
    description: 'testDescription',
    mimetype: 'test/mimeType',
  });

  const paginatedList = createPaginatedList([mockBitstream]);

  paginatedList.pageInfo.elementsPerPage = environment.item.bitstream.pageSize;

  const bitstreamDataService = jasmine.createSpyObj('bitstreamDataService', {
    findAllByItemAndBundleName: createSuccessfulRemoteDataObject$(paginatedList),
  });

  const bitstreamFormatDataService = jasmine.createSpyObj('bitstreamFormatDataService', {
    findByBitstream: createSuccessfulRemoteDataObject$(mockBitstreamFormat),
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
        ExtendedFileSectionComponent,
        VarDirective,
        FileSizePipe,
      ],
      providers: [
        provideMockStore(),
        { provide: XSRFService, useValue: {} },
        { provide: BitstreamDataService, useValue: bitstreamDataService },
        { provide: NotificationsService, useValue: new NotificationsServiceStub() },
        { provide: BitstreamFormatDataService, useValue: bitstreamFormatDataService },
        { provide: ThemeService, useValue: getMockThemeService() },
        { provide: SearchConfigurationService, useValue: jasmine.createSpyObj(['getCurrentConfiguration']) },
        { provide: PaginationService, useValue: paginationServiceStub },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
        { provide: LocaleService, useValue: mockLocaleService },
        { provide: APP_CONFIG, useValue: environment },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).overrideComponent(ExtendedFileSectionComponent, {
      remove: {
        imports: [
          PaginationComponent,
          ThemedFileDownloadLinkComponent,
        ],
      },
    }).compileComponents();
  }));

  beforeEach(waitForAsync(() => {
    localeService = TestBed.inject(LocaleService);
    localeService.getCurrentLanguageCode.and.returnValue(of('en'));
    fixture = TestBed.createComponent(ExtendedFileSectionComponent);
    component = fixture.componentInstance;
    component.item = mockItem;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set pageSize from appConfig', () => {
    expect(component.pageSize).toEqual(environment.item.bitstream.pageSize);
  });

  describe('when the extended file section gets loaded with bitstreams available', () => {
    it('should contain a list with bitstream', () => {
      const fileSection = fixture.debugElement.queryAll(By.css('.file-section-entry'));
      expect(fileSection.length).toEqual(1);
    });
  });
});
