import { HttpClient } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Store } from '@ngrx/store';
import {
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { AuthService } from '../../../../core/auth/auth.service';
import { RemoteDataBuildService } from '../../../../core/cache/builders/remote-data-build.service';
import { ObjectCacheService } from '../../../../core/cache/object-cache.service';
import { BitstreamDataService } from '../../../../core/data/bitstream-data.service';
import { CommunityDataService } from '../../../../core/data/community-data.service';
import { DefaultChangeAnalyzer } from '../../../../core/data/default-change-analyzer.service';
import { DSOChangeAnalyzer } from '../../../../core/data/dso-change-analyzer.service';
import { FindListOptions } from '../../../../core/data/find-list-options.model';
import { PaginatedList } from '../../../../core/data/paginated-list.model';
import { RemoteData } from '../../../../core/data/remote-data';
import { Bitstream } from '../../../../core/shared/bitstream.model';
import { FileService } from '../../../../core/shared/file.service';
import { HALEndpointService } from '../../../../core/shared/hal-endpoint.service';
import { Item } from '../../../../core/shared/item.model';
import { SearchService } from '../../../../core/shared/search/search.service';
import { UUIDService } from '../../../../core/shared/uuid.service';
import { AuthServiceMock } from '../../../../shared/mocks/auth.service.mock';
import { getMockThemeService } from '../../../../shared/mocks/theme-service.mock';
import { SearchServiceStub } from '../../../../shared/testing/search-service.stub';
import { ThemeService } from '../../../../shared/theme-support/theme.service';
import { TranslateLoaderMock } from '../../../mocks/translate-loader.mock';
import { NotificationsService } from '../../../notifications/notifications.service';
import { createSuccessfulRemoteDataObject$ } from '../../../remote-data.utils';
import { HALEndpointServiceStub } from '../../../testing/hal-endpoint-service.stub';
import { createPaginatedList } from '../../../testing/utils.test';
import { FileSizePipe } from '../../../utils/file-size-pipe';
import { FollowLinkConfig } from '../../../utils/follow-link-config.model';
import { TruncatePipe } from '../../../utils/truncate.pipe';
import { VarDirective } from '../../../utils/var.directive';
import { ItemDetailPreviewComponent } from './item-detail-preview.component';
import { ItemDetailPreviewFieldComponent } from './item-detail-preview-field/item-detail-preview-field.component';

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
