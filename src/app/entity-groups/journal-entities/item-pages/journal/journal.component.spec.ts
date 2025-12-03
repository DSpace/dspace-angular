import { HttpClient } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  DebugElement,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_CONFIG } from '@dspace/config/app-config.interface';
import { BrowseDefinitionDataService } from '@dspace/core/browse/browse-definition-data.service';
import { RemoteDataBuildService } from '@dspace/core/cache/builders/remote-data-build.service';
import { ObjectCacheService } from '@dspace/core/cache/object-cache.service';
import { BitstreamDataService } from '@dspace/core/data/bitstream-data.service';
import { CommunityDataService } from '@dspace/core/data/community-data.service';
import { DefaultChangeAnalyzer } from '@dspace/core/data/default-change-analyzer.service';
import { DSOChangeAnalyzer } from '@dspace/core/data/dso-change-analyzer.service';
import { ItemDataService } from '@dspace/core/data/item-data.service';
import { buildPaginatedList } from '@dspace/core/data/paginated-list.model';
import { RelationshipDataService } from '@dspace/core/data/relationship-data.service';
import { RemoteData } from '@dspace/core/data/remote-data';
import { VersionDataService } from '@dspace/core/data/version-data.service';
import { VersionHistoryDataService } from '@dspace/core/data/version-history-data.service';
import { APP_DATA_SERVICES_MAP } from '@dspace/core/data-services-map-type';
import { NotificationsService } from '@dspace/core/notification-system/notifications.service';
import { RouteService } from '@dspace/core/services/route.service';
import { Bitstream } from '@dspace/core/shared/bitstream.model';
import { HALEndpointService } from '@dspace/core/shared/hal-endpoint.service';
import { Item } from '@dspace/core/shared/item.model';
import { PageInfo } from '@dspace/core/shared/page-info.model';
import { UUIDService } from '@dspace/core/shared/uuid.service';
import { WorkspaceitemDataService } from '@dspace/core/submission/workspaceitem-data.service';
import { BrowseDefinitionDataServiceStub } from '@dspace/core/testing/browse-definition-data-service.stub';
import { mockTruncatableService } from '@dspace/core/testing/mock-trucatable.service';
import { TranslateLoaderMock } from '@dspace/core/testing/translate-loader.mock';
import { createSuccessfulRemoteDataObject$ } from '@dspace/core/utilities/remote-data.utils';
import { isNotEmpty } from '@dspace/shared/utils/empty.util';
import { Store } from '@ngrx/store';
import {
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { MetadataValuesComponent } from '../../../../item-page/field-components/metadata-values/metadata-values.component';
import { GenericItemPageFieldComponent } from '../../../../item-page/simple/field-components/specific-field/generic/generic-item-page-field.component';
import { ThemedItemPageTitleFieldComponent } from '../../../../item-page/simple/field-components/specific-field/title/themed-item-page-field.component';
import { mockRouteService } from '../../../../item-page/simple/item-types/shared/item.component.spec';
import { ThemedMetadataRepresentationListComponent } from '../../../../item-page/simple/metadata-representation-list/themed-metadata-representation-list.component';
import { TabbedRelatedEntitiesSearchComponent } from '../../../../item-page/simple/related-entities/tabbed-related-entities-search/tabbed-related-entities-search.component';
import { RelatedItemsComponent } from '../../../../item-page/simple/related-items/related-items-component';
import { DsoEditMenuComponent } from '../../../../shared/dso-page/dso-edit-menu/dso-edit-menu.component';
import { MetadataFieldWrapperComponent } from '../../../../shared/metadata-field-wrapper/metadata-field-wrapper.component';
import { ThemedResultsBackButtonComponent } from '../../../../shared/results-back-button/themed-results-back-button.component';
import { SearchService } from '../../../../shared/search/search.service';
import { TruncatableService } from '../../../../shared/truncatable/truncatable.service';
import { TruncatePipe } from '../../../../shared/utils/truncate.pipe';
import { ThemedThumbnailComponent } from '../../../../thumbnail/themed-thumbnail.component';
import { JournalComponent } from './journal.component';

let comp: JournalComponent;
let fixture: ComponentFixture<JournalComponent>;

const mockItem: Item = Object.assign(new Item(), {
  bundles: createSuccessfulRemoteDataObject$(buildPaginatedList(new PageInfo(), [])),
  metadata: {
    'creativeworkseries.issn': [
      {
        language: 'en_US',
        value: '1234',
      },
    ],
    'creativework.publisher': [
      {
        language: 'en_US',
        value: 'a publisher',
      },
    ],
    'dc.description': [
      {
        language: 'en_US',
        value: 'desc',
      },
    ],
  },
});

describe('JournalComponent', () => {
  const mockBitstreamDataService = {
    getThumbnailFor(item: Item): Observable<RemoteData<Bitstream>> {
      return createSuccessfulRemoteDataObject$(new Bitstream());
    },
  };
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock,
          },
        }),
        RouterTestingModule,
        GenericItemPageFieldComponent, TruncatePipe,
        JournalComponent,
      ],
      providers: [
        { provide: ItemDataService, useValue: {} },
        { provide: TruncatableService, useValue: mockTruncatableService },
        { provide: RelationshipDataService, useValue: {} },
        { provide: ObjectCacheService, useValue: {} },
        { provide: UUIDService, useValue: {} },
        { provide: Store, useValue: {} },
        { provide: RemoteDataBuildService, useValue: {} },
        { provide: CommunityDataService, useValue: {} },
        { provide: HALEndpointService, useValue: {} },
        { provide: HttpClient, useValue: {} },
        { provide: DSOChangeAnalyzer, useValue: {} },
        { provide: NotificationsService, useValue: {} },
        { provide: DefaultChangeAnalyzer, useValue: {} },
        { provide: VersionHistoryDataService, useValue: {} },
        { provide: VersionDataService, useValue: {} },
        { provide: BitstreamDataService, useValue: mockBitstreamDataService },
        { provide: WorkspaceitemDataService, useValue: {} },
        { provide: SearchService, useValue: {} },
        { provide: RouteService, useValue: mockRouteService },
        { provide: BrowseDefinitionDataService, useValue: BrowseDefinitionDataServiceStub },
        { provide: APP_CONFIG, useValue: { cache: { msToLive: { default: 15 * 60 * 1000 } } } },
        { provide: APP_DATA_SERVICES_MAP, useValue: {} },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).overrideComponent(JournalComponent, {
      remove: {
        imports: [
          ThemedResultsBackButtonComponent,
          ThemedItemPageTitleFieldComponent,
          DsoEditMenuComponent,
          MetadataFieldWrapperComponent,
          ThemedThumbnailComponent,
          RelatedItemsComponent,
          TabbedRelatedEntitiesSearchComponent,
          ThemedMetadataRepresentationListComponent,
        ],
      },
      add: { changeDetection: ChangeDetectionStrategy.Default },
    })
      .overrideComponent(GenericItemPageFieldComponent, {
        remove: { imports: [MetadataValuesComponent] },
      })
      .compileComponents();
  }));

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(JournalComponent);
    comp = fixture.componentInstance;
    comp.object = mockItem;
    fixture.detectChanges();
  }));

  for (const key of Object.keys(mockItem.metadata)) {
    it(`should be calling a component with metadata field ${key}`, () => {
      const fields = fixture.debugElement.queryAll(By.css('.item-page-fields'));
      expect(containsFieldInput(fields, key)).toBeTruthy();
    });
  }
});

function containsFieldInput(fields: DebugElement[], metadataKey: string): boolean {
  for (const field of fields) {
    const fieldComp = field.componentInstance;
    if (isNotEmpty(fieldComp.fields)) {
      if (fieldComp.fields.indexOf(metadataKey) > -1) {
        return true;
      }
    }
  }
  return false;
}
