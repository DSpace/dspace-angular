import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
} from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_CONFIG } from '@dspace/config/app-config.interface';
import { AuthService } from '@dspace/core/auth/auth.service';
import { ObjectCacheService } from '@dspace/core/cache/object-cache.service';
import { CollectionDataService } from '@dspace/core/data/collection-data.service';
import { CommunityDataService } from '@dspace/core/data/community-data.service';
import { ItemTemplateDataService } from '@dspace/core/data/item-template-data.service';
import { RequestService } from '@dspace/core/data/request.service';
import { APP_DATA_SERVICES_MAP } from '@dspace/core/data-services-map-type';
import { NotificationsService } from '@dspace/core/notification-system/notifications.service';
import { Collection } from '@dspace/core/shared/collection.model';
import { Item } from '@dspace/core/shared/item.model';
import { AuthServiceMock } from '@dspace/core/testing/auth.service.mock';
import {
  createFailedRemoteDataObject$,
  createSuccessfulRemoteDataObject,
  createSuccessfulRemoteDataObject$,
} from '@dspace/core/utilities/remote-data.utils';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { getCollectionItemTemplateRoute } from '../../collection-page-routing-paths';
import { CollectionMetadataComponent } from './collection-metadata.component';

describe('CollectionMetadataComponent', () => {
  let comp: CollectionMetadataComponent;
  let fixture: ComponentFixture<CollectionMetadataComponent>;
  let router: Router;
  let itemTemplateService: ItemTemplateDataService;

  const template = Object.assign(new Item(), {
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

  const routerMock = {
    events: of(new NavigationEnd(1, 'url', 'url')),
    navigate: jasmine.createSpy('navigate'),
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), CommonModule, RouterTestingModule, CollectionMetadataComponent],
      providers: [
        { provide: CollectionDataService, useValue: {} },
        { provide: ItemTemplateDataService, useValue: itemTemplateServiceStub },
        { provide: ActivatedRoute, useValue: { parent: { data: of({ dso: createSuccessfulRemoteDataObject(collection) }) } } },
        { provide: NotificationsService, useValue: notificationsService },
        { provide: RequestService, useValue: requestService },
        { provide: Router, useValue: routerMock },
        { provide: AuthService, useValue: new AuthServiceMock() },
        { provide: CommunityDataService, useValue: {} },
        { provide: ObjectCacheService, useValue: {} },
        { provide: APP_DATA_SERVICES_MAP, useValue: {} },
        { provide: APP_CONFIG, useValue: {} },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionMetadataComponent);
    comp = fixture.componentInstance;
    itemTemplateService = (comp as any).itemTemplateService;
    spyOn(comp, 'ngOnInit');
    spyOn(comp, 'initTemplateItem');

    routerMock.events = of(new NavigationEnd(1, 'url', 'url'));
    fixture.detectChanges();
  });

  describe('frontendURL', () => {
    it('should have the right frontendURL set', () => {
      expect((comp as any).frontendURL).toEqual('/collections/');
    });
  });

  describe('addItemTemplate', () => {
    it('should navigate to the collection\'s itemtemplate page', () => {
      comp.addItemTemplate();
      expect(routerMock.navigate).toHaveBeenCalledWith([getCollectionItemTemplateRoute(collection.uuid)]);
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
