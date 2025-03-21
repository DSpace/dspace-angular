import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { provideMockStore } from '@ngrx/store/testing';
import {
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';
import { of as observableOf } from 'rxjs';
import { environment } from 'src/environments/environment';

import {
  APP_CONFIG,
  APP_DATA_SERVICES_MAP,
} from '../../../../../config/app-config.interface';
import { BitstreamDataService } from '../../../../core/data/bitstream-data.service';
import { Bitstream } from '../../../../core/shared/bitstream.model';
import { PageInfo } from '../../../../core/shared/page-info.model';
import { XSRFService } from '../../../../core/xsrf/xsrf.service';
import { MetadataFieldWrapperComponent } from '../../../../shared/metadata-field-wrapper/metadata-field-wrapper.component';
import { MockBitstreamFormat1 } from '../../../../shared/mocks/item.mock';
import { getMockThemeService } from '../../../../shared/mocks/theme-service.mock';
import { TranslateLoaderMock } from '../../../../shared/mocks/translate-loader.mock';
import { NotificationsService } from '../../../../shared/notifications/notifications.service';
import { createSuccessfulRemoteDataObject$ } from '../../../../shared/remote-data.utils';
import { ActivatedRouteStub } from '../../../../shared/testing/active-router.stub';
import { NotificationsServiceStub } from '../../../../shared/testing/notifications-service.stub';
import { createPaginatedList } from '../../../../shared/testing/utils.test';
import { ThemeService } from '../../../../shared/theme-support/theme.service';
import { FileSizePipe } from '../../../../shared/utils/file-size-pipe';
import { VarDirective } from '../../../../shared/utils/var.directive';
import { FileSectionComponent } from './file-section.component';

describe('FileSectionComponent', () => {
  let comp: FileSectionComponent;
  let fixture: ComponentFixture<FileSectionComponent>;

  const bitstreamDataService = jasmine.createSpyObj('bitstreamDataService', {
    findAllByItemAndBundleName: createSuccessfulRemoteDataObject$(createPaginatedList([])),
    findPrimaryBitstreamByItemAndName: observableOf(null),
  });

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

  beforeEach(waitForAsync(() => {

    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useClass: TranslateLoaderMock,
        },
      }), BrowserAnimationsModule, FileSectionComponent, VarDirective, FileSizePipe],
      providers: [
        { provide: APP_DATA_SERVICES_MAP, useValue: {} },
        { provide: XSRFService, useValue: {} },
        { provide: BitstreamDataService, useValue: bitstreamDataService },
        { provide: NotificationsService, useValue: new NotificationsServiceStub() },
        { provide: APP_CONFIG, useValue: environment },
        { provide: ThemeService, useValue: getMockThemeService() },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
        provideMockStore(),
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideComponent(FileSectionComponent, {
        remove: {
          imports: [
            MetadataFieldWrapperComponent,
          ],
        },
      })
      .compileComponents();
  }));

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(FileSectionComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should set the id of primary bitstream', () => {
    comp.primaryBitsreamId = undefined;
    bitstreamDataService.findPrimaryBitstreamByItemAndName.and.returnValue(observableOf(mockBitstream));
    comp.ngOnInit();
    expect(comp.primaryBitsreamId).toBe(mockBitstream.id);
  });

  it('should not set the id of primary bitstream', () => {
    comp.primaryBitsreamId = undefined;
    bitstreamDataService.findPrimaryBitstreamByItemAndName.and.returnValue(observableOf(null));
    comp.ngOnInit();
    expect(comp.primaryBitsreamId).toBeUndefined();
  });

  describe('when the bitstreams are loading', () => {
    beforeEach(() => {
      comp.bitstreams$.next([mockBitstream]);
      comp.isLoading = true;
      fixture.detectChanges();
    });

    it('should display a loading component', () => {
      const loading = fixture.debugElement.query(By.css('ds-loading'));
      expect(loading.nativeElement).toBeDefined();
    });
  });

  describe('when the "Show more" button is clicked', () => {

    beforeEach(() => {
      comp.bitstreams$.next([mockBitstream]);
      comp.currentPage = 1;
      comp.isLastPage = false;
      fixture.detectChanges();
    });

    it('should call the service to retrieve more bitstreams', () => {
      const viewMore = fixture.debugElement.query(By.css('.bitstream-view-more'));
      viewMore.triggerEventHandler('click', null);
      expect(bitstreamDataService.findAllByItemAndBundleName).toHaveBeenCalled();
    });

    it('one bitstream should be on the page', () => {
      const viewMore = fixture.debugElement.query(By.css('.bitstream-view-more'));
      viewMore.triggerEventHandler('click', null);
      const fileDownloadLink = fixture.debugElement.queryAll(By.css('ds-file-download-link'));
      expect(fileDownloadLink.length).toEqual(1);
    });

    describe('when it is then clicked again', () => {
      beforeEach(() => {
        bitstreamDataService.findAllByItemAndBundleName.and.returnValue(createSuccessfulRemoteDataObject$(createPaginatedList([mockBitstream])));
        const viewMore = fixture.debugElement.query(By.css('.bitstream-view-more'));
        viewMore.triggerEventHandler('click', null);
        fixture.detectChanges();

      });
      it('should contain another bitstream', () => {
        const fileDownloadLink = fixture.debugElement.queryAll(By.css('ds-file-download-link'));
        expect(fileDownloadLink.length).toEqual(2);
      });
    });
  });

  describe('when its the last page of bitstreams', () => {
    beforeEach(() => {
      comp.bitstreams$.next([mockBitstream]);
      comp.isLastPage = true;
      comp.currentPage = 2;
      fixture.detectChanges();
    });

    it('should not contain a view more link', () => {
      const viewMore = fixture.debugElement.query(By.css('.bitstream-view-more'));
      expect(viewMore).toBeNull();
    });

    it('should contain a view less link', () => {
      const viewLess = fixture.debugElement.query(By.css('.bitstream-collapse'));
      expect(viewLess).not.toBeNull();
    });

    it('clicking on the view less link should reset the pages and call getNextPage()', () => {
      const pageInfo = Object.assign(new PageInfo(), {
        elementsPerPage: 3,
        totalElements: 5,
        totalPages: 2,
        currentPage: 1,
        _links: {
          self: { href: 'https://rest.api/core/bitstreams/' },
          next: { href: 'https://rest.api/core/bitstreams?page=2' },
        },
      });
      const PaginatedList = Object.assign(createPaginatedList([mockBitstream]), {
        pageInfo: pageInfo,
      });
      bitstreamDataService.findAllByItemAndBundleName.and.returnValue(createSuccessfulRemoteDataObject$(PaginatedList));
      const viewLess = fixture.debugElement.query(By.css('.bitstream-collapse'));
      viewLess.triggerEventHandler('click', null);
      expect(bitstreamDataService.findAllByItemAndBundleName).toHaveBeenCalled();
      expect(comp.currentPage).toBe(1);
      expect(comp.isLastPage).toBeFalse();
    });

  });
});
