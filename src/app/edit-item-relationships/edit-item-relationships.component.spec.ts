import {
  CUSTOM_ELEMENTS_SCHEMA,
  DebugElement,
} from '@angular/core';
import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Store } from '@ngrx/store';
import {
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';
import { of as observableOf } from 'rxjs';

import { EntityTypeDataService } from '../core/data/entity-type-data.service';
import { RelationshipDataService } from '../core/data/relationship-data.service';
import { RouteService } from '../core/services/route.service';
import { ThemedConfigurationSearchPageComponent } from '../search-page/themed-configuration-search-page.component';
import { HostWindowService } from '../shared/host-window.service';
import { ThemedLoadingComponent } from '../shared/loading/themed-loading.component';
import { TranslateLoaderMock } from '../shared/mocks/translate-loader.mock';
import { NotificationsService } from '../shared/notifications/notifications.service';
import { SidebarService } from '../shared/sidebar/sidebar.service';
import { ActivatedRouteStub } from '../shared/testing/active-router.stub';
import { NotificationsServiceStub } from '../shared/testing/notifications-service.stub';
import {
  RelationshipsData,
  RelationshipsTypesData,
} from '../shared/testing/relationships-mocks';
import { RelationshipsServiceStub } from '../shared/testing/relationships-service.stub';
import { SidebarServiceStub } from '../shared/testing/sidebar-service.stub';
import { EditItemRelationshipsState } from './edit-item-relationships.actions';
import { EditItemRelationshipsComponent } from './edit-item-relationships.component';
import { RelationshipsSortListComponent } from './relationships-sort-list/relationships-sort-list.component';

describe('EditItemRelationshipsComponent', () => {
  let component: EditItemRelationshipsComponent;
  let fixture: ComponentFixture<EditItemRelationshipsComponent>;
  let de: DebugElement;

  const activatedRouteStub = Object.assign(new ActivatedRouteStub(), {
    // ItemInfo
    data: observableOf({
      info: {},
    }),
  });


  const relationshipsTypes = RelationshipsTypesData;
  const relationships = RelationshipsData;

  const relationType = 'researchoutputs';
  const itemType = 'Person';

  const relationshipsServiceStub = new RelationshipsServiceStub();

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
    },
  };

  const store: Store<EditItemRelationshipsState> = jasmine.createSpyObj('store', {
    pendingChanges: false,
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([]),
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock,
          },
        }),
        EditItemRelationshipsComponent,
        RelationshipsSortListComponent,
      ],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: RelationshipDataService, useValue: relationshipsServiceStub },
        { provide: EntityTypeDataService, useValue: {} },
        { provide: RouteService, useValue: routeServiceStub },
        { provide: Store, useValue: store },
        {
          provide: HostWindowService, useValue: jasmine.createSpyObj('hostWindowService', {
            isXs: observableOf(true),
            isSm: observableOf(false),
            isXsOrSm: observableOf(true),
          }),
        },
        {
          provide: SidebarService,
          useValue: SidebarServiceStub,
        },
        {
          provide: NotificationsService, useClass: NotificationsServiceStub,
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .overrideComponent(EditItemRelationshipsComponent, { remove: { imports: [ThemedLoadingComponent, ThemedConfigurationSearchPageComponent, RelationshipsSortListComponent] } }).compileComponents();
  });


  beforeEach(() => {
    fixture = TestBed.createComponent(EditItemRelationshipsComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    component.isActive = true;
    component.isInit = true;
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
    expect(de.query(By.css('.col-md-4'))).toBeTruthy();
  });

});
