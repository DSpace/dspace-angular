import { XSRFService } from './xsrf.service';
import { HttpClient } from '@angular/common/http';

class XSRFServiceImpl extends XSRFService {
  initXSRFToken(httpClient: HttpClient): () => Promise<any> {
    return () => null;
  }
}

describe(`XSRFService`, () => {
  let service: XSRFService;

  beforeEach(() => {
    service = new XSRFServiceImpl();
  });

  it(`should start with tokenInitialized$.hasValue() === false`, () => {
    expect(service.tokenInitialized$.getValue()).toBeFalse();
  });
});
