import { TestBed } from '@angular/core/testing';
import {
  Router,
  UrlTree,
} from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import {
  Observable,
  of,
} from 'rxjs';
import { AuthService } from 'src/app/core/auth/auth.service';
import { AuthorizationDataService } from 'src/app/core/data/feature-authorization/authorization-data.service';
import { FeatureID } from 'src/app/core/data/feature-authorization/feature-id';

import { APP_DATA_SERVICES_MAP } from '../../../config/app-config.interface';
import { ItemDataService } from '../../core/data/item-data.service';
import { Item } from '../../core/shared/item.model';
import { getMockTranslateService } from '../../shared/mocks/translate.service.mock';
import { createSuccessfulRemoteDataObject$ } from '../../shared/remote-data.utils';
import { itemPageEditAuthorizationsGuard } from './item-page-edit-authorizations.guard';

describe('itemPageEditAuthorizationsGuard', () => {
  let authorizationService: AuthorizationDataService;
  let authService: AuthService;
  let router: Router;
  let route;
  let parentRoute;
  let store: Store;
  let itemService: ItemDataService;
  let item: Item;
  let uuid = '1234-abcdef-54321-fedcba';
  let itemSelfLink = 'test.url/1234-abcdef-54321-fedcba';

  beforeEach(() => {

    store = jasmine.createSpyObj('store', {
      dispatch: {},
      pipe: of(true),
    });
    authorizationService = jasmine.createSpyObj('authorizationService', {
      isAuthorized: of(true),
    });
    router = jasmine.createSpyObj('router', {
      parseUrl: {},
      navigateByUrl: undefined,
    });
    authService = jasmine.createSpyObj('authService', {
      isAuthenticated: of(true),
    });

    parentRoute = {
      params: {
        id: '3e1a5327-dabb-41ff-af93-e6cab9d032f0',
      },
    };
    route = {
      params: {},
      parent: parentRoute,
    };
    item = new Item();
    item.uuid = uuid;
    item._links = { self: { href: itemSelfLink }  } as any;
    itemService = jasmine.createSpyObj('itemService', { findById: createSuccessfulRemoteDataObject$(item) });

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthorizationDataService, useValue: authorizationService },
        { provide: Router, useValue: router },
        { provide: AuthService, useValue: authService },
        { provide: Store, useValue: store },
        { provide: APP_DATA_SERVICES_MAP, useValue: {} },
        { provide: TranslateService, useValue: getMockTranslateService() },
        { provide: ItemDataService, useValue: itemService },
      ],
    });
  });

  it('should call authorizationService.isAuthorized with the appropriate arguments', (done) => {
    const result$ = TestBed.runInInjectionContext(() => {
      return itemPageEditAuthorizationsGuard(route, { url: 'current-url' } as any);
    }) as Observable<boolean | UrlTree>;

    result$.subscribe((result) => {
      expect(authorizationService.isAuthorized).toHaveBeenCalledWith(
        FeatureID.CanManagePolicies,
        itemSelfLink, // This value is retrieved from the itemDataService.findById's return item's self link
        undefined, // dsoPageSingleFeatureGuard never provides a function to retrieve a person ID
      );
      done();
    });

  });
});
