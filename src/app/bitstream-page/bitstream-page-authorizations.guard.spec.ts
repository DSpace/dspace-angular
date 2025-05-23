import { TestBed } from '@angular/core/testing';
import {
  Router,
  UrlTree,
} from '@angular/router';
import {
  Observable,
  of,
} from 'rxjs';
import { AuthService } from 'src/app/core/auth/auth.service';
import { AuthorizationDataService } from 'src/app/core/data/feature-authorization/authorization-data.service';
import { FeatureID } from 'src/app/core/data/feature-authorization/feature-id';

import { BitstreamDataService } from '../core/data/bitstream-data.service';
import { Bitstream } from '../core/shared/bitstream.model';
import { createSuccessfulRemoteDataObject$ } from '../shared/remote-data.utils';
import { bitstreamPageAuthorizationsGuard } from './bitstream-page-authorizations.guard';

describe('bitstreamPageAuthorizationsGuard', () => {
  let authorizationService: AuthorizationDataService;
  let authService: AuthService;
  let router: Router;
  let route;
  let parentRoute;
  let bitstreamService: BitstreamDataService;
  let bitstream: Bitstream;
  let uuid = '1234-abcdef-54321-fedcba';
  let bitstreamSelfLink = 'test.url/1234-abcdef-54321-fedcba';

  beforeEach(() => {
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
    bitstream = new Bitstream();
    bitstream.uuid = uuid;
    bitstream._links = { self: { href: bitstreamSelfLink }  } as any;
    bitstreamService = jasmine.createSpyObj('bitstreamService', { findById: createSuccessfulRemoteDataObject$(bitstream) });

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthorizationDataService, useValue: authorizationService },
        { provide: Router, useValue: router },
        { provide: AuthService, useValue: authService },
        { provide: BitstreamDataService, useValue: bitstreamService },
      ],
    });
  });

  it('should call authorizationService.isAuthorized with the appropriate arguments', (done) => {
    const result$ = TestBed.runInInjectionContext(() => {
      return bitstreamPageAuthorizationsGuard(route, { url: 'current-url' } as any);
    }) as Observable<boolean | UrlTree>;

    result$.subscribe((result) => {
      expect(authorizationService.isAuthorized).toHaveBeenCalledWith(
        FeatureID.CanManagePolicies,
        bitstreamSelfLink,
        undefined,
      );
      done();
    });

  });
});
