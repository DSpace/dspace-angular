import { HTTP_INTERCEPTORS } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { of as observableOf } from 'rxjs';

import { RestRequestMethod } from '../data';
import { DspaceRestService } from '@dspace/core';
import { AuthServiceStub } from '../utilities';
import { RouterStub } from '../utilities';
import { AuthInterceptor } from '@dspace/core';
import { AuthService } from '@dspace/core';

describe(`AuthInterceptor`, () => {
  let service: DspaceRestService;
  let httpMock: HttpTestingController;

  const authServiceStub = new AuthServiceStub();
  const store: Store<any> = jasmine.createSpyObj('store', {
    dispatch: {},
    select: observableOf(true),
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        DspaceRestService,
        { provide: AuthService, useValue: authServiceStub },
        { provide: Router, useClass: RouterStub },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: AuthInterceptor,
          multi: true,
        },
        { provide: Store, useValue: store },
      ],
    });

    service = TestBed.inject(DspaceRestService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('when has a valid token', () => {

    it('should not add an Authorization header when we’re sending a HTTP request to \'authn\' endpoint that is not the logout endpoint', () => {
      service.request(RestRequestMethod.POST, 'dspace-spring-rest/api/authn/login', 'password=password&user=user').subscribe((response) => {
        expect(response).toBeTruthy();
      });

      const httpRequest = httpMock.expectOne(`dspace-spring-rest/api/authn/login`);

      const token = httpRequest.request.headers.get('authorization');
      expect(token).toBeNull();
    });
    it('should add an Authorization header when we’re sending a HTTP request to the\'authn/logout\' endpoint', () => {
      service.request(RestRequestMethod.POST, 'dspace-spring-rest/api/authn/logout', 'test').subscribe((response) => {
        expect(response).toBeTruthy();
      });

      const httpRequest = httpMock.expectOne(`dspace-spring-rest/api/authn/logout`);

      expect(httpRequest.request.headers.has('authorization'));
      const token = httpRequest.request.headers.get('authorization');
      expect(token).toBe('Bearer token_test');
    });

    it('should add an Authorization header when we’re sending a HTTP request to a non-\'authn\' endpoint', () => {
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
      service.request(RestRequestMethod.POST, 'dspace-spring-rest/api/submission/workspaceitems', 'password=password&user=user');

      httpMock.expectNone('dspace-spring-rest/api/submission/workspaceitems');
      // HttpTestingController.expectNone will throw an error when a requests is made
      expect().nothing();
    });
  });

});
