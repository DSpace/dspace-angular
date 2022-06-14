import { GoogleRecaptchaService } from './google-recaptcha.service';
import { of as observableOf } from 'rxjs';

describe('GoogleRecaptchaService', () => {
  let service: GoogleRecaptchaService;

  let reCaptchaV3Service;

  function init() {
    reCaptchaV3Service = jasmine.createSpyObj('reCaptchaV3Service', {
      execute: observableOf('googleRecaptchaToken')
    });
    service = new GoogleRecaptchaService(reCaptchaV3Service);
  }

  beforeEach(() => {
    init();
  });

  describe('getRecaptchaToken', () => {
    let result;

    beforeEach(() => {
      result = service.getRecaptchaToken('test');
    });

    it('should send a Request with action', () => {
      expect(reCaptchaV3Service.execute).toHaveBeenCalledWith('test');
    });

  });
});
