import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { APP_CONFIG } from '@dspace/config/app-config.interface';
import { BitstreamDataService } from '@dspace/core/data/bitstream-data.service';
import { APP_DATA_SERVICES_MAP } from '@dspace/core/data-services-map-type';
import { LocaleService } from '@dspace/core/locale/locale.service';
import { NotificationsService } from '@dspace/core/notification-system/notifications.service';
import { Bitstream } from '@dspace/core/shared/bitstream.model';
import { ActivatedRouteStub } from '@dspace/core/testing/active-router.stub';
import { MockBitstreamFormat1 } from '@dspace/core/testing/item.mock';
import { NotificationsServiceStub } from '@dspace/core/testing/notifications-service.stub';
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
import { environment } from 'src/environments/environment';

import { MetadataFieldWrapperComponent } from '../../metadata-field-wrapper/metadata-field-wrapper.component';
import { getMockThemeService } from '../../theme-support/test/theme-service.mock';
import { ThemeService } from '../../theme-support/theme.service';
import { FileSizePipe } from '../../utils/file-size-pipe';
import { VarDirective } from '../../utils/var.directive';
import { BitstreamAttachmentComponent } from '../bitstream-attachment.component';
import { AttachmentSectionComponent } from './attachment-section.component';

describe('AttachmentSectionComponent', () => {
  let comp: AttachmentSectionComponent;
  let fixture: ComponentFixture<AttachmentSectionComponent>;
  let localeService: any;
  const languageList = ['en;q=1', 'de;q=0.8'];
  const mockLocaleService = jasmine.createSpyObj('LocaleService', {
    getCurrentLanguageCode: jasmine.createSpy('getCurrentLanguageCode'),
    getLanguageCodeList: of(languageList),
  });

  const bitstreamDataService = jasmine.createSpyObj('bitstreamDataService', {
    findAllByItemAndBundleName: createSuccessfulRemoteDataObject$(createPaginatedList([])),
    findPrimaryBitstreamByItemAndName: of(null),
  });

  const mockBitstream: Bitstream = Object.assign(new Bitstream(),
    {
      sizeBytes: 10201,
      content: 'https://dspace7.4science.it/dspace-spring-rest/api/core/bitstreams/cf9b0c8e-a1eb-4b65-afd0-567366448713/content',
      format: of(MockBitstreamFormat1),
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

  beforeEach(waitForAsync(() => {

    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useClass: TranslateLoaderMock,
        },
      }), BrowserAnimationsModule, AttachmentSectionComponent, VarDirective, FileSizePipe],
      providers: [
        { provide: APP_DATA_SERVICES_MAP, useValue: {} },
        { provide: XSRFService, useValue: {} },
        { provide: BitstreamDataService, useValue: bitstreamDataService },
        { provide: NotificationsService, useValue: new NotificationsServiceStub() },
        { provide: APP_CONFIG, useValue: environment },
        { provide: ThemeService, useValue: getMockThemeService() },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
        { provide: LocaleService, useValue: mockLocaleService },
        provideMockStore(),
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideComponent(AttachmentSectionComponent, {
        remove: {
          imports: [
            MetadataFieldWrapperComponent,
            BitstreamAttachmentComponent,
          ],
        },
      })
      .compileComponents();
  }));

  beforeEach(waitForAsync(() => {
    localeService = TestBed.inject(LocaleService);
    localeService.getCurrentLanguageCode.and.returnValue(of('en'));
    fixture = TestBed.createComponent(AttachmentSectionComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(comp).toBeTruthy();
  });

  it('should set the id of primary bitstream', () => {
    comp.primaryBitstreamId = undefined;
    bitstreamDataService.findPrimaryBitstreamByItemAndName.and.returnValue(of(mockBitstream));
    comp.ngOnInit();
    expect(comp.primaryBitstreamId).toBe(mockBitstream.id);
  });

  it('should not set the id of primary bitstream', () => {
    comp.primaryBitstreamId = undefined;
    bitstreamDataService.findPrimaryBitstreamByItemAndName.and.returnValue(of(null));
    comp.ngOnInit();
    expect(comp.primaryBitstreamId).toBeUndefined();
  });

});
