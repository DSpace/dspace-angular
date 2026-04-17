import { HttpHeaders } from '@angular/common/http';
import { of } from 'rxjs';

import { RequestCopyEmail } from '../../request-copy/email-request-copy/request-copy-email.model';
import { MockBitstream1 } from '../../shared/mocks/item.mock';
import { createSuccessfulRemoteDataObject$ } from '../../shared/remote-data.utils';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { ConfigurationProperty } from '../shared/configuration-property.model';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { ItemRequest } from '../shared/item-request.model';
import { ConfigurationDataService } from './configuration-data.service';
import { AuthorizationDataService } from './feature-authorization/authorization-data.service';
import { FeatureID } from './feature-authorization/feature-id';
import { FindListOptions } from './find-list-options.model';
import { ItemRequestDataService } from './item-request-data.service';
import { PostRequest } from './request.models';
import { RequestService } from './request.service';
import { RestRequestMethod } from './rest-request-method';

describe('ItemRequestDataService', () => {
  let service: ItemRequestDataService;

  let requestService: RequestService;
  let rdbService: RemoteDataBuildService;
  let halService: HALEndpointService;
  let configService: ConfigurationDataService;
  let authorizationDataService: AuthorizationDataService;

  const restApiEndpoint = 'rest/api/endpoint/';
  const requestId = 'request-id';
  let itemRequest: ItemRequest;

  beforeEach(() => {
    configService = jasmine.createSpyObj('ConfigurationDataService', ['findByPropertyName']);
    (configService.findByPropertyName as jasmine.Spy).and.callFake((propertyName: string) => {
      switch (propertyName) {
        case 'request.item.create.captcha':
          return createSuccessfulRemoteDataObject$(Object.assign(new ConfigurationProperty(), {
            name: 'request.item.create.captcha',
            values: ['true'],
          }));
        case 'request.item.grant.link.period':
          return createSuccessfulRemoteDataObject$(Object.assign(new ConfigurationProperty(), {
            name: 'request.item.grant.link.period',
            values: ['FOREVER', '+1DAY', '+1MONTH'],
          }));
        default:
          return createSuccessfulRemoteDataObject$(new ConfigurationProperty());
      }
    });


    authorizationDataService = jasmine.createSpyObj('authorizationService', {
      isAuthorized: of(false),
    });
    itemRequest = Object.assign(new ItemRequest(), {
      token: 'item-request-token',
    });
    requestService = jasmine.createSpyObj('requestService', {
      generateRequestId: requestId,
      send: '',
    });
    rdbService = jasmine.createSpyObj('rdbService', {
      buildFromRequestUUID: createSuccessfulRemoteDataObject$(itemRequest),
    });
    halService = jasmine.createSpyObj('halService', {
      getEndpoint: of(restApiEndpoint),
    });

    service = new ItemRequestDataService(requestService, rdbService, null, halService, configService, authorizationDataService);
  });

  describe('searchBy', () => {
    it('should use searchData to perform search operations', () => {
      const searchMethod = 'testMethod';
      const options = new FindListOptions();

      const searchDataSpy = spyOn((service as any).searchData, 'searchBy').and.returnValue(of(null));

      service.searchBy(searchMethod, options);

      expect(searchDataSpy).toHaveBeenCalledWith(
        searchMethod,
        options,
        undefined,
        undefined,
      );
    });
  });

  describe('requestACopy', () => {
    it('should send a POST request containing the provided item request', (done) => {
      const captchaPayload = 'payload';
      service.requestACopy(itemRequest, captchaPayload).subscribe(() => {
        expect(requestService.send).toHaveBeenCalledWith(
          new PostRequest(
            requestId,
            restApiEndpoint,
            itemRequest,
            {
              headers: new HttpHeaders().set('x-captcha-payload', captchaPayload),
            },
          ),
          false,
        );
        done();
      });
    });
  });

  describe('grant', () => {
    let email: RequestCopyEmail;

    beforeEach(() => {
      email = new RequestCopyEmail('subject', 'message');
    });

    it('should send a PUT request containing the correct properties', (done) => {
      service.grant(itemRequest.token, email, true, '+1DAY').subscribe(() => {
        expect(requestService.send).toHaveBeenCalledWith(jasmine.objectContaining({
          method: RestRequestMethod.PUT,
          href: `${restApiEndpoint}/${itemRequest.token}`,
          body: JSON.stringify({
            acceptRequest: true,
            responseMessage: email.message,
            subject: email.subject,
            suggestOpenAccess: true,
            accessPeriod: '+1DAY',
          }),
          options: jasmine.objectContaining({
            headers: jasmine.any(HttpHeaders),
          }),
        }));
        done();
      });
    });
  });

  describe('deny', () => {
    let email: RequestCopyEmail;

    beforeEach(() => {
      email = new RequestCopyEmail('subject', 'message');
    });

    it('should send a PUT request containing the correct properties', (done) => {
      service.deny(itemRequest.token, email).subscribe(() => {
        expect(requestService.send).toHaveBeenCalledWith(jasmine.objectContaining({
          method: RestRequestMethod.PUT,
          href: `${restApiEndpoint}/${itemRequest.token}`,
          body: JSON.stringify({
            acceptRequest: false,
            responseMessage: email.message,
            subject: email.subject,
            suggestOpenAccess: false,
            accessPeriod: null,
          }),
          options: jasmine.objectContaining({
            headers: jasmine.any(HttpHeaders),
          }),
        }));
        done();
      });
    });
  });

  describe('requestACopy', () => {
    it('should send a POST request containing the provided item request', (done) => {
      const captchaPayload = 'payload';
      service.requestACopy(itemRequest, captchaPayload).subscribe(() => {
        expect(requestService.send).toHaveBeenCalledWith(
          new PostRequest(
            requestId,
            restApiEndpoint,
            itemRequest,
            {
              headers: new HttpHeaders().set('x-captcha-payload', captchaPayload),
            },
          ),
          false,
        );
        done();
      });
    });
  });

  describe('getConfiguredAccessPeriods', () => {
    it('should return parsed integer values from config', () => {
      service.getConfiguredAccessPeriods().subscribe(periods => {
        expect(periods).toEqual(['FOREVER', '+1DAY', '+1MONTH']);
      });
    });
  });
  describe('isProtectedByCaptcha', () => {
    it('should return true when config value is "true"', () => {
      const mockConfigProperty = {
        name: 'request.item.create.captcha',
        values: ['true'],
      } as ConfigurationProperty;
      service.isProtectedByCaptcha().subscribe(result => {
        expect(result).toBe(true);
      });
    });
  });

  describe('canDownload', () => {
    it('should check authorization for bitstream download', () => {
      service.canDownload(MockBitstream1).subscribe(result => {
        expect(authorizationDataService.isAuthorized).toHaveBeenCalledWith(FeatureID.CanDownload, MockBitstream1.self);
        expect(result).toBe(false);
      });
    });
  });


});
