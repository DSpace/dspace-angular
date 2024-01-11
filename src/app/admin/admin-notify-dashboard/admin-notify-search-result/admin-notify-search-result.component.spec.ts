import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminNotifySearchResultComponent } from './admin-notify-search-result.component';
import { AdminNotifyMessagesService } from '../services/admin-notify-messages.service';
import { ObjectCacheService } from '../../../core/cache/object-cache.service';
import { RequestService } from '../../../core/data/request.service';
import { HALEndpointService } from '../../../core/shared/hal-endpoint.service';
import { RemoteDataBuildService } from '../../../core/cache/builders/remote-data-build.service';
import { cold } from 'jasmine-marbles';
import { ConfigurationProperty } from '../../../core/shared/configuration-property.model';
import { RouteService } from '../../../core/services/route.service';
import { routeServiceStub } from '../../../shared/testing/route-service.stub';
import { ActivatedRoute } from '@angular/router';
import { RouterStub } from '../../../shared/testing/router.stub';
import { TranslateModule } from '@ngx-translate/core';
import { of as observableOf, of } from 'rxjs';
import { AdminNotifyMessage, QueueStatusMap } from '../models/admin-notify-message.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AdminNotifyDetailModalComponent } from '../admin-notify-detail-modal/admin-notify-detail-modal.component';
import { SearchConfigurationService } from '../../../core/shared/search/search-configuration.service';
import { SEARCH_CONFIG_SERVICE } from '../../../my-dspace-page/my-dspace-page.component';
import { DatePipe } from '@angular/common';


export const mockAdminNotifyMessages = [
  {
    'type': 'message',
    'id': 'urn:uuid:5fb3af44-d4f8-4226-9475-2d09c2d8d9e0',
    'coarNotifyType': 'coar-notify:ReviewAction',
    'activityStreamType': 'TentativeReject',
    'inReplyTo': 'urn:uuid:f7289ad5-0955-4c86-834c-fb54a736778b',
    'object': null,
    'context': '24d50450-9ff0-485f-82d4-fba1be42f3f9',
    'queueAttempts': 1,
    'queueLastStartTime': '2023-11-24T14:44:00.064+00:00',
    'origin': 12,
    'target': null,
    'queueStatusLabel': 'notify-queue-status.processed',
    'queueTimeout': '2023-11-24T15:44:00.064+00:00',
    'queueStatus': 3,
    '_links': {
      'self': {
        'href': 'http://localhost:8080/server/api/ldn/messages/urn:uuid:5fb3af44-d4f8-4226-9475-2d09c2d8d9e0'
      }
    },
    'thumbnail': 'test',
    'item': {},
    'accessStatus': {},
    'ldnService': 'NOTIFY inbox - Automatic service',
    'relatedItem': 'test coar 2 demo'
  },
  {
    'type': 'message',
    'id': 'urn:uuid:544c8777-e826-4810-a625-3e394cc3660d',
    'coarNotifyType': 'coar-notify:IngestAction',
    'activityStreamType': 'Announce',
    'inReplyTo': 'urn:uuid:b2ad72d6-6ea9-464f-b385-29a78417f6b8',
    'object': null,
    'context': 'e657437a-0ee2-437d-916a-bba8c57bf40b',
    'queueAttempts': 1,
    'queueLastStartTime': null,
    'origin': 12,
    'target': null,
    'queueStatusLabel': 'notify-queue-status.unmapped_action',
    'queueTimeout': '2023-11-24T14:15:34.945+00:00',
    'queueStatus': 6,
    '_links': {
      'self': {
        'href': 'http://localhost:8080/server/api/ldn/messages/urn:uuid:544c8777-e826-4810-a625-3e394cc3660d'
      }
    },
    'thumbnail': {},
    'item': {},
    'accessStatus': {},
    'ldnService': 'NOTIFY inbox - Automatic service',
    'relatedItem': 'test coar demo'
  }
] as unknown as AdminNotifyMessage[];

