import { Bitstream } from '../../../core/shared/bitstream.model';
import { of as observableOf } from 'rxjs/internal/observable/of';
import { RemoteData } from '../../../core/data/remote-data';
import { PaginatedList } from '../../../core/data/paginated-list';
import { PageInfo } from '../../../core/shared/page-info.model';
import { Item } from '../../../core/shared/item.model';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ItemBitstreamsComponent } from './item-bitstreams.component';
import { ItemDataService } from '../../../core/data/item-data.service';
import { TranslateModule } from '@ngx-translate/core';
import { ObjectUpdatesService } from '../../../core/data/object-updates/object-updates.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { GLOBAL_CONFIG } from '../../../../config';
import { ChangeDetectorRef, NO_ERRORS_SCHEMA } from '@angular/core';
import { FieldChangeType } from '../../../core/data/object-updates/object-updates.actions';
import { RouterStub } from '../../../shared/testing/router-stub';
import { INotification, Notification } from '../../../shared/notifications/models/notification.model';
import { NotificationType } from '../../../shared/notifications/models/notification-type';
import { BitstreamDataService } from '../../../core/data/bitstream-data.service';
import { getMockRequestService } from '../../../shared/mocks/mock-request.service';
import { ObjectCacheService } from '../../../core/cache/object-cache.service';
import { RequestService } from '../../../core/data/request.service';
import { SearchConfigurationService } from '../../../+search-page/search-service/search-configuration.service';
import { ObjectValuesPipe } from '../../../shared/utils/object-values-pipe';
import { VarDirective } from '../../../shared/utils/var.directive';

let comp: ItemBitstreamsComponent;
let fixture: ComponentFixture<ItemBitstreamsComponent>;

const infoNotification: INotification = new Notification('id', NotificationType.Info, 'info');
const warningNotification: INotification = new Notification('id', NotificationType.Warning, 'warning');
const successNotification: INotification = new Notification('id', NotificationType.Success, 'success');
const bitstream1 = Object.assign(new Bitstream(), {
  uuid: 'bitstream1'
});
const bitstream2 = Object.assign(new Bitstream(), {
  uuid: 'bitstream2'
});
const fieldUpdate1 = {
  field: bitstream1,
  changeType: undefined
};
const fieldUpdate2 = {
  field: bitstream2,
  changeType: FieldChangeType.REMOVE
};
const date = new Date();
const url = 'thisUrl';
let item: Item;
let itemService: ItemDataService;
let objectUpdatesService: ObjectUpdatesService;
let router: any;
let route: ActivatedRoute;
let notificationsService: NotificationsService;
let bitstreamService: BitstreamDataService;
let objectCache: ObjectCacheService;
let requestService: RequestService;
let searchConfig: SearchConfigurationService;

describe('ItemBitstreamsComponent', () => {
  beforeEach(async(() => {
    objectUpdatesService = jasmine.createSpyObj('objectUpdatesService',
      {
        getFieldUpdates: observableOf({
          [bitstream1.uuid]: fieldUpdate1,
          [bitstream2.uuid]: fieldUpdate2,
        }),
        getFieldUpdatesExclusive: observableOf({
          [bitstream1.uuid]: fieldUpdate1,
          [bitstream2.uuid]: fieldUpdate2,
        }),
        saveAddFieldUpdate: {},
        discardFieldUpdates: {},
        reinstateFieldUpdates: observableOf(true),
        initialize: {},
        getUpdatedFields: observableOf([bitstream1, bitstream2]),
        getLastModified: observableOf(date),
        hasUpdates: observableOf(true),
        isReinstatable: observableOf(false),
        isValidPage: observableOf(true)
      }
    );
    router = Object.assign(new RouterStub(), {
      url: url
    });
    notificationsService = jasmine.createSpyObj('notificationsService',
      {
        info: infoNotification,
        warning: warningNotification,
        success: successNotification
      }
    );
    bitstreamService = jasmine.createSpyObj('bitstreamService', {
      deleteAndReturnResponse: jasmine.createSpy('deleteAndReturnResponse')
    });
    objectCache = jasmine.createSpyObj('objectCache', {
      remove: jasmine.createSpy('remove')
    });
    requestService = getMockRequestService();
    searchConfig = Object.assign( {
      paginatedSearchOptions: observableOf({})
    });

    item = Object.assign(new Item(), {
      uuid: 'item',
      id: 'item',
      bitstreams: createMockRDPaginatedObs([bitstream1, bitstream2]),
      lastModified: date
    });
    itemService = Object.assign( {
      getBitstreams: () => createMockRDPaginatedObs([bitstream1, bitstream2]),
      findById: () => createMockRDObs(item)
    });
    route = Object.assign({
      parent: {
        data: observableOf({ item: createMockRD(item) })
      },
      url: url
    });

    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [ItemBitstreamsComponent, ObjectValuesPipe, VarDirective],
      providers: [
        { provide: ItemDataService, useValue: itemService },
        { provide: ObjectUpdatesService, useValue: objectUpdatesService },
        { provide: Router, useValue: router },
        { provide: ActivatedRoute, useValue: route },
        { provide: NotificationsService, useValue: notificationsService },
        { provide: GLOBAL_CONFIG, useValue: { item: { edit: { undoTimeout: 10 } } } as any },
        { provide: BitstreamDataService, useValue: bitstreamService },
        { provide: ObjectCacheService, useValue: objectCache },
        { provide: RequestService, useValue: requestService },
        { provide: SearchConfigurationService, useValue: searchConfig },
        ChangeDetectorRef
      ], schemas: [
        NO_ERRORS_SCHEMA
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemBitstreamsComponent);
    comp = fixture.componentInstance;
    comp.url = url;
    fixture.detectChanges();
  });

  describe('when submit is called', () => {
    beforeEach(() => {
      comp.submit();
    });

    it('should call deleteAndReturnResponse on the bitstreamService for the marked field', () => {
      expect(bitstreamService.deleteAndReturnResponse).toHaveBeenCalledWith(bitstream2);
    });

    it('should not call deleteAndReturnResponse on the bitstreamService for the unmarked field', () => {
      expect(bitstreamService.deleteAndReturnResponse).not.toHaveBeenCalledWith(bitstream1);
    });
  });
});

export function createMockRDPaginatedObs(list: any[]) {
  return createMockRDObs(new PaginatedList(new PageInfo(), list));
}

export function createMockRDObs(obj: any) {
  return observableOf(createMockRD(obj));
}

export function createMockRD(obj: any) {
  return new RemoteData(false, false, true, null, obj);
}
