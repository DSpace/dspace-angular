import { TranslateService } from '@ngx-translate/core';

export function getMockTranslateService(): TranslateService {
  return jasmine.createSpyObj('translateService', {
    get: jasmine.createSpy('get'),
    instant: jasmine.createSpy('instant')
  });
}
