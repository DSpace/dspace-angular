import { OrcidQueueComponent } from './orcid-queue.component';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateLoaderMock } from '../../../shared/mocks/translate-loader.mock';
import { RouterTestingModule } from '@angular/router/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { OrcidQueueService } from '../../../core/orcid/orcid-queue.service';
import { PaginationService } from '../../../core/pagination/pagination.service';
import { PaginationServiceStub } from '../../../shared/testing/pagination-service.stub';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { NotificationsServiceStub } from '../../../shared/testing/notifications-service.stub';
import { OrcidHistoryService } from '../../../core/orcid/orcid-history.service';
import { ActivatedRoute, Params } from '@angular/router';
import { ActivatedRouteStub } from '../../../shared/testing/active-router.stub';
import { OrcidQueue } from '../../../core/orcid/model/orcid-queue.model';
import { createSuccessfulRemoteDataObject$ } from '../../../shared/remote-data.utils';
import { createPaginatedList } from '../../../shared/testing/utils.test';
import { PaginatedList } from '../../../core/data/paginated-list.model';

fdescribe('OrcidQueueComponent test suite', () => {
  let comp: OrcidQueueComponent;
  let fixture: ComponentFixture<OrcidQueueComponent>;
  let orcidQueueService: OrcidQueueService;

  const testOwnerId = 'test-owner-id';

  const routeParams: Params = {'id': testOwnerId};

  const activatedRouteStub = new ActivatedRouteStub(routeParams);

  function orcidQueueElement(id: number) {
    return Object.assign(new OrcidQueue(), {
      'id': id,
      'ownerId': testOwnerId,
      'entityId': `test-entity-${id}`,
      'description': `test description ${id}`,
      'recordType': 'Publication',
      'operation': 'INSERT',
      'type': 'orcidqueue',
    });
  }

  const orcidQueueElements = [orcidQueueElement(1), orcidQueueElement(2)];

  const orcidQueueServiceMock = {
    searchByOwnerId(id) {
      return createSuccessfulRemoteDataObject$<PaginatedList<OrcidQueue>>(createPaginatedList<OrcidQueue>(orcidQueueElements));
    },
    clearFindByOwnerRequests() {
      return null;
    }
  };

  beforeEach(waitForAsync(() => {
    void TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock
          }
        }),
        RouterTestingModule.withRoutes([])
      ],
      declarations: [OrcidQueueComponent],
      providers: [
        { provide: OrcidQueueService, useValue: orcidQueueServiceMock },
        { provide: OrcidHistoryService, useValue: {} },
        { provide: PaginationService, useValue: new PaginationServiceStub() },
        { provide: NotificationsService, useValue: new NotificationsServiceStub() },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    orcidQueueService = TestBed.inject(OrcidQueueService);
  }));

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(OrcidQueueComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(comp).toBeTruthy();
  });

});
