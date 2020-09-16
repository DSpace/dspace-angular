import { HardRedirectService } from './hard-redirect.service';
import { environment } from '../../../environments/environment';
import { TestBed } from '@angular/core/testing';

const requestOrigin = 'http://dspace-angular-ui.dspace.com';

fdescribe('HardRedirectService', () => {
  const service: TestHardRedirectService = new TestHardRedirectService();

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  describe('when calling rewriteDownloadURL', () => {
    let originalValue;
    const relativePath = '/test/url/path';
    const testURL = environment.rest.baseUrl + relativePath;
    beforeEach(() => {
      originalValue = environment.rewriteDownloadUrls;
    });

    it('it should return the same url when rewriteDownloadURL is false', () => {
      environment.rewriteDownloadUrls = false;
      expect(service.rewriteDownloadURL(testURL)).toEqual(testURL);
    });

    it('it should replace part of the url when rewriteDownloadURL is true', () => {
      environment.rewriteDownloadUrls = true;
      expect(service.rewriteDownloadURL(testURL)).toEqual(requestOrigin + relativePath);
    });

    afterEach(() => {
      environment.rewriteDownloadUrls = originalValue;
    })
  });

});

class TestHardRedirectService extends HardRedirectService {
  constructor() {

  }
  redirect(url: string) {
  }

  getCurrentRoute() {
    return undefined;
  }

  getRequestOrigin() {
    return requestOrigin;
  }
}
