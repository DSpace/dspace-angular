import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { DSONameService } from '@dspace/core/breadcrumbs/dso-name.service';
import { ItemTemplateDataService } from '@dspace/core/data/item-template-data.service';
import { RequestService } from '@dspace/core/data/request.service';
import { NotificationsService } from '@dspace/core/notification-system/notifications.service';
import { Collection } from '@dspace/core/shared/collection.model';
import { Item } from '@dspace/core/shared/item.model';
import { DSONameServiceMock } from '@dspace/core/testing/dso-name.service.mock';
import {
  createFailedRemoteDataObject$,
  createSuccessfulRemoteDataObject,
  createSuccessfulRemoteDataObject$,
} from '@dspace/core/utilities/remote-data.utils';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { ThemedDsoEditMetadataComponent } from '../../../dso-shared/dso-edit-metadata/themed-dso-edit-metadata.component';
import { CollectionTemplateItemComponent } from './collection-template-item.component';

describe('CollectionTemplateItemComponent', () => {
  let comp: CollectionTemplateItemComponent;
  let fixture: ComponentFixture<CollectionTemplateItemComponent>;
  let itemTemplateService: ItemTemplateDataService;

  const template = Object.assign(new Item(), {
    uuid: 'template-uuid',
    _links: {
      self: { href: 'template-selflink' },
    },
  });
  const collection = Object.assign(new Collection(), {
    uuid: 'collection-id',
    id: 'collection-id',
    name: 'Fake Collection',
    _links: {
      self: { href: 'collection-selflink' },
    },
  });
  const collectionTemplateHref = 'rest/api/test/collections/template';

  const itemTemplateServiceStub = jasmine.createSpyObj('itemTemplateService', {
    findByCollectionID: createSuccessfulRemoteDataObject$(template),
    createByCollectionID: createSuccessfulRemoteDataObject$(template),
    delete: of(true),
    getCollectionEndpoint: of(collectionTemplateHref),
  });

  const notificationsService = jasmine.createSpyObj('notificationsService', {
    success: {},
    error: {},
  });
  const requestService = jasmine.createSpyObj('requestService', {
    setStaleByHrefSubstring: {},
  });

  beforeEach(waitForAsync(() => {
    void TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), CommonModule, RouterTestingModule, CollectionTemplateItemComponent],
      providers: [
        { provide: ItemTemplateDataService, useValue: itemTemplateServiceStub },
        { provide: ActivatedRoute, useValue: { parent: { data: of({ dso: createSuccessfulRemoteDataObject(collection) }) } } },
        { provide: NotificationsService, useValue: notificationsService },
        { provide: RequestService, useValue: requestService },
        { provide: Router, useValue: {} },
        { provide: DSONameService, useValue: new DSONameServiceMock() },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideComponent(CollectionTemplateItemComponent, {
        remove: { imports: [ThemedDsoEditMetadataComponent] },
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionTemplateItemComponent);
    comp = fixture.componentInstance;
    itemTemplateService = (comp as any).itemTemplateService;
    fixture.detectChanges();
  });

  describe('ngOnInit', () => {
    it('should initialize the collection\'s item template', () => {
      comp.itemTemplateRD$.subscribe((rd) => {
        expect(rd.payload).toEqual(template);
      });
    });
  });

  describe('addItemTemplate', () => {
    beforeEach(() => {
      comp.addItemTemplate();
    });

    it('should create an item template for the collection', () => {
      expect(itemTemplateService.createByCollectionID).toHaveBeenCalledWith(jasmine.any(Item), collection.uuid);
    });

    it('should start editing the item template', () => {
      expect(comp.editing).toBeTrue();
    });
  });

  describe('editItemTemplate', () => {
    it('should start editing the item template', () => {
      comp.editItemTemplate();
      expect(comp.editing).toBeTrue();
    });
  });

  describe('cancelEdit', () => {
    beforeEach(() => {
      comp.editing = true;
    });

    it('should stop editing the item template', () => {
      comp.cancelEdit();
      expect(comp.editing).toBeFalse();
    });
  });

  describe('deleteItemTemplate', () => {
    beforeEach(() => {
      (itemTemplateService.delete as jasmine.Spy).and.returnValue(createSuccessfulRemoteDataObject$({}));
      comp.deleteItemTemplate();
    });

    it('should call ItemTemplateService.delete', () => {
      expect(itemTemplateService.delete).toHaveBeenCalledWith(template.uuid);
    });

    describe('when delete returns a success', () => {
      it('should display a success notification', () => {
        expect(notificationsService.success).toHaveBeenCalled();
      });
    });

    describe('when delete returns a failure', () => {
      beforeEach(() => {
        (itemTemplateService.delete as jasmine.Spy).and.returnValue(createFailedRemoteDataObject$());
        comp.deleteItemTemplate();
      });

      it('should display an error notification', () => {
        expect(notificationsService.error).toHaveBeenCalled();
      });
    });
  });
});
