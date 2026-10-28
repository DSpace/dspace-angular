import { LangConfig } from '@dspace/config/lang-config.interface';
import { Request } from 'express';

import { LANG_COOKIE } from './locale.service';
import { getSsrCacheKey } from './ssr-cache-key';

describe('getSsrCacheKey', () => {
  const languages: LangConfig[] = [
    { code: 'en', label: 'English', active: true },
    { code: 'de', label: 'Deutsch', active: true },
    { code: 'cs', label: 'Čeština', active: true },
    { code: 'fr', label: 'Français', active: false },
  ];

  function getKey(cookies: Record<string, string> = {}, acceptLanguage?: string, url = '/home'): string {
    const req = { url, cookies, headers: { 'accept-language': acceptLanguage } } as unknown as Request;
    return getSsrCacheKey(req, languages, 'en');
  }

  it('should start with the URL path, so that /reload paths can still be recognized', () => {
    expect(getKey({}, undefined, '/reload/123').startsWith('/reload')).toBeTrue();
  });

  it('should differ for the same URL requested in different languages', () => {
    expect(getKey({ [LANG_COOKIE]: 'de' })).not.toEqual(getKey({ [LANG_COOKIE]: 'cs' }));
    expect(getKey({}, 'de')).not.toEqual(getKey({}, 'cs'));
    expect(getKey({}, 'de')).not.toEqual(getKey());
  });

  it('should be the same for requests resolving to the same language', () => {
    expect(getKey({ [LANG_COOKIE]: 'de' })).toEqual(getKey({}, 'de-DE,de;q=0.9'));
    expect(getKey({ [LANG_COOKIE]: '"de"' })).toEqual(getKey({ [LANG_COOKIE]: 'de' }));
    expect(getKey({}, 'de;q=0.8')).toEqual(getKey({}, 'de'));
  });

  it('should prefer an active language cookie over Accept-Language', () => {
    expect(getKey({ [LANG_COOKIE]: 'cs' }, 'de')).toEqual(getKey({ [LANG_COOKIE]: 'cs' }));
  });

  it('should fall back to the default language key for unsupported or inactive languages', () => {
    const defaultKey = getKey();
    expect(getKey({ [LANG_COOKIE]: 'xx' })).toEqual(defaultKey);
    expect(getKey({ [LANG_COOKIE]: 'fr' })).toEqual(defaultKey);
    expect(getKey({}, 'xx-YY,fr;q=0.9')).toEqual(defaultKey);
  });

  it('should use Accept-Language when the language cookie is not an active language', () => {
    expect(getKey({ [LANG_COOKIE]: 'fr' }, 'de')).toEqual(getKey({}, 'de'));
  });
});
