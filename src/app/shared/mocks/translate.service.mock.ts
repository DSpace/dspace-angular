import { EventEmitter } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';

export function getMockTranslateService(): TranslateService {
  return jasmine.createSpyObj('translateService', {
    get: jasmine.createSpy('get'),
    use: jasmine.createSpy('use'),
    instant: jasmine.createSpy('instant'),
    setDefaultLang: jasmine.createSpy('setDefaultLang'),
    currentLang: 'en_US',
  });
}

export const translateServiceStub = {
  get: () => of('translated-text'),
  instant: () => 'translated-text',
  onLangChange: new EventEmitter(),
  onTranslationChange: new EventEmitter(),
  onDefaultLangChange: new EventEmitter(),
  currentLang: 'en_US',
};
