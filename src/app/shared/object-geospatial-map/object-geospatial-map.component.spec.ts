import {
  ChangeDetectionStrategy,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import { StoreModule } from '@ngrx/store';
import {
  TranslateLoader,
  TranslateModule,
  TranslateService,
  TranslateStore,
} from '@ngx-translate/core';

import { buildPaginatedList } from '../../core/data/paginated-list.model';
import { Item } from '../../core/shared/item.model';
import { PageInfo } from '../../core/shared/page-info.model';
import { GeospatialMapDetail } from '../geospatial-map/models/geospatial-map-detail.model';
import { TranslateLoaderMock } from '../mocks/translate-loader.mock';
import { ItemSearchResult } from '../object-collection/shared/item-search-result.model';
import { PaginationComponent } from '../pagination/pagination.component';
import { createSuccessfulRemoteDataObject$ } from '../remote-data.utils';
import { ObjectGeospatialMapComponent } from './object-geospatial-map.component';

describe('ObjectGeospatialMapComponent', () => {

  // Expected geospatial map info parsed in component from search results
  const expected = new GeospatialMapDetail();
  expected.points = [{ longitude: 104, latitude: -12, url: '/items', title: 'Test item title' }];
  expected.title = 'Test item title';
  expected.route = '/items';

  // Mock search results
  const mockItemWithMetadata: ItemSearchResult = new ItemSearchResult();
  mockItemWithMetadata.hitHighlights = {};
  mockItemWithMetadata.indexableObject = Object.assign(new Item(), {
    bundles: createSuccessfulRemoteDataObject$(buildPaginatedList(new PageInfo(), [])),
    metadata: {
      'dc.title': [
        {
          language: 'en_US',
          value: 'Test item title',
        },
      ],
      'dcterms.spatial': [
        {
          language: null,
          value: 'Point ( +104.000000 -012.000000 )',
        },
      ],
    },
  });
  const testObjects = [mockItemWithMetadata];
  const mockRD = {
    payload: {
      page: testObjects,
    },
  } as any;

  let component: ObjectGeospatialMapComponent;
  let fixture: ComponentFixture<ObjectGeospatialMapComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ObjectGeospatialMapComponent, StoreModule.forRoot(), TranslateModule.forRoot({
        loader: {
          useClass: TranslateLoaderMock,
          provide: TranslateLoader,
        },
      })],
      providers: [TranslateService, TranslateStore, TranslateLoader, TranslateLoaderMock],
      schemas: [NO_ERRORS_SCHEMA],
    }).overrideComponent(ObjectGeospatialMapComponent, {
      remove: {
        imports: [PaginationComponent],
      },
      add: { changeDetection: ChangeDetectionStrategy.Default },
    }).compileComponents();
  });

  it('component is created successfully', () => {
    component.objects = mockRD;
    expect(component).toBeTruthy();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ObjectGeospatialMapComponent);
    component = fixture.componentInstance; // SearchPageComponent test instance
    component.objects = mockRD;
    fixture.detectChanges();
  });

  it('component parses search results into a map info array for map drawing', () => {
    expect(component.mapInfo).toEqual([expected]);
  });

});
