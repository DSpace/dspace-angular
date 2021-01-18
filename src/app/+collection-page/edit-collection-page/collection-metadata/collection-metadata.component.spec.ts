import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../../../shared/shared.module';
import { CommonModule } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { CollectionDataService } from '../../../core/data/collection-data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of as observableOf } from 'rxjs/internal/observable/of';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CollectionMetadataComponent } from './collection-metadata.component';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { Item } from '../../../core/shared/item.model';
import { ItemTemplateDataService } from '../../../core/data/item-template-data.service';
import { Collection } from '../../../core/shared/collection.model';
import { ObjectCacheService } from '../../../core/cache/object-cache.service';
import { RequestService } from '../../../core/data/request.service';
import { createSuccessfulRemoteDataObject, createSuccessfulRemoteDataObject$ } from '../../../shared/remote-data.utils';

describe('CollectionMetadataComponent', () => {
  let comp: CollectionMetadataComponent;
  let fixture: ComponentFixture<CollectionMetadataComponent>;
  let router: Router;
  let itemTemplateService: ItemTemplateDataService;

  const template = Object.assign(new Item(), {
    _links: {
      self: { href: 'template-selflink' }
    }
  });
  const collection = Object.assign(new Collection(), {
    uuid: 'collection-id',
    id: 'collection-id',
    name: 'Fake Collection',
    _links: {
      self: { href: 'collection-selflink' }
    }
  });

  const itemTemplateServiceStub = Object.assign({
    findByCollectionID: () => createSuccessfulRemoteDataObject$(template),
    create: () => createSuccessfulRemoteDataObject$(template),
    deleteByCollectionID: () => observableOf(true)
  });

  const notificationsService = jasmine.createSpyObj('notificationsService', {
    success: {},
    error: {}
  });
  const objectCache = jasmine.createSpyObj('objectCache', {
    remove: {}
  });
  const requestService = jasmine.createSpyObj('requestService', {
    removeByHrefSubstring: {}
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), SharedModule, CommonModule, RouterTestingModule],
      declarations: [CollectionMetadataComponent],
      providers: [
        { provide: CollectionDataService, useValue: {} },
        { provide: ItemTemplateDataService, useValue: itemTemplateServiceStub },
        { provide: ActivatedRoute, useValue: { parent: { data: observableOf({ dso: createSuccessfulRemoteDataObject(collection) }) } } },
        { provide: NotificationsService, useValue: notificationsService },
        { provide: ObjectCacheService, useValue: objectCache },
        { provide: RequestService, useValue: requestService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionMetadataComponent);
    comp = fixture.componentInstance;
    router = (comp as any).router;
    itemTemplateService = (comp as any).itemTemplateService;
    fixture.detectChanges();
  });

  describe('frontendURL', () => {
    it('should have the right frontendURL set', () => {
      expect((comp as any).frontendURL).toEqual('/collections/');
    });
  });

  describe('addItemTemplate', () => {
    it('should navigate to the collection\'s itemtemplate page', () => {
      spyOn(router, 'navigate');
      comp.addItemTemplate();
      expect(router.navigate).toHaveBeenCalledWith(['collections', collection.uuid, 'itemtemplate']);
    });
  });

  describe('deleteItemTemplate', () => {
    describe('when delete returns a success', () => {
      beforeEach(() => {
        spyOn(itemTemplateService, 'deleteByCollectionID').and.returnValue(observableOf(true));
        comp.deleteItemTemplate();
      });

      it('should display a success notification', () => {
        expect(notificationsService.success).toHaveBeenCalled();
      });

      it('should reset related object and request cache', () => {
        expect(objectCache.remove).toHaveBeenCalledWith(template.self);
        expect(requestService.removeByHrefSubstring).toHaveBeenCalledWith(collection.self);
      });
    });

    describe('when delete returns a failure', () => {
      beforeEach(() => {
        spyOn(itemTemplateService, 'deleteByCollectionID').and.returnValue(observableOf(false));
        comp.deleteItemTemplate();
      });

      it('should display an error notification', () => {
        expect(notificationsService.error).toHaveBeenCalled();
      });
    });
  });
});
