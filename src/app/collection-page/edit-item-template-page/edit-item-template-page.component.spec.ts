import { EditItemTemplatePageComponent } from './edit-item-template-page.component';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { CommonModule } from '@angular/common';
import { ItemTemplateDataService } from '../../core/data/item-template-data.service';
import { ActivatedRoute } from '@angular/router';
import { of as observableOf } from 'rxjs';
import { Collection } from '../../core/shared/collection.model';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { createSuccessfulRemoteDataObject, createSuccessfulRemoteDataObject$ } from '../../shared/remote-data.utils';
import { getCollectionEditRoute } from '../collection-page-routing-paths';
import { ThemeService } from '../../shared/theme-support/theme.service';
import { getMockThemeService } from '../../shared/mocks/theme-service.mock';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { NotificationsServiceStub } from '../../shared/testing/notifications-service.stub';

describe('EditItemTemplatePageComponent', () => {
  let comp: EditItemTemplatePageComponent;
  let fixture: ComponentFixture<EditItemTemplatePageComponent>;
  let itemTemplateService: ItemTemplateDataService;
  let collection: Collection;

  beforeEach(waitForAsync(() => {
    collection = Object.assign(new Collection(), {
      uuid: 'collection-id',
      id: 'collection-id',
      name: 'Fake Collection'
    });
    itemTemplateService = jasmine.createSpyObj('itemTemplateService', {
      findByCollectionID: createSuccessfulRemoteDataObject$({})
    });
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), CommonModule, RouterTestingModule, EditItemTemplatePageComponent],
      providers: [
        { provide: ItemTemplateDataService, useValue: itemTemplateService },
        { provide: ActivatedRoute, useValue: { parent: { data: observableOf({ dso: createSuccessfulRemoteDataObject(collection) }) } } },
        { provide: ThemeService, useValue: getMockThemeService() },
        { provide: NotificationsService, useValue: new NotificationsServiceStub() },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditItemTemplatePageComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('getCollectionEditUrl', () => {
    it('should return the collection\'s edit url', () => {
      const url = comp.getCollectionEditUrl(collection);
      expect(url).toEqual(getCollectionEditRoute(collection.uuid));
    });
  });
});
