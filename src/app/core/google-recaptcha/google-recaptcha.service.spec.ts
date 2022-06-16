import { GoogleRecaptchaService } from './google-recaptcha.service';
import { of as observableOf } from 'rxjs';
import { createSuccessfulRemoteDataObject$ } from '../../shared/remote-data.utils';

describe('GoogleRecaptchaService', () => {
  let service: GoogleRecaptchaService;

  let rendererFactory2;
  let configurationDataService;
  let spy: jasmine.Spy;
  let scriptElementMock: any;
  const innerHTMLTestValue = 'mock-script-inner-html';
  const document = { documentElement: { lang: 'en' } } as Document;
  scriptElementMock = {
    set innerHTML(newVal) { /* noop */ },
    get innerHTML() { return innerHTMLTestValue; }
  };

  function init() {
    rendererFactory2 = jasmine.createSpyObj('rendererFactory2', {
      createRenderer: observableOf('googleRecaptchaToken'),
      createElement: scriptElementMock
    });
    configurationDataService = jasmine.createSpyObj('configurationDataService', {
      findByPropertyName: createSuccessfulRemoteDataObject$({ values: ['googleRecaptchaToken'] })
    });
    service = new GoogleRecaptchaService(document, rendererFactory2, configurationDataService);
  }

  beforeEach(() => {
    init();
  });

  describe('getRecaptchaToken', () => {
    let result;

    beforeEach(() => {
      spy = spyOn(service, 'getRecaptchaToken').and.stub();
    });

    it('should send a Request with action', () => {
      service.getRecaptchaToken('test');
      expect(spy).toHaveBeenCalledWith('test');
    });

  });
});
