import {
  ChangeDetectorRef,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { ObjectCacheService } from '../../../core/cache/object-cache.service';
import { BitstreamDataService } from '../../../core/data/bitstream-data.service';
import { BundleDataService } from '../../../core/data/bundle-data.service';
import { ItemDataService } from '../../../core/data/item-data.service';
import { FieldChangeType } from '../../../core/data/object-updates/field-change-type.model';
import { ObjectUpdatesService } from '../../../core/data/object-updates/object-updates.service';
import { RequestService } from '../../../core/data/request.service';
import { Bitstream } from '../../../core/shared/bitstream.model';
import { Bundle } from '../../../core/shared/bundle.model';
import { Item } from '../../../core/shared/item.model';
import { SearchConfigurationService } from '../../../core/shared/search/search-configuration.service';
import { ThemedLoadingComponent } from '../../../shared/loading/themed-loading.component';
import { getMockRequestService } from '../../../shared/mocks/request.service.mock';
import {
  INotification,
  Notification,
} from '../../../shared/notifications/models/notification.model';
import { NotificationType } from '../../../shared/notifications/models/notification-type';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import {
  createSuccessfulRemoteDataObject,
  createSuccessfulRemoteDataObject$,
} from '../../../shared/remote-data.utils';
import { BitstreamDataServiceStub } from '../../../shared/testing/bitstream-data-service.stub';
import { RouterStub } from '../../../shared/testing/router.stub';
import { createPaginatedList } from '../../../shared/testing/utils.test';
import { ObjectValuesPipe } from '../../../shared/utils/object-values-pipe';
import { VarDirective } from '../../../shared/utils/var.directive';
import { ItemBitstreamsComponent } from './item-bitstreams.component';
import { ItemBitstreamsService } from './item-bitstreams.service';
import {
  getItemBitstreamsServiceStub,
  ItemBitstreamsServiceStub,
} from './item-bitstreams.service.stub';
import { ItemEditBitstreamBundleComponent } from './item-edit-bitstream-bundle/item-edit-bitstream-bundle.component';

let comp: ItemBitstreamsComponent;
let fixture: ComponentFixture<ItemBitstreamsComponent>;

const infoNotification: INotification = new Notification('id', NotificationType.Info, 'info');
const warningNotification: INotification = new Notification('id', NotificationType.Warning, 'warning');
const successNotification: INotification = new Notification('id', NotificationType.Success, 'success');
const bitstream1 = Object.assign(new Bitstream(), {
  id: 'bitstream1',
  uuid: 'bitstream1',
});
const bitstream2 = Object.assign(new Bitstream(), {
  id: 'bitstream2',
  uuid: 'bitstream2',
});
const fieldUpdate1 = {
  field: bitstream1,
  changeType: undefined,
};
const fieldUpdate2 = {
  field: bitstream2,
  changeType: FieldChangeType.REMOVE,
};
const bundle = Object.assign(new Bundle(), {
  id: 'bundle1',
  uuid: 'bundle1',
  _links: {
    self: { href: 'bundle1-selflink' },
  },
  bitstreams: createSuccessfulRemoteDataObject$(createPaginatedList([bitstream1, bitstream2])),
});
const moveOperations = [
  {
    op: 'move',
    from: '/0',
    path: '/1',
  },
];
const date = new Date();
const url = 'thisUrl';
let item: Item;
let itemService: ItemDataService;
let objectUpdatesService: ObjectUpdatesService;
let router: any;
let route: ActivatedRoute;
let notificationsService: NotificationsService;
let bitstreamService: BitstreamDataServiceStub;
let objectCache: ObjectCacheService;
let requestService: RequestService;
let searchConfig: SearchConfigurationService;
let bundleService: BundleDataService;
let itemBitstreamsService: ItemBitstreamsServiceStub;

describe('ItemBitstreamsComponent', () => {
  beforeEach(waitForAsync(() => {
    objectUpdatesService = jasmine.createSpyObj('objectUpdatesService',
      {
        getFieldUpdates: of({
          [bitstream1.uuid]: fieldUpdate1,
          [bitstream2.uuid]: fieldUpdate2,
        }),
        getFieldUpdatesExclusive: of({
          [bitstream1.uuid]: fieldUpdate1,
          [bitstream2.uuid]: fieldUpdate2,
        }),
        saveAddFieldUpdate: {},
        discardFieldUpdates: {},
        discardAllFieldUpdates: {},
        reinstateFieldUpdates: of(true),
        initialize: {},
        getUpdatedFields: of([bitstream1, bitstream2]),
        getLastModified: of(date),
        hasUpdates: of(true),
        isReinstatable: of(false),
        isValidPage: of(true),
        getMoveOperations: of(moveOperations),
      },
    );
    router = Object.assign(new RouterStub(), {
      url: url,
    });
    notificationsService = jasmine.createSpyObj('notificationsService',
      {
        info: infoNotification,
        warning: warningNotification,
        success: successNotification,
      },
    );
    bitstreamService = new BitstreamDataServiceStub();
    objectCache = jasmine.createSpyObj('objectCache', {
      remove: jasmine.createSpy('remove'),
    });
    requestService = getMockRequestService();
    searchConfig = Object.assign({
      paginatedSearchOptions: of({}),
    });

    item = Object.assign(new Item(), {
      uuid: 'item',
      id: 'item',
      _links: {
        self: { href: 'item-selflink' },
      },
      bundles: createSuccessfulRemoteDataObject$(createPaginatedList([bundle])),
      lastModified: date,
    });
    itemService = Object.assign({
      getBitstreams: () => createSuccessfulRemoteDataObject$(createPaginatedList([bitstream1, bitstream2])),
      findByHref: () => createSuccessfulRemoteDataObject$(item),
      findById: () => createSuccessfulRemoteDataObject$(item),
      getBundles: () => createSuccessfulRemoteDataObject$(createPaginatedList([bundle])),
    });
    route = Object.assign({
      parent: {
        data: of({ dso: createSuccessfulRemoteDataObject(item) }),
      },
      data: of({}),
      url: url,
    });
    bundleService = jasmine.createSpyObj('bundleService', {
      patch: createSuccessfulRemoteDataObject$({}),
    });

    itemBitstreamsService = getItemBitstreamsServiceStub();

    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        ItemBitstreamsComponent,
        ObjectValuesPipe,
        VarDirective,
        BrowserAnimationsModule,
      ],
      providers: [
        { provide: ItemDataService, useValue: itemService },
        { provide: ObjectUpdatesService, useValue: objectUpdatesService },
        { provide: Router, useValue: router },
        { provide: ActivatedRoute, useValue: route },
        { provide: NotificationsService, useValue: notificationsService },
        { provide: BitstreamDataService, useValue: bitstreamService },
        { provide: ObjectCacheService, useValue: objectCache },
        { provide: RequestService, useValue: requestService },
        { provide: SearchConfigurationService, useValue: searchConfig },
        { provide: BundleDataService, useValue: bundleService },
        { provide: ItemBitstreamsService, useValue: itemBitstreamsService },
        ChangeDetectorRef,
      ], schemas: [
        NO_ERRORS_SCHEMA,
      ],
    })
      .overrideComponent(ItemBitstreamsComponent, {
        remove: {
          imports: [ItemEditBitstreamBundleComponent,
            ThemedLoadingComponent],
        },
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemBitstreamsComponent);
    comp = fixture.componentInstance;
    comp.url = url;
    fixture.detectChanges();
  });

  describe('when submit is called', () => {
    beforeEach(() => {
      spyOn(bitstreamService, 'removeMultiple').and.callThrough();
      comp.submit();
    });

    it('should call removeMarkedBitstreams on the itemBitstreamsService', () => {
      expect(itemBitstreamsService.removeMarkedBitstreams).toHaveBeenCalled();
    });
  });

  describe('discard', () => {
    it('should discard ALL field updates', () => {
      comp.discard();
      expect(objectUpdatesService.discardAllFieldUpdates).toHaveBeenCalled();
    });
  });

  describe('reinstate', () => {
    it('should reinstate field updates on the bundle', () => {
      comp.reinstate();
      expect(objectUpdatesService.reinstateFieldUpdates).toHaveBeenCalledWith(bundle.self);
    });
  });

  describe('moveUp', () => {
    it('should move the selected bitstream up', () => {
      itemBitstreamsService.hasSelectedBitstream.and.returnValue(true);

      const event = {
        preventDefault: () => {/* Intentionally empty */},
      } as KeyboardEvent;
      comp.moveUp(event);

      expect(itemBitstreamsService.moveSelectedBitstreamUp).toHaveBeenCalled();
    });

    it('should not do anything if no bitstream is selected', () => {
      itemBitstreamsService.hasSelectedBitstream.and.returnValue(false);

      const event = {
        preventDefault: () => {/* Intentionally empty */},
      } as KeyboardEvent;
      comp.moveUp(event);

      expect(itemBitstreamsService.moveSelectedBitstreamUp).not.toHaveBeenCalled();
    });
  });

  describe('moveDown', () => {
    it('should move the selected bitstream down', () => {
      itemBitstreamsService.hasSelectedBitstream.and.returnValue(true);

      const event = {
        preventDefault: () => {/* Intentionally empty */},
      } as KeyboardEvent;
      comp.moveDown(event);

      expect(itemBitstreamsService.moveSelectedBitstreamDown).toHaveBeenCalled();
    });

    it('should not do anything if no bitstream is selected', () => {
      itemBitstreamsService.hasSelectedBitstream.and.returnValue(false);

      const event = {
        preventDefault: () => {/* Intentionally empty */},
      } as KeyboardEvent;
      comp.moveDown(event);

      expect(itemBitstreamsService.moveSelectedBitstreamDown).not.toHaveBeenCalled();
    });
  });

  describe('cancelSelection', () => {
    it('should cancel the selection', () => {
      itemBitstreamsService.hasSelectedBitstream.and.returnValue(true);

      const event = {
        preventDefault: () => {/* Intentionally empty */},
      } as KeyboardEvent;
      comp.cancelSelection(event);

      expect(itemBitstreamsService.cancelSelection).toHaveBeenCalled();
    });

    it('should not do anything if no bitstream is selected', () => {
      itemBitstreamsService.hasSelectedBitstream.and.returnValue(false);

      const event = {
        preventDefault: () => {/* Intentionally empty */},
      } as KeyboardEvent;
      comp.cancelSelection(event);

      expect(itemBitstreamsService.cancelSelection).not.toHaveBeenCalled();
    });
  });

  describe('clearSelection', () => {
    it('should clear the selection', () => {
      itemBitstreamsService.hasSelectedBitstream.and.returnValue(true);

      const event = {
        target: document.createElement('BODY'),
        preventDefault: () => {/* Intentionally empty */},
      } as unknown as KeyboardEvent;
      comp.clearSelection(event);

      expect(itemBitstreamsService.clearSelection).toHaveBeenCalled();
    });

    it('should not do anything if no bitstream is selected', () => {
      itemBitstreamsService.hasSelectedBitstream.and.returnValue(false);

      const event = {
        target: document.createElement('BODY'),
        preventDefault: () => {/* Intentionally empty */},
      } as unknown as KeyboardEvent;
      comp.clearSelection(event);

      expect(itemBitstreamsService.clearSelection).not.toHaveBeenCalled();
    });

    it('should not do anything if the event target is not \'BODY\'', () => {
      itemBitstreamsService.hasSelectedBitstream.and.returnValue(true);

      const event = {
        target: document.createElement('NOT-BODY'),
        preventDefault: () => {/* Intentionally empty */},
      } as unknown as KeyboardEvent;
      comp.clearSelection(event);

      expect(itemBitstreamsService.clearSelection).not.toHaveBeenCalled();
    });
  });
});