export const mockUnformattedAdminNotifyMessages = mockAdminNotifyMessages.map(
  message => ({
    ...message,
    queueStatusLabel:  Object.keys(QueueStatusMap)[Object.values(QueueStatusMap).indexOf(message.queueStatusLabel as unknown as QueueStatusMap)]
  })
) as unknown as AdminNotifyMessage[];
describe('AdminNotifySearchResultComponent', () => {
  let component: AdminNotifySearchResultComponent;
  let fixture: ComponentFixture<AdminNotifySearchResultComponent>;
  let objectCache: ObjectCacheService;
  let requestService: RequestService;
  let halService: HALEndpointService;
  let rdbService: RemoteDataBuildService;
  let adminNotifyMessageService: AdminNotifyMessagesService;
  let searchConfigService: SearchConfigurationService;
  let modalService: NgbModal;
  const requestUUID = '34cfed7c-f597-49ef-9cbe-ea351f0023c2';
  const testObject = {
    uuid: 'test-property',
    name: 'test-property',
    values: ['value-1', 'value-2']
  } as ConfigurationProperty;

  beforeEach(async () => {
    halService = jasmine.createSpyObj('halService', {
      getEndpoint: cold('a', { a: '' })
    });
    adminNotifyMessageService = jasmine.createSpyObj('adminNotifyMessageService', {
      getDetailedMessages: of(mockAdminNotifyMessages),
      reprocessMessage: of(mockAdminNotifyMessages),
    });
    requestService = jasmine.createSpyObj('requestService', {
      generateRequestId: requestUUID,
      send: true
    });
    rdbService = jasmine.createSpyObj('rdbService', {
      buildSingle: cold('a', {
        a: {
          payload: testObject
        }
      })
    });

    searchConfigService = jasmine.createSpyObj('searchConfigService', {
      getCurrentConfiguration: of('NOTIFY.outgoing')
    });
    objectCache = {} as ObjectCacheService;


    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [ AdminNotifySearchResultComponent, AdminNotifyDetailModalComponent ],
      providers: [
        { provide: AdminNotifyMessagesService, useValue: adminNotifyMessageService },
        { provide: RouteService, useValue: routeServiceStub },
        { provide: ActivatedRoute, useValue: new RouterStub() },
        { provide: HALEndpointService, useValue: halService },
        { provide: ObjectCacheService, useValue: objectCache },
        { provide: RequestService, useValue: requestService },
        { provide: RemoteDataBuildService, useValue: rdbService },
        { provide: SEARCH_CONFIG_SERVICE, useValue: searchConfigService },
        DatePipe
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminNotifySearchResultComponent);
    component = fixture.componentInstance;
    modalService = (component as any).modalService;
    spyOn(modalService, 'open').and.returnValue(Object.assign({ componentInstance: Object.assign({ response: observableOf(true) }) }));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.isInbound).toBeFalsy();
  });

  it('should open modal', () => {
    component.openDetailModal(mockAdminNotifyMessages[0]);
    expect(modalService.open).toHaveBeenCalledWith(AdminNotifyDetailModalComponent);
  });

  it('should map messages', (done) => {
    component.messagesSubject$.subscribe((messages) => {
      expect(messages).toEqual(mockAdminNotifyMessages);
      done();
    });
  });

  it('should reprocess message', (done) => {
    component.reprocessMessage(mockAdminNotifyMessages[0]);
    component.messagesSubject$.subscribe((messages) => {
      expect(messages).toEqual(mockAdminNotifyMessages);
      done();
    });
  });

  it('should unsubscribe on destroy', () => {
    (component as any).subs = [of(null).subscribe()];

    spyOn((component as any).subs[0], 'unsubscribe');
    component.ngOnDestroy();
    expect((component as any).subs[0].unsubscribe).toHaveBeenCalled();
  });
});
