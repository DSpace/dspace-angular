import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { of as observableOf } from 'rxjs';
import { getTestScheduler } from 'jasmine-marbles';
import { ItemMetadataComponent } from './item-metadata.component';
import { Metadatum } from '../../../core/shared/metadatum.model';
import { TestScheduler } from 'rxjs/testing';
import { SharedModule } from '../../../shared/shared.module';
import { ObjectUpdatesService } from '../../../core/data/object-updates/object-updates.service';
import { Router } from '@angular/router';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { TranslateModule } from '@ngx-translate/core';
import { ItemDataService } from '../../../core/data/item-data.service';
import { By } from '@angular/platform-browser';
import {
  INotification,
  Notification
} from '../../../shared/notifications/models/notification.model';
import { NotificationType } from '../../../shared/notifications/models/notification-type';
import { RouterStub } from '../../../shared/testing/router-stub';
import { GLOBAL_CONFIG } from '../../../../config';
import { Item } from '../../../core/shared/item.model';
import { FieldChangeType } from '../../../core/data/object-updates/object-updates.actions';
import { RemoteData } from '../../../core/data/remote-data';

let comp: ItemMetadataComponent;
let fixture: ComponentFixture<ItemMetadataComponent>;
let de: DebugElement;
let el: HTMLElement;
let objectUpdatesService;
const infoNotification: INotification = new Notification('id', NotificationType.Info, 'info');
const warningNotification: INotification = new Notification('id', NotificationType.Warning, 'warning');
const date = new Date();
const router = new RouterStub();
let itemService;
const notificationsService = jasmine.createSpyObj('notificationsService',
  {
    info: infoNotification,
    warning: warningNotification
  }
);
const metadatum1 = Object.assign(new Metadatum(), {
  key: 'dc.description.abstract',
  value: 'Example abstract',
  language: 'en'
});

const metadatum2 = Object.assign(new Metadatum(), {
  key: 'dc.title',
  value: 'Title test',
  language: 'de'
});

const metadatum3 = Object.assign(new Metadatum(), {
  key: 'dc.contributor.author',
  value: 'Shakespeare, William',
});

const route = 'http://test-url.com/test-url';

router.url = route;

const fieldUpdate1 = {
  field: metadatum1,
  changeType: undefined
};

const fieldUpdate2 = {
  field: metadatum2,
  changeType: FieldChangeType.REMOVE
};

const fieldUpdate3 = {
  field: metadatum3,
  changeType: undefined
};

let scheduler: TestScheduler;
let item;
describe('ItemMetadataComponent', () => {
  beforeEach(async(() => {
      item = Object.assign(new Item(), { metadata: [metadatum1, metadatum2, metadatum3] }, { lastModified: date });
      itemService = jasmine.createSpyObj('itemService', {
        update: observableOf(new RemoteData(false, false, true, undefined, item)),
        commitUpdates: {}
      });
      scheduler = getTestScheduler();
      objectUpdatesService = jasmine.createSpyObj('objectUpdatesService',
        {
          getFieldUpdates: observableOf({
            [metadatum1.uuid]: fieldUpdate1,
            [metadatum2.uuid]: fieldUpdate2,
            [metadatum3.uuid]: fieldUpdate3
          }),
          saveAddFieldUpdate: {},
          discardFieldUpdates: {},
          reinstateFieldUpdates: observableOf(true),
          initialize: {},
          getUpdatedFields: observableOf([metadatum1, metadatum2, metadatum3]),
          getLastModified: observableOf(date),
          hasUpdates: observableOf(true),
          isReinstatable: observableOf(false), // should always return something --> its in ngOnInit
          isValidPage: observableOf(true)
        }
      );

      TestBed.configureTestingModule({
        imports: [SharedModule, TranslateModule.forRoot()],
        declarations: [ItemMetadataComponent],
        providers: [
          { provide: ItemDataService, useValue: itemService },
          { provide: ObjectUpdatesService, useValue: objectUpdatesService },
          { provide: Router, useValue: router },
          { provide: NotificationsService, useValue: notificationsService },
          { provide: GLOBAL_CONFIG, useValue: { notifications: { timeOut: 10 } } as any }
        ], schemas: [
          CUSTOM_ELEMENTS_SCHEMA
        ]
      }).compileComponents();
    })
  )
  ;

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemMetadataComponent);
    comp = fixture.componentInstance; // EditInPlaceFieldComponent test instance
    de = fixture.debugElement.query(By.css('div.d-flex'));
    el = de.nativeElement;
    comp.item = item;
    comp.route = route;
    fixture.detectChanges();
  });

  describe('add', () => {
    const md = new Metadatum();
    beforeEach(() => {
      comp.add(md);
    });

    it('it should call saveAddFieldUpdate on the objectUpdatesService with the correct route and metadata', () => {
      expect(objectUpdatesService.saveAddFieldUpdate).toHaveBeenCalledWith(route, md);
    });
  });

  describe('discard', () => {
    beforeEach(() => {
      comp.discard();
    });

    it('it should call discardFieldUpdates on the objectUpdatesService with the correct route and notification', () => {
      expect(objectUpdatesService.discardFieldUpdates).toHaveBeenCalledWith(route, infoNotification);
    });
  });

  describe('reinstate', () => {
    beforeEach(() => {
      comp.reinstate();
    });

    it('it should call reinstateFieldUpdates on the objectUpdatesService with the correct route', () => {
      expect(objectUpdatesService.reinstateFieldUpdates).toHaveBeenCalledWith(route);
    });
  });

  describe('submit', () => {
    beforeEach(() => {
      comp.submit();
    });

    it('it should call reinstateFieldUpdates on the objectUpdatesService with the correct route and metadata', () => {
      expect(objectUpdatesService.getUpdatedFields).toHaveBeenCalledWith(route, comp.item.metadata);
      expect(itemService.update).toHaveBeenCalledWith(comp.item);
      expect(objectUpdatesService.getFieldUpdates).toHaveBeenCalledWith(route, comp.item.metadata);
    });
  });

  describe('hasChanges', () => {
    describe('when the objectUpdatesService\'s hasUpdated method returns true', () => {
      beforeEach(() => {
        objectUpdatesService.hasUpdates.and.returnValue(observableOf(true));
      });

      it('should return an observable that emits true', () => {
        const expected = '(a|)';
        scheduler.expectObservable(comp.hasChanges()).toBe(expected, { a: true });
      });
    });

    describe('when the objectUpdatesService\'s hasUpdated method returns false', () => {
      beforeEach(() => {
        objectUpdatesService.hasUpdates.and.returnValue(observableOf(false));
      });

      it('should return an observable that emits false', () => {
        const expected = '(a|)';
        scheduler.expectObservable(comp.hasChanges()).toBe(expected, { a: false });
      });
    });
  });
})
;
