import { HttpClient } from '@angular/common/http';
import { TransferState } from '@angular/core';
import { AppConfig } from '@dspace/config/app-config.interface';
import { getDefaultThemeConfig } from '@dspace/config/config.util';
import { hasValue } from '@dspace/shared/utils/empty.util';
import { TranslateLoader } from '@ngx-translate/core';
import JSON5 from 'json5';
import {
  forkJoin,
  Observable,
  of,
} from 'rxjs';
import {
  catchError,
  map,
} from 'rxjs/operators';

import { environment } from '../environments/environment';
import {
  NGX_TRANSLATE_STATE,
  NgxTranslateState,
} from './ngx-translate-state';
import { resolveActiveThemeChain } from './theme-i18n.util';

/**
 * A TranslateLoader for ngx-translate to retrieve i18n messages from the TransferState, or download
 * them if they're not available there.
 *
 * Also fetches per-theme translation overrides from `assets/<theme>/i18n/<lang>.json5` for the
 * active theme and its ancestors (root → active), merging them on top of the base translations
 * so the active theme's keys win. Only the active theme's inheritance chain is loaded — sibling
 * themes are excluded to prevent cross-theme key pollution.
 * This removes the need for the build-time `merge-i18n` script, allowing a single Docker image
 * to serve multiple customers with their own theme-specific translations.
 */
export class TranslateBrowserLoader implements TranslateLoader {
  constructor(
    protected transferState: TransferState,
    protected http: HttpClient,
    protected prefix?: string,
    protected suffix?: string,
  ) {
  }

  /**
   * Return the i18n messages for a given language, first try to find them in the TransferState
   * retrieve them using HttpClient if they're not available there
   *
   * @param lang the language code
   */
  getTranslation(lang: string): Observable<any> {
    // Get the ngx-translate messages from the transfer state, to speed up the initial page load
    // client side. The server has already merged theme overrides into this state.
    const state = this.transferState.get<NgxTranslateState>(NGX_TRANSLATE_STATE, {});
    const messages = state[lang];
    if (hasValue(messages)) {
      return of(messages);
    }

    // Fetch base translations + the active theme's override files (root ancestor → active theme).
    // Only the active theme's inheritance chain is loaded; sibling themes are excluded.
    const base$ = this.fetchBase(lang);
    const activeName = getDefaultThemeConfig(environment as unknown as AppConfig).name;
    const orderedThemes = resolveActiveThemeChain(environment.themes ?? [], activeName);
    const themeStreams = orderedThemes.map((name: string) => this.fetchThemeOverride(name, lang));

    return forkJoin([base$, ...themeStreams]).pipe(
      map((parts) => parts.reduce((acc, part) => Object.assign(acc, part), {})),
    );
  }

  /**
   * Fetch the base i18n file (the hashed JSON produced by the build pipeline).
   */
  protected fetchBase(lang: string): Observable<Record<string, string>> {
    const translationHash: string = environment.production
      ? `.${(process.env.languageHashes as any)[lang + '.json5']}`
      : '';
    return this.http.get(`${this.prefix}${lang}${translationHash}${this.suffix}`, { responseType: 'text' }).pipe(
      map((json: any) => JSON.parse(json)),
      catchError(() => of({})),
    );
  }

  /**
   * Fetch the override JSON5 file for the given theme/language.
   * Returns an empty object if the file is missing (most themes won't override every language).
   */
  protected fetchThemeOverride(themeName: string, lang: string): Observable<Record<string, string>> {
    return this.http.get(`assets/${themeName}/i18n/${lang}.json5`, { responseType: 'text' }).pipe(
      map((text: string) => JSON5.parse(text) as Record<string, string>),
      catchError(() => of({})),
    );
  }
}
