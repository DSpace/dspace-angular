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
import { isNotEmpty } from '@dspace/shared/utils';
import { Store } from '@ngrx/store';
import {
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { BrowseDefinitionDataService } from '@dspace/core';
import { RemoteDataBuildService } from '@dspace/core';
import { ObjectCacheService } from '@dspace/core';
import {
  APP_CONFIG,
  APP_DATA_SERVICES_MAP,
} from '@dspace/core';
import { BitstreamDataService } from '@dspace/core';
import { CommunityDataService } from '@dspace/core';
import { DefaultChangeAnalyzer } from '@dspace/core';
import { DSOChangeAnalyzer } from '@dspace/core';
import { ItemDataService } from '@dspace/core';
import { buildPaginatedList } from '@dspace/core';
import { RelationshipDataService } from '@dspace/core';
import { RemoteData } from '@dspace/core';
import { VersionDataService } from '@dspace/core';
import { VersionHistoryDataService } from '@dspace/core';
import { TranslateLoaderMock } from '@dspace/core';
import { NotificationsService } from '@dspace/core';
import { RouteService } from '@dspace/core';
import { Bitstream } from '@dspace/core';
import { HALEndpointService } from '@dspace/core';
import { Item } from '@dspace/core';
import { PageInfo } from '@dspace/core';
import { SearchService } from '@dspace/core';
import { UUIDService } from '@dspace/core';
import { WorkspaceitemDataService } from '@dspace/core';
import { createSuccessfulRemoteDataObject$ } from '@dspace/core';
import { BrowseDefinitionDataServiceStub } from '@dspace/core';
import { MetadataValuesComponent } from '../../../../item-page/field-components/metadata-values/metadata-values.component';
import { GenericItemPageFieldComponent } from '../../../../item-page/simple/field-components/specific-field/generic/generic-item-page-field.component';
import { ThemedItemPageTitleFieldComponent } from '../../../../item-page/simple/field-components/specific-field/title/themed-item-page-field.component';
import { mockRouteService } from '../../../../item-page/simple/item-types/shared/item.component.spec';
import { ThemedMetadataRepresentationListComponent } from '../../../../item-page/simple/metadata-representation-list/themed-metadata-representation-list.component';
import { TabbedRelatedEntitiesSearchComponent } from '../../../../item-page/simple/related-entities/tabbed-related-entities-search/tabbed-related-entities-search.component';
import { RelatedItemsComponent } from '../../../../item-page/simple/related-items/related-items-component';
import { DsoEditMenuComponent } from '../../../../shared/dso-page/dso-edit-menu/dso-edit-menu.component';
import { MetadataFieldWrapperComponent } from '../../../../shared/metadata-field-wrapper/metadata-field-wrapper.component';
import { mockTruncatableService } from '../../../../shared/mocks/mock-trucatable.service';
import { ThemedResultsBackButtonComponent } from '../../../../shared/results-back-button/themed-results-back-button.component';
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
        { provide: APP_CONFIG, useValue: {} },
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
