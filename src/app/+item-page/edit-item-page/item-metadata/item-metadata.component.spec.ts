import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { of as observableOf } from 'rxjs';
import { getTestScheduler } from 'jasmine-marbles';
import { ItemMetadataComponent } from './item-metadata.component';
import { TestScheduler } from 'rxjs/testing';
import { SharedModule } from '../../../shared/shared.module';
import { ObjectUpdatesService } from '../../../core/data/object-updates/object-updates.service';
import { ActivatedRoute, Router } from '@angular/router';
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
import { MetadatumViewModel } from '../../../core/shared/metadata.models';
import { RegistryService } from '../../../core/registry/registry.service';
import { PaginatedList } from '../../../core/data/paginated-list';
import { MetadataSchema } from '../../../core/metadata/metadataschema.model';
import { MetadataField } from '../../../core/metadata/metadatafield.model';
import { Metadata } from '../../../core/shared/metadata.utils';

let comp: ItemMetadataComponent;
let fixture: ComponentFixture<ItemMetadataComponent>;
let de: DebugElement;
let el: HTMLElement;
let objectUpdatesService;
const infoNotification: INotification = new Notification('id', NotificationType.Info, 'info');
const warningNotification: INotification = new Notification('id', NotificationType.Warning, 'warning');
const successNotification: INotification = new Notification('id', NotificationType.Success, 'success');
const date = new Date();
const router = new RouterStub();
let metadataFieldService;
let paginatedMetadataFields;
let routeStub;

const mdSchema = Object.assign(new MetadataSchema(), { prefix: 'dc' });
const mdField1 = Object.assign(new MetadataField(), {
  schema: mdSchema,
  element: 'contributor',
  qualifier: 'author'
});
const mdField2 = Object.assign(new MetadataField(), { schema: mdSchema, element: 'title' });
const mdField3 = Object.assign(new MetadataField(), {
  schema: mdSchema,
  element: 'description',
  qualifier: 'abstract'
});

let itemService;
const notificationsService = jasmine.createSpyObj('notificationsService',
  {
    info: infoNotification,
    warning: warningNotification,
    success: successNotification
  }
);
const metadatum1 = Object.assign(new MetadatumViewModel(), {
  key: 'dc.description.abstract',
  value: 'Example abstract',
  language: 'en'
});

const metadatum2 = Object.assign(new MetadatumViewModel(), {
  key: 'dc.title',
  value: 'Title test',
  language: 'de'
});

const metadatum3 = Object.assign(new MetadatumViewModel(), {
  key: 'dc.contributor.author',
  value: 'Shakespeare, William',
});

const url = 'http://test-url.com/test-url';

router.url = url;

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
      item = Object.assign(new Item(), {
          metadata: {
            [metadatum1.key]: [metadatum1],
            [metadatum2.key]: [metadatum2],
            [metadatum3.key]: [metadatum3]
          }
        },
        {
          lastModified: date
        }
      )
      ;
      itemService = jasmine.createSpyObj('itemService', {
        update: observableOf(new RemoteData(false, false, true, undefined, item)),
        commitUpdates: {}
      });
      routeStub = {
        parent: {
          data: observableOf({ item: new RemoteData(false, false, true, null, item) })
        }
      };
      paginatedMetadataFields = new PaginatedList(undefined, [mdField1, mdField2, mdField3]);

      metadataFieldService = jasmine.createSpyObj({
        getAllMetadataFields: observableOf(new RemoteData(false, false, true, undefined, paginatedMetadataFields))
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
          { provide: ActivatedRoute, useValue: routeStub },
          { provide: NotificationsService, useValue: notificationsService },
          { provide: GLOBAL_CONFIG, useValue: { item: { edit: { undoTimeout: 10 } } } as any },
          { provide: RegistryService, useValue: metadataFieldService },
        ], schemas: [
          NO_ERRORS_SCHEMA
        ]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemMetadataComponent);
    comp = fixture.componentInstance; // EditInPlaceFieldComponent test instance
    de = fixture.debugElement;
    el = de.nativeElement;
    comp.url = url;
    fixture.detectChanges();
  });

  describe('add', () => {
    const md = new MetadatumViewModel();
    beforeEach(() => {
      comp.add(md);
    });

    it('it should call saveAddFieldUpdate on the objectUpdatesService with the correct url and metadata', () => {
      expect(objectUpdatesService.saveAddFieldUpdate).toHaveBeenCalledWith(url, md);
    });
  });

  describe('discard', () => {
    beforeEach(() => {
      comp.discard();
    });

    it('it should call discardFieldUpdates on the objectUpdatesService with the correct url and notification', () => {
      expect(objectUpdatesService.discardFieldUpdates).toHaveBeenCalledWith(url, infoNotification);
    });
  });

  describe('reinstate', () => {
    beforeEach(() => {
      comp.reinstate();
    });

    it('it should call reinstateFieldUpdates on the objectUpdatesService with the correct url', () => {
      expect(objectUpdatesService.reinstateFieldUpdates).toHaveBeenCalledWith(url);
    });
  });

  describe('submit', () => {
    beforeEach(() => {
      comp.submit();
    });

    it('it should call reinstateFieldUpdates on the objectUpdatesService with the correct url and metadata', () => {
      expect(objectUpdatesService.getUpdatedFields).toHaveBeenCalledWith(url, comp.item.metadataAsList);
      expect(itemService.update).toHaveBeenCalledWith(Object.assign(comp.item, { metadata: Metadata.toMetadataMap(comp.item.metadataAsList) }));
      expect(objectUpdatesService.getFieldUpdates).toHaveBeenCalledWith(url, comp.item.metadataAsList);
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

  describe('changeType is UPDATE', () => {
    beforeEach(() => {
      fieldUpdate1.changeType = FieldChangeType.UPDATE;
      fixture.detectChanges();
    });
    it('the div should have class table-warning', () => {
      const element = de.queryAll(By.css('tr'))[1].nativeElement;
      expect(element.classList).toContain('table-warning');
    });
  });

  describe('changeType is ADD', () => {
    beforeEach(() => {
      fieldUpdate1.changeType = FieldChangeType.ADD;
      fixture.detectChanges();
    });
    it('the div should have class table-success', () => {
      const element = de.queryAll(By.css('tr'))[1].nativeElement;
      expect(element.classList).toContain('table-success');
    });
  });

  describe('changeType is REMOVE', () => {
    beforeEach(() => {
      fieldUpdate1.changeType = FieldChangeType.REMOVE;
      fixture.detectChanges();
    });
    it('the div should have class table-danger', () => {
      const element = de.queryAll(By.css('tr'))[1].nativeElement;
      expect(element.classList).toContain('table-danger');
    });
  });
});
