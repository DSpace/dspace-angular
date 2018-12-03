import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController, } from '@angular/common/http/testing';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { Router } from '@angular/router';

import { Store } from '@ngrx/store';
import { of as observableOf } from 'rxjs';

import { AuthInterceptor } from './auth.interceptor';
import { AuthService } from './auth.service';
import { DSpaceRESTv2Service } from '../dspace-rest-v2/dspace-rest-v2.service';
import { RouterStub } from '../../shared/testing/router-stub';
import { TruncatablesState } from '../../shared/truncatable/truncatable.reducer';
import { AuthServiceStub } from '../../shared/testing/auth-service-stub';
import { RestRequestMethod } from '../data/rest-request-method';

describe(`AuthInterceptor`, () => {
  let service: DSpaceRESTv2Service;
  let httpMock: HttpTestingController;

  const authServiceStub = new AuthServiceStub();
  const store: Store<TruncatablesState> = jasmine.createSpyObj('store', {
    /* tslint:disable:no-empty */
    dispatch: {},
    /* tslint:enable:no-empty */
    select: observableOf(true)
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        DSpaceRESTv2Service,
        {provide: AuthService, useValue: authServiceStub},
        {provide: Router, useClass: RouterStub},
        {
          provide: HTTP_INTERCEPTORS,
          useClass: AuthInterceptor,
          multi: true,
        },
        {provide: Store, useValue: store},
      ],
    });

    service = TestBed.get(DSpaceRESTv2Service);
    httpMock = TestBed.get(HttpTestingController);
  });

  describe('when has a valid token', () => {

    it('should not add an Authorization header when we’re sending a HTTP request to \'authn\' endpoint', () => {
      service.request(RestRequestMethod.POST, 'dspace-spring-rest/api/authn/login', 'password=password&user=user').subscribe((response) => {
        expect(response).toBeTruthy();
      });

      const httpRequest = httpMock.expectOne(`dspace-spring-rest/api/authn/login`);

      const token = httpRequest.request.headers.get('authorization');
      expect(token).toBeNull();
    });

    it('should add an Authorization header when we’re sending a HTTP request to \'authn\' endpoint', () => {
      service.request(RestRequestMethod.POST, 'dspace-spring-rest/api/submission/workspaceitems', 'test').subscribe((response) => {
        expect(response).toBeTruthy();
      });

      const httpRequest = httpMock.expectOne(`dspace-spring-rest/api/submission/workspaceitems`);

      expect(httpRequest.request.headers.has('authorization'));
      const token = httpRequest.request.headers.get('authorization');
      expect(token).toBe('Bearer token_test');
    });

  });

  describe('when has an expired token', () => {

    beforeEach(() => {
      authServiceStub.setTokenAsExpired();
    });

    afterEach(() => {
      authServiceStub.setTokenAsNotExpired();
    });

    it('should redirect to login', () => {

      service.request(RestRequestMethod.POST, 'dspace-spring-rest/api/submission/workspaceitems', 'password=password&user=user').subscribe((response) => {
        expect(response).toBeTruthy();
      });

      service.request(RestRequestMethod.POST, 'dspace-spring-rest/api/submission/workspaceitems', 'password=password&user=user');

      httpMock.expectNone('dspace-spring-rest/api/submission/workspaceitems');
    });
  })

});
