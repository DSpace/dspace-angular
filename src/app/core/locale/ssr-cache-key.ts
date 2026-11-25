import { LangConfig } from '@dspace/config/lang-config.interface';
import { Request } from 'express';

import { LANG_COOKIE } from './locale.service';

/**
 * Create the key of a server-side rendered page in the SSR caches (see server.ts).
 * The key is the URL path (including any querystring params) followed by the language the page is rendered in,
 * e.g. "/home|en" or "/search?query=test|de". Without the language, a page rendered in one language would be
 * served from the cache to visitors who asked for another one.
 * @param req current request
 * @param languages configured languages
 * @param fallbackLanguage language to render in when the request asks for no active language
 * @returns cache key to use for this page
 */
export function getSsrCacheKey(req: Request, languages: LangConfig[], fallbackLanguage: string): string {
  // NOTE: req.url is the URL path *without* any baseUrl. Language codes contain no '|', so keys are unambiguous.
  return `${req.url}|${getSsrLanguage(req, languages, fallbackLanguage)}`;
}

/**
 * Get the language an anonymous SSR request is rendered in. The resolved language is used rather than the raw
 * Accept-Language header, so that header variants asking for the same language share one cache entry.
 * This mirrors LocaleService.getCurrentLanguageCode() with ServerLocaleService.getLanguageCodeList()
 * and must stay in sync with them, otherwise a page could be cached under the wrong language:
 * an active language from the language cookie, else the first Accept-Language entry that is an active language,
 * else the fallback language.
 */
function getSsrLanguage(req: Request, languages: LangConfig[], fallbackLanguage: string): string {
  const activeCodes = languages.filter((lang: LangConfig) => lang.active).map((lang: LangConfig) => lang.code);

  let cookieLang = req.cookies?.[LANG_COOKIE];
  try {
    // Same parsing as ServerCookieService.get()
    cookieLang = JSON.parse(cookieLang);
  } catch {
    // not JSON, keep the raw value
  }
  if (activeCodes.includes(cookieLang)) {
    return cookieLang;
  }

  // Like ServerLocaleService, entries are not trimmed and only the part before ';' is compared.
  return req.headers['accept-language']?.split(',')
    .map((browserLang: string) => browserLang.split(';')[0])
    .find((browserLang: string) => activeCodes.some((code: string) => code.toLowerCase() === browserLang.toLowerCase()))
    || fallbackLanguage;
}
