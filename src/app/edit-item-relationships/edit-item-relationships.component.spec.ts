import { ComponentFixture, TestBed } from '@angular/core/testing';


import { of as observableOf } from 'rxjs';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateLoaderMock } from '../shared/mocks/translate-loader.mock';
import { SharedModule } from '../shared/shared.module';

import { EditItemRelationshipsComponent } from './edit-item-relationships.component';
import { By } from '@angular/platform-browser';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRouteStub } from '../shared/testing/active-router.stub';
import { AuthServiceStub } from '../shared/testing/auth-service.stub';
import { AuthService } from '../core/auth/auth.service';
import { RelationshipService } from '../core/data/relationship.service';
import { EntityTypeService } from '../core/data/entity-type.service';
import { SearchServiceStub } from '../shared/testing/search-service.stub';
import { RelationshipsServiceStub } from '../shared/testing/relationships-service.stub';
import { createSuccessfulRemoteDataObject } from '../shared/remote-data.utils';
import { createPaginatedList } from '../shared/testing/utils.test';
import { SearchService } from '../core/shared/search/search.service';
import { RoleService } from '../core/roles/role.service';
import { ActivatedRoute } from '@angular/router';
import { RouteService } from '../core/services/route.service';
import { RelationshipsData, RelationshipsTypesData } from '../shared/testing/relationships-mocks';
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
    // tslint:disable-next-line:no-empty
    clearDiscoveryRequests: () => {
    },
  });

  // const searchResults = SearchResultsMock;


  const roleServiceStub = {
    isSubmitter: () => {
      return observableOf(true);
    },
    isController: () => {
      return observableOf(false);
    },
    isAdmin: () => {
      return observableOf(true);
    },
  };

  const routeServiceStub = {
    isSubmitter: () => {
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
      imports: [
        RouterTestingModule.withRoutes([]),
        SharedModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock
          }
        })
      ],
      declarations: [EditItemRelationshipsComponent],
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
