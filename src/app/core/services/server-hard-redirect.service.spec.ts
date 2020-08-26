import { TestBed } from '@angular/core/testing';
import { ServerHardRedirectService } from './server-hard-redirect.service';

describe('ServerHardRedirectService', () => {

  const mockRequest = jasmine.createSpyObj(['get']);
  const mockResponse = jasmine.createSpyObj(['redirect', 'end']);

  const service: ServerHardRedirectService = new ServerHardRedirectService(mockRequest, mockResponse);

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when performing a redirect', () => {

    const redirect = 'test redirect';

    beforeEach(() => {
      service.redirect(redirect);
    });

    it('should update the response object', () => {
      expect(mockResponse.redirect).toHaveBeenCalledWith(302, redirect);
      expect(mockResponse.end).toHaveBeenCalled();
    })
  });

  describe('when requesting the origin', () => {

    beforeEach(() => {
      mockRequest.protocol = 'test-protocol';
      mockRequest.get.and.callFake((name) => {
        if (name === 'hostname') {
          return 'test-host';
        }
      });
    });

    it('should return the location origin', () => {
      expect(service.getOriginFromUrl()).toEqual('test-protocol://test-host');
    });
  });
});
