import { ComponentFixture, TestBed, tick } from '@angular/core/testing';


import { of as observableOf } from 'rxjs';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateLoaderMock } from '../shared/mocks/translate-loader.mock';
import { SharedModule } from '../shared/shared.module';

import { defaultIfEmpty, filter, map, mergeMap, switchMap, take,tap,first, mergeAll } from 'rxjs/operators';

import { EditItemRelationshipsComponent } from './edit-item-relationships.component';
import { By } from '@angular/platform-browser';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRouteStub } from '../shared/testing/active-router.stub';
import { DSpaceObject } from '../core/shared/dspace-object.model';
import { AuthServiceStub } from '../shared/testing/auth-service.stub';
import { AuthService } from '../core/auth/auth.service';
import { RelationshipService  } from '../core/data/relationship.service';
import { EntityTypeService } from '../core/data/entity-type.service';
import { SearchServiceStub } from '../shared/testing/search-service.stub';
import { PaginatedSearchOptions } from '../shared/search/paginated-search-options.model';
import { RelationshipsServiceStub } from '../shared/testing/relationships-service.stub';
import {
  createFailedRemoteDataObject$,
  createSuccessfulRemoteDataObject,
  createSuccessfulRemoteDataObject$
} from '../shared/remote-data.utils';
import { createPaginatedList } from '../shared/testing/utils.test';
import { RemoteData } from '../core/data/remote-data';
import { PaginationComponentOptions } from '../shared/pagination/pagination-component-options.model';
import { SortDirection, SortOptions } from '../core/cache/models/sort-options.model';
import { SearchService } from '../core/shared/search/search.service';
import { RoleService } from '../core/roles/role.service';
import { ActivatedRoute, Router } from '@angular/router';
import { RouteService } from '../core/services/route.service';
// import { SearchResultsMock } from '../shared/testing/search-results-mocks';
import { ItemInfo, RelationshipsTypesData, RelationshipsData } from '../shared/testing/relationships-mocks';

import { HostWindowService } from '../shared/host-window.service';


describe('EditItemRelationshipsComponent', () => {
  let component: EditItemRelationshipsComponent;
  let fixture: ComponentFixture<EditItemRelationshipsComponent>;
  let de: DebugElement;

  const emptyList = createSuccessfulRemoteDataObject(createPaginatedList([]));

  const authServiceStub = new AuthServiceStub();
  const activatedRouteStub = Object.assign(new ActivatedRouteStub(), {
    // ItemInfo
    data: observableOf({
      info: {}
    })
  });

  const relationshipsTypes = RelationshipsTypesData;
  const relationships = RelationshipsData;

  const relationType = 'researchoutputs';
  const itemType = 'Person';


  const relationshipsServiceStub = new RelationshipsServiceStub();

  const searchServiceStub = Object.assign(new SearchServiceStub(), {
    search: () => observableOf(emptyList),
    /* tslint: disable: no-empty */
    clearDiscoveryRequests: () => {},
    /* tslint: enable: no-empty */
  });

  // const searchResults = SearchResultsMock;


  const roleServiceStub = {
    isSubmitter : () => {
      return observableOf(true);
    },
    isController : () => {
      return observableOf(false);
    },
    isAdmin : () => {
      return observableOf(true);
    },
  };

  const routeServiceStub = {
    isSubmitter : () => {
      return observableOf(true);
    },
    getRouteParameterValue: () => {
      return observableOf('');
    },
    getQueryParameterValue: () => {
      return observableOf('');
    },
    getQueryParamsWithPrefix: () => {
      return observableOf('');
    }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
        imports : [
          RouterTestingModule.withRoutes([]),
          SharedModule,
          TranslateModule.forRoot({
            loader: {
              provide: TranslateLoader,
              useClass: TranslateLoaderMock
            }
          })
        ],
        declarations: [ EditItemRelationshipsComponent ],
        providers: [
          { provide: ActivatedRoute, useValue: activatedRouteStub },
          { provide: AuthService, useValue: authServiceStub },
          { provide: RelationshipService, useValue: relationshipsServiceStub },
          { provide: SearchService, useValue: searchServiceStub },
          { provide: EntityTypeService, useValue: {} },
          { provide: RoleService, useValue: roleServiceStub },
          { provide: RouteService, useValue: routeServiceStub },
          {
            provide: HostWindowService, useValue: jasmine.createSpyObj('hostWindowService',
              {
                isXs: observableOf(true),
                isSm: observableOf(false),
                isXsOrSm: observableOf(true)
              })
          },
        ],
        schemas: [NO_ERRORS_SCHEMA]
      })
      .compileComponents();
    });


  beforeEach(() => {
    fixture = TestBed.createComponent(EditItemRelationshipsComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be empty list of relations', () => {
    expect(de.query(By.css('.relationships-sort-list'))).toBeNull();
  });

  it('should be empty list of items', () => {
    expect(de.query(By.css('.search-results'))).toBeNull();
  });

  it('after init & item is set check that the relationship type is set', () => {
    component.relTypes = RelationshipsTypesData;
    component.relationshipResults$.next(RelationshipsData);
    fixture.detectChanges();
    // console.log(relationships);
    expect(de.query(By.css('.relationships-sort-list'))).toBeTruthy();
  });

});
