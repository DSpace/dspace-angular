import { TestBed } from '@angular/core/testing';
import { UrlTree, Router } from '@angular/router';
import { Observable, of as observableOf } from 'rxjs';
import { AuthService } from 'src/app/core/auth/auth.service';
import { AuthorizationDataService } from 'src/app/core/data/feature-authorization/authorization-data.service';
import { FeatureID } from 'src/app/core/data/feature-authorization/feature-id';
import {
  Store,
} from '@ngrx/store';

import { itemPageEditAuthorizationsGuard } from './item-page-edit-authorizations.guard';
import { APP_DATA_SERVICES_MAP } from '../../../config/app-config.interface';
import { TranslateService } from '@ngx-translate/core';
import { getMockTranslateService } from '../../shared/mocks/translate.service.mock';
import {
  dsoPageSingleFeatureGuard
} from '../../core/data/feature-authorization/feature-authorization-guard/dso-page-single-feature.guard';

describe('itemPageEditAuthorizationsGuard', () => {
  let authorizationService: AuthorizationDataService;
  let authService: AuthService;
  let router: Router;
  let route;
  let parentRoute;
  let store: Store;

  beforeEach(() => {

    store = jasmine.createSpyObj('store', {
      dispatch: {},
      pipe: observableOf(true),
    });
    authorizationService = jasmine.createSpyObj('authorizationService', {
      isAuthorized: observableOf(true),
    });
    router = jasmine.createSpyObj('router', {
      parseUrl: {},
    });
    authService = jasmine.createSpyObj('authService', {
      isAuthenticated: observableOf(true),
    });

    parentRoute = {
      params: {
        id: '3e1a5327-dabb-41ff-af93-e6cab9d032f0',
      },
    };
    route = {
      params: {
      },
      parent: parentRoute,
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthorizationDataService, useValue: authorizationService },
        { provide: Router, useValue: router },
        { provide: AuthService, useValue: authService },
        { provide: Store, useValue: store },
        { provide: APP_DATA_SERVICES_MAP, useValue: {} },
        { provide: TranslateService, useValue: getMockTranslateService() },
      ],
    });
  });

  it('should call authorizationService.isAuthorized with the appropriate arguments', (done) => {
    const result$ = TestBed.runInInjectionContext(() => {
      return itemPageEditAuthorizationsGuard(route, { url: 'current-url' } as any);
    }) as Observable<boolean | UrlTree>;

    console.log('will subscribe');
    result$.subscribe((result) => {
      console.log('result inside subscribe:', result);
      expect(authorizationService.isAuthorized).toHaveBeenCalledWith(
        FeatureID.CanManagePolicies,
        'fake-object-url',
        'fake-eperson-uuid',
      );
      done();
    });

  });
});
