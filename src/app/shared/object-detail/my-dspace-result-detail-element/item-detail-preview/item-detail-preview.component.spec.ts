import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { APP_CONFIG } from '@dspace/config';
import {
  AuthService,
  RemoteDataBuildService,
  ObjectCacheService,
  BitstreamDataService,
  CommunityDataService,
  DefaultChangeAnalyzer,
  DSOChangeAnalyzer,
  FindListOptions,
  PaginatedList,
  RemoteData,
  NotificationsService,
  Bitstream,
  FileService,
  FollowLinkConfig,
  HALEndpointService,
  Item,
  UUIDService,
  AuthServiceMock,
  HALEndpointServiceStub,
  SearchServiceStub,
  TranslateLoaderMock,
  createPaginatedList,
  createSuccessfulRemoteDataObject$,
  XSRFService,
} from '@dspace/core'
import { Store } from '@ngrx/store';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { SearchService } from '../../../search/search.service';
import { getMockThemeService } from '../../../theme-support/test/theme-service.mock';
import { ThemeService } from '../../../theme-support/theme.service';
import { FileSizePipe } from '../../../utils/file-size-pipe';
import { TruncatePipe } from '../../../utils/truncate.pipe';
import { VarDirective } from '../../../utils/var.directive';
import { ItemDetailPreviewComponent } from './item-detail-preview.component';
import {
  ItemDetailPreviewFieldComponent,
} from './item-detail-preview-field/item-detail-preview-field.component';

function getMockFileService(): FileService {
  return jasmine.createSpyObj('FileService', {
    downloadFile: jasmine.createSpy('downloadFile'),
    getFileNameFromResponseContentDisposition: jasmine.createSpy('getFileNameFromResponseContentDisposition'),
  });
}

let component: ItemDetailPreviewComponent;
let fixture: ComponentFixture<ItemDetailPreviewComponent>;

const mockItem: Item = Object.assign(new Item(), {
  bundles: createSuccessfulRemoteDataObject$(createPaginatedList([])),
  metadata: {
    'dc.contributor.author': [
      {
        language: 'en_US',
        value: 'Smith, Donald',
      },
    ],
    'dc.date.issued': [
      {
        language: null,
        value: '2015-06-26',
      },
    ],
    'dc.title': [
      {
        language: 'en_US',
        value: 'This is just another title',
      },
    ],
    'dc.type': [
      {
        language: null,
        value: 'Article',
      },
    ],
  },
});

describe('ItemDetailPreviewComponent', () => {
  const mockBitstreamDataService = {
    getThumbnailFor(item: Item): Observable<RemoteData<Bitstream>> {
      return createSuccessfulRemoteDataObject$(new Bitstream());
    },
    findAllByItemAndBundleName(item: Item, bundleName: string, options?: FindListOptions, ...linksToFollow: FollowLinkConfig<Bitstream>[]): Observable<RemoteData<PaginatedList<Bitstream>>> {
      return createSuccessfulRemoteDataObject$(createPaginatedList([]));
    },
  };
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock,
          },
        }),
        ItemDetailPreviewComponent, ItemDetailPreviewFieldComponent, TruncatePipe, FileSizePipe, VarDirective,
      ],
      providers: [
        { provide: FileService, useValue: getMockFileService() },
        { provide: HALEndpointService, useValue: new HALEndpointServiceStub('workspaceitems') },
        { provide: ObjectCacheService, useValue: {} },
        { provide: UUIDService, useValue: {} },
        { provide: XSRFService, useValue: {} },
        { provide: Store, useValue: {} },
        { provide: RemoteDataBuildService, useValue: {} },
        { provide: CommunityDataService, useValue: {} },
        { provide: HALEndpointService, useValue: {} },
        { provide: NotificationsService, useValue: {} },
        { provide: HttpClient, useValue: {} },
        { provide: DSOChangeAnalyzer, useValue: {} },
        { provide: DefaultChangeAnalyzer, useValue: {} },
        { provide: BitstreamDataService, useValue: mockBitstreamDataService },
        { provide: ThemeService, useValue: getMockThemeService() },
        { provide: AuthService, useValue: new AuthServiceMock() },
        { provide: SearchService, useValue: new SearchServiceStub() },
        { provide: APP_CONFIG, useValue: { cache: { msToLive: { default: 15 * 60 * 1000 } } } },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).overrideComponent(ItemDetailPreviewComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default },
    }).compileComponents();
  }));

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(ItemDetailPreviewComponent);
    component = fixture.componentInstance;
    component.object = { hitHighlights: {} } as any;
    component.item = mockItem;
    component.separator = ', ';
    // spyOn(component.item, 'getFiles').and.returnValue(mockItem.bundles as any);
    fixture.detectChanges();

  }));

  it('should get item bitstreams', (done) => {
    component.getFiles().subscribe((bitstreams) => {
      expect(bitstreams).toBeDefined();
      done();
    });
  });
});
