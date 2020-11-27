import { HardRedirectService } from './hard-redirect.service';
import { environment } from '../../../environments/environment';
import { TestBed } from '@angular/core/testing';
import { Injectable } from '@angular/core';

const requestOrigin = 'http://dspace-angular-ui.dspace.com';

describe('HardRedirectService', () => {
  let service: TestHardRedirectService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [TestHardRedirectService] });
    service = TestBed.get(TestHardRedirectService);
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
      expect(service.rewriteDownloadURL(testURL)).toEqual(requestOrigin + environment.rest.nameSpace + relativePath);
    });

    afterEach(() => {
      environment.rewriteDownloadUrls = originalValue;
    })
  });
});

@Injectable()
class TestHardRedirectService extends HardRedirectService {
  constructor() {
    super();
  }

  redirect(url: string) {
    return undefined;
  }

  getCurrentRoute() {
    return undefined;
  }

  getRequestOrigin() {
    return requestOrigin;
  }
}
