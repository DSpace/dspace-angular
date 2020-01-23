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
import { createSuccessfulRemoteDataObject, createSuccessfulRemoteDataObject$ } from '../../../shared/testing/utils';
import { ItemTemplateDataService } from '../../../core/data/item-template-data.service';
import { Collection } from '../../../core/shared/collection.model';

describe('CollectionMetadataComponent', () => {
  let comp: CollectionMetadataComponent;
  let fixture: ComponentFixture<CollectionMetadataComponent>;
  let router: Router;
  let itemTemplateService: ItemTemplateDataService;

  const template = new Item();
  const collection = Object.assign(new Collection(), {
    uuid: 'collection-id',
    id: 'collection-id',
    name: 'Fake Collection'
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

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), SharedModule, CommonModule, RouterTestingModule],
      declarations: [CollectionMetadataComponent],
      providers: [
        { provide: CollectionDataService, useValue: {} },
        { provide: ItemTemplateDataService, useValue: itemTemplateServiceStub },
        { provide: ActivatedRoute, useValue: { parent: { data: observableOf({ dso: createSuccessfulRemoteDataObject(collection) }) } } },
        { provide: NotificationsService, useValue: notificationsService }
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
