import { AsyncPipe } from '@angular/common';
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
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import {
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';
import {
  Observable,
  of as observableOf,
} from 'rxjs';

import { APP_CONFIG } from '../../../../../config/app-config.interface';
import { AuthService } from '../../../../core/auth/auth.service';
import { BrowseDefinitionDataService } from '../../../../core/browse/browse-definition-data.service';
import { RemoteDataBuildService } from '../../../../core/cache/builders/remote-data-build.service';
import { ObjectCacheService } from '../../../../core/cache/object-cache.service';
import { BitstreamDataService } from '../../../../core/data/bitstream-data.service';
import { CommunityDataService } from '../../../../core/data/community-data.service';
import { DefaultChangeAnalyzer } from '../../../../core/data/default-change-analyzer.service';
import { DSOChangeAnalyzer } from '../../../../core/data/dso-change-analyzer.service';
import { AuthorizationDataService } from '../../../../core/data/feature-authorization/authorization-data.service';
import { ItemDataService } from '../../../../core/data/item-data.service';
import { buildPaginatedList } from '../../../../core/data/paginated-list.model';
import { RelationshipDataService } from '../../../../core/data/relationship-data.service';
import { RemoteData } from '../../../../core/data/remote-data';
import { VersionDataService } from '../../../../core/data/version-data.service';
import { VersionHistoryDataService } from '../../../../core/data/version-history-data.service';
import { ResearcherProfileDataService } from '../../../../core/profile/researcher-profile-data.service';
import { RouteService } from '../../../../core/services/route.service';
import { Bitstream } from '../../../../core/shared/bitstream.model';
import { HALEndpointService } from '../../../../core/shared/hal-endpoint.service';
import { Item } from '../../../../core/shared/item.model';
import { Relationship } from '../../../../core/shared/item-relationships/relationship.model';
import { RelationshipType } from '../../../../core/shared/item-relationships/relationship-type.model';
import { MetadataValue } from '../../../../core/shared/metadata.models';
import { PageInfo } from '../../../../core/shared/page-info.model';
import { SearchService } from '../../../../core/shared/search/search.service';
import { UUIDService } from '../../../../core/shared/uuid.service';
import { WorkspaceitemDataService } from '../../../../core/submission/workspaceitem-data.service';
import { DsoEditMenuComponent } from '../../../../shared/dso-page/dso-edit-menu/dso-edit-menu.component';
import { isNotEmpty } from '../../../../shared/empty.util';
import { MetadataFieldWrapperComponent } from '../../../../shared/metadata-field-wrapper/metadata-field-wrapper.component';
import { mockTruncatableService } from '../../../../shared/mocks/mock-trucatable.service';
import { TranslateLoaderMock } from '../../../../shared/mocks/translate-loader.mock';
import { NotificationsService } from '../../../../shared/notifications/notifications.service';
import { createSuccessfulRemoteDataObject$ } from '../../../../shared/remote-data.utils';
import { ThemedResultsBackButtonComponent } from '../../../../shared/results-back-button/themed-results-back-button.component';
import { AuthServiceStub } from '../../../../shared/testing/auth-service.stub';
import { BrowseDefinitionDataServiceStub } from '../../../../shared/testing/browse-definition-data-service.stub';
import { routeServiceStub } from '../../../../shared/testing/route-service.stub';
import { createPaginatedList } from '../../../../shared/testing/utils.test';
import { TruncatableService } from '../../../../shared/truncatable/truncatable.service';
import { TruncatePipe } from '../../../../shared/utils/truncate.pipe';
import { ThemedThumbnailComponent } from '../../../../thumbnail/themed-thumbnail.component';
import { GenericItemPageFieldComponent } from '../../field-components/specific-field/generic/generic-item-page-field.component';
import { ThemedItemPageTitleFieldComponent } from '../../field-components/specific-field/title/themed-item-page-field.component';
import { ThemedMetadataRepresentationListComponent } from '../../metadata-representation-list/themed-metadata-representation-list.component';
import { TabbedRelatedEntitiesSearchComponent } from '../../related-entities/tabbed-related-entities-search/tabbed-related-entities-search.component';
import { RelatedItemsComponent } from '../../related-items/related-items-component';
import { ItemComponent } from './item.component';
import {
  compareArraysUsing,
  compareArraysUsingIds,
} from './item-relationships-utils';

export function getIIIFSearchEnabled(enabled: boolean): MetadataValue {
  return Object.assign(new MetadataValue(), {
    'value': enabled,
    'language': null,
    'authority': null,
    'confidence': -1,
    'place': 0,
  });
}

export function getIIIFEnabled(enabled: boolean): MetadataValue {
  return Object.assign(new MetadataValue(), {
    'value': enabled,
    'language': null,
    'authority': null,
    'confidence': -1,
    'place': 0,
  });
}

export const mockRouteService = {
  getPreviousUrl(): Observable<string> {
    return observableOf('');
  },
  getQueryParameterValue(): Observable<string> {
    return observableOf('');
  },
  getRouteParameterValue(): Observable<string> {
    return observableOf('');
  },
};

/**
 * Create a generic test for an item-page-fields component using a mockItem and the type of component
 * @param {Item} mockItem     The item to use for testing. The item needs to contain just the metadata necessary to
 *                            execute the tests for it's component.
 * @param component           The type of component to create test cases for.
 * @returns {() => void}      Returns a specDefinition for the test.
 */
export function getItemPageFieldsTest(mockItem: Item, component) {
  return () => {
    let comp: any;
    let fixture: ComponentFixture<any>;
    let relationshipService: jasmine.SpyObj<RelationshipDataService>;

    beforeEach(waitForAsync(async () => {
      const mockBitstreamDataService = {
        getThumbnailFor(item: Item): Observable<RemoteData<Bitstream>> {
          return createSuccessfulRemoteDataObject$(new Bitstream());
        },
      };

      const authorizationService = jasmine.createSpyObj('authorizationService', {
        isAuthorized: observableOf(true),
      });

      relationshipService = jasmine.createSpyObj('relationshipService', {
        getRelatedItemsByLabel: createSuccessfulRemoteDataObject$(buildPaginatedList(new PageInfo(), [])),
      });

      await TestBed.configureTestingModule({
        imports: [
          TranslateModule.forRoot({
            loader: {
              provide: TranslateLoader,
              useClass: TranslateLoaderMock,
            },
          }),
          RouterTestingModule,
          GenericItemPageFieldComponent,
          TruncatePipe,
          AsyncPipe,
          component,
        ],
        providers: [
          {
            provide: APP_CONFIG,
            useValue: {
              browseBy: { showThumbnails: true },
              markdown: { enabled: true },
            },
          },
          provideMockStore(),
          { provide: ItemDataService, useValue: {} },
          { provide: TruncatableService, useValue: mockTruncatableService },
          { provide: RelationshipDataService, useValue: relationshipService },
          { provide: ObjectCacheService, useValue: {} },
          { provide: UUIDService, useValue: {} },
          { provide: RemoteDataBuildService, useValue: {} },
          { provide: CommunityDataService, useValue: {} },
          { provide: HALEndpointService, useValue: {} },
          { provide: HttpClient, useValue: {} },
          { provide: DSOChangeAnalyzer, useValue: {} },
          { provide: VersionHistoryDataService, useValue: {} },
          { provide: VersionDataService, useValue: {} },
          { provide: NotificationsService, useValue: {} },
          { provide: DefaultChangeAnalyzer, useValue: {} },
          { provide: BitstreamDataService, useValue: mockBitstreamDataService },
          { provide: WorkspaceitemDataService, useValue: {} },
          { provide: SearchService, useValue: {} },
          { provide: RouteService, useValue: routeServiceStub },
          { provide: AuthService, useValue: new AuthServiceStub() },
          { provide: AuthorizationDataService, useValue: authorizationService },
          { provide: ResearcherProfileDataService, useValue: {} },
          {
            provide: BrowseDefinitionDataService,
            useValue: BrowseDefinitionDataServiceStub,
          },
        ],
        schemas: [NO_ERRORS_SCHEMA],
      })
        .overrideComponent(component, {
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
        .compileComponents();
    }));
    beforeEach(waitForAsync(() => {
      fixture = TestBed.createComponent(component);
      comp = fixture.componentInstance;
      comp.object = mockItem;
      fixture.detectChanges();
    }));

    for (const key of Object.keys(mockItem.metadata)) {
      it(`should be calling a component with metadata field ${key}`, () => {
        const fields = fixture.debugElement.queryAll(By.css('ds-generic-item-page-field'));
        expect(containsFieldInput(fields, key)).toBeTruthy();
      });
    }
  };
}

/**
 * Checks whether in a list of debug elements, at least one of them contains a specific metadata key in their
 * fields property.
 * @param {DebugElement[]} fields   List of debug elements to check
 * @param {string} metadataKey      A metadata key to look for
 * @returns {boolean}
 */
export function containsFieldInput(fields: DebugElement[], metadataKey: string): boolean {
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

export function createRelationshipsObservable() {
  return createSuccessfulRemoteDataObject$(createPaginatedList([
    Object.assign(new Relationship(), {
      relationshipType: createSuccessfulRemoteDataObject$(new RelationshipType()),
      leftItem: createSuccessfulRemoteDataObject$(new Item()),
      rightItem: createSuccessfulRemoteDataObject$(new Item()),
    }),
  ]));
}

describe('ItemComponent', () => {
  const arr1 = [
    {
      id: 1,
      name: 'test',
    },
    {
      id: 2,
      name: 'another test',
    },
    {
      id: 3,
      name: 'one last test',
    },
  ];
  const arrWithWrongId = [
    {
      id: 1,
      name: 'test',
    },
    {
      id: 5,  // Wrong id on purpose
      name: 'another test',
    },
    {
      id: 3,
      name: 'one last test',
    },
  ];
  const arrWithWrongName = [
    {
      id: 1,
      name: 'test',
    },
    {
      id: 2,
      name: 'wrong test',  // Wrong name on purpose
    },
    {
      id: 3,
      name: 'one last test',
    },
  ];
  const arrWithDifferentOrder = [arr1[0], arr1[2], arr1[1]];
  const arrWithOneMore = [...arr1, {
    id: 4,
    name: 'fourth test',
  }];
  const arrWithAddedProperties = [
    {
      id: 1,
      name: 'test',
      extra: 'extra property',
    },
    {
      id: 2,
      name: 'another test',
      extra: 'extra property',
    },
    {
      id: 3,
      name: 'one last test',
      extra: 'extra property',
    },
  ];
  const arrOfPrimitiveTypes = [1, 2, 3, 4];
  const arrOfPrimitiveTypesWithOneWrong = [1, 5, 3, 4];
  const arrOfPrimitiveTypesWithDifferentOrder = [1, 3, 2, 4];
  const arrOfPrimitiveTypesWithOneMore = [1, 2, 3, 4, 5];

  describe('when calling compareArraysUsing', () => {

    describe('and comparing by id', () => {
      const compare = compareArraysUsing<any>((o) => o.id);

      it('should return true when comparing the same array', () => {
        expect(compare(arr1, arr1)).toBeTruthy();
      });

      it('should return true regardless of the order', () => {
        expect(compare(arr1, arrWithDifferentOrder)).toBeTruthy();
      });

      it('should return true regardless of other properties being different', () => {
        expect(compare(arr1, arrWithWrongName)).toBeTruthy();
      });

      it('should return true regardless of extra properties', () => {
        expect(compare(arr1, arrWithAddedProperties)).toBeTruthy();
      });

      it('should return false when the ids don\'t match', () => {
        expect(compare(arr1, arrWithWrongId)).toBeFalsy();
      });

      it('should return false when the sizes don\'t match', () => {
        expect(compare(arr1, arrWithOneMore)).toBeFalsy();
      });
    });

    describe('and comparing by name', () => {
      const compare = compareArraysUsing<any>((o) => o.name);

      it('should return true when comparing the same array', () => {
        expect(compare(arr1, arr1)).toBeTruthy();
      });

      it('should return true regardless of the order', () => {
        expect(compare(arr1, arrWithDifferentOrder)).toBeTruthy();
      });

      it('should return true regardless of other properties being different', () => {
        expect(compare(arr1, arrWithWrongId)).toBeTruthy();
      });

      it('should return true regardless of extra properties', () => {
        expect(compare(arr1, arrWithAddedProperties)).toBeTruthy();
      });

      it('should return false when the names don\'t match', () => {
        expect(compare(arr1, arrWithWrongName)).toBeFalsy();
      });

      it('should return false when the sizes don\'t match', () => {
        expect(compare(arr1, arrWithOneMore)).toBeFalsy();
      });
    });

    describe('and comparing by full objects', () => {
      const compare = compareArraysUsing<any>((o) => o);

      it('should return true when comparing the same array', () => {
        expect(compare(arr1, arr1)).toBeTruthy();
      });

      it('should return true regardless of the order', () => {
        expect(compare(arr1, arrWithDifferentOrder)).toBeTruthy();
      });

      it('should return false when extra properties are added', () => {
        expect(compare(arr1, arrWithAddedProperties)).toBeFalsy();
      });

      it('should return false when the ids don\'t match', () => {
        expect(compare(arr1, arrWithWrongId)).toBeFalsy();
      });

      it('should return false when the names don\'t match', () => {
        expect(compare(arr1, arrWithWrongName)).toBeFalsy();
      });

      it('should return false when the sizes don\'t match', () => {
        expect(compare(arr1, arrWithOneMore)).toBeFalsy();
      });
    });

    describe('and comparing with primitive objects as source', () => {
      const compare = compareArraysUsing<any>((o) => o);

      it('should return true when comparing the same array', () => {
        expect(compare(arrOfPrimitiveTypes, arrOfPrimitiveTypes)).toBeTruthy();
      });

      it('should return true regardless of the order', () => {
        expect(compare(arrOfPrimitiveTypes, arrOfPrimitiveTypesWithDifferentOrder)).toBeTruthy();
      });

      it('should return false when at least one is wrong', () => {
        expect(compare(arrOfPrimitiveTypes, arrOfPrimitiveTypesWithOneWrong)).toBeFalsy();
      });

      it('should return false when the sizes don\'t match', () => {
        expect(compare(arrOfPrimitiveTypes, arrOfPrimitiveTypesWithOneMore)).toBeFalsy();
      });
    });

  });

  describe('when calling compareArraysUsingIds', () => {
    const compare = compareArraysUsingIds();

    it('should return true when comparing the same array', () => {
      expect(compare(arr1 as any, arr1 as any)).toBeTruthy();
    });

    it('should return true regardless of the order', () => {
      expect(compare(arr1 as any, arrWithDifferentOrder as any)).toBeTruthy();
    });

    it('should return true regardless of other properties being different', () => {
      expect(compare(arr1 as any, arrWithWrongName as any)).toBeTruthy();
    });

    it('should return true regardless of extra properties', () => {
      expect(compare(arr1 as any, arrWithAddedProperties as any)).toBeTruthy();
    });

    it('should return false when the ids don\'t match', () => {
      expect(compare(arr1 as any, arrWithWrongId as any)).toBeFalsy();
    });

    it('should return false when the sizes don\'t match', () => {
      expect(compare(arr1 as any, arrWithOneMore as any)).toBeFalsy();
    });
  });

  const mockItem: Item = Object.assign(new Item(), {
    bundles: createSuccessfulRemoteDataObject$(buildPaginatedList(new PageInfo(), [])),
    metadata: {
      'publicationissue.issueNumber': [
        {
          language: 'en_US',
          value: '1234',
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
  describe('back to results', () => {
    let comp: ItemComponent;
    let fixture: ComponentFixture<any>;
    let router: Router;

    const searchUrl = '/search?query=test&spc.page=2';
    const browseUrl = '/browse/title?scope=0cc&bbm.page=3';
    const recentSubmissionsUrl = '/collections/be7b8430-77a5-4016-91c9-90863e50583a?cp.page=3';

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
          ItemComponent, GenericItemPageFieldComponent, TruncatePipe,
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
          { provide: VersionHistoryDataService, useValue: {} },
          { provide: VersionDataService, useValue: {} },
          { provide: NotificationsService, useValue: {} },
          { provide: DefaultChangeAnalyzer, useValue: {} },
          { provide: BitstreamDataService, useValue: {} },
          { provide: WorkspaceitemDataService, useValue: {} },
          { provide: SearchService, useValue: {} },
          { provide: RouteService, useValue: mockRouteService },
          { provide: AuthorizationDataService, useValue: {} },
          { provide: ResearcherProfileDataService, useValue: {} },
        ],
        schemas: [NO_ERRORS_SCHEMA],
      }).overrideComponent(ItemComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      });
    }));

    beforeEach(waitForAsync(() => {
      router = TestBed.inject(Router);
      spyOn(router, 'navigateByUrl');
      TestBed.compileComponents();
      fixture = TestBed.createComponent(ItemComponent);
      comp = fixture.componentInstance;
      comp.object = mockItem;
      fixture.detectChanges();
    }));

    it('should hide back button', () => {
      spyOn(mockRouteService, 'getPreviousUrl').and.returnValue(observableOf('/item'));
      comp.ngOnInit();
      comp.showBackButton$.subscribe((val) => {
        expect(val).toBeFalse();
      });
    });
    it('should show back button for search', () => {
      spyOn(mockRouteService, 'getPreviousUrl').and.returnValue(observableOf(searchUrl));
      comp.ngOnInit();
      comp.showBackButton$.subscribe((val) => {
        expect(val).toBeTrue();
      });
    });
    it('should show back button for browse', () => {
      spyOn(mockRouteService, 'getPreviousUrl').and.returnValue(observableOf(browseUrl));
      comp.ngOnInit();
      comp.showBackButton$.subscribe((val) => {
        expect(val).toBeTrue();
      });
    });
    it('should show back button for recent submissions', () => {
      spyOn(mockRouteService, 'getPreviousUrl').and.returnValue(observableOf(recentSubmissionsUrl));
      comp.ngOnInit();
      comp.showBackButton$.subscribe((val) => {
        expect(val).toBeTrue();
      });
    });
  });

});
