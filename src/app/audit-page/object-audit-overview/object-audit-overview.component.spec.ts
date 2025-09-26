import { Location } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import {
  ActivatedRoute,
  Router,
  RouterLink,
} from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { CollectionDataService } from 'src/app/core/data/collection-data.service';
import { Item } from 'src/app/core/shared/item.model';
import { APP_DATA_SERVICES_MAP } from 'src/config/app-config.interface';

import { AuditDataService } from '../../core/audit/audit-data.service';
import { Audit } from '../../core/audit/model/audit.model';
import { DSpaceObjectDataService } from '../../core/data/dspace-object-data.service';
import { PaginationService } from '../../core/pagination/pagination.service';
import { MockActivatedRoute } from '../../shared/mocks/active-router.mock';
import { RouterMock } from '../../shared/mocks/router.mock';
import { createSuccessfulRemoteDataObject$ } from '../../shared/remote-data.utils';
import { AuditMock } from '../../shared/testing/audit.mock';
import { PaginationServiceStub } from '../../shared/testing/pagination-service.stub';
import { createPaginatedList } from '../../shared/testing/utils.test';
import { AuditTableComponent } from '../audit-table/audit-table.component';
import { ObjectAuditOverviewComponent } from './object-audit-overview.component';

describe('ObjectAuditOverviewComponent', () => {
  let component: ObjectAuditOverviewComponent;
  let fixture: ComponentFixture<ObjectAuditOverviewComponent>;

  let auditService: AuditDataService;
  let audits: Audit[];
  let dSpaceObjectDataService: DSpaceObjectDataService;
  let collectionService;
  let activatedRoute;
  let locationStub: Location;
  const mockItem = new Item();
  const mockItemId = '1234';
  mockItem.id = mockItemId;

  function init() {
    audits = [ AuditMock ];
    auditService = jasmine.createSpyObj('auditService', {
      findByObject: createSuccessfulRemoteDataObject$(createPaginatedList(audits)),
      getEpersonName: of('Eperson Name'),
      auditHasDetails: false,
      getOtherObject: of(new Audit()),
    });
    dSpaceObjectDataService = jasmine.createSpyObj('DSpaceObjectDataService', { findById: createSuccessfulRemoteDataObject$(mockItem) });
    collectionService = jasmine.createSpyObj('CollectionDataService',
      { findOwningCollectionFor: createSuccessfulRemoteDataObject$(createPaginatedList([{ id : 'collectionId' }])) },
    );
    activatedRoute = new MockActivatedRoute({ objectId: mockItemId });
    activatedRoute.paramMap = of({
      get: () => mockItemId,
    });
    locationStub = jasmine.createSpyObj('location', {
      back: jasmine.createSpy('back'),
    });
  }

  beforeEach(waitForAsync(() => {
    init();
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        RouterTestingModule.withRoutes([]),
        AuditTableComponent,
        ObjectAuditOverviewComponent,
        RouterLink,
      ],
      providers: [
        { provide: AuditDataService, useValue: auditService },
        { provide: PaginationService, useValue: new PaginationServiceStub() },
        { provide: DSpaceObjectDataService, useValue: dSpaceObjectDataService },
        { provide: ActivatedRoute, useValue: activatedRoute },
        { provide: Router, useValue: new RouterMock() },
        { provide: CollectionDataService, useValue: collectionService },
        { provide: APP_DATA_SERVICES_MAP, useValue: new Map() },
        { provide: Location, useValue: locationStub },
        provideMockStore({}),
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideComponent(ObjectAuditOverviewComponent, {
        remove: {
          imports: [AuditTableComponent],
        },
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObjectAuditOverviewComponent);
    component = fixture.componentInstance;
    spyOn(component, 'setAudits').and.callThrough();
    fixture.detectChanges();
  });

  describe('object detail data setting', () => {
    it('should set audits on init', fakeAsync(() => {
      tick();
      fixture.detectChanges();
      expect(component.setAudits).toHaveBeenCalled();
    }));

    it('should set object id', (done) => {
      component.objectId$.subscribe((id) => {
        expect(id).toEqual(mockItemId);
        expect(component.objectId).toEqual(id);
        done();
      });
    });
  });
});
