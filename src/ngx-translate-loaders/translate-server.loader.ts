import {
  existsSync,
  readFileSync,
} from 'node:fs';
import {
  dirname,
  resolve,
} from 'node:path';

import { TransferState } from '@angular/core';
import { AppConfig } from '@dspace/config/app-config.interface';
import { getDefaultThemeConfig } from '@dspace/config/config.util';
import { TranslateLoader } from '@ngx-translate/core';
import JSON5 from 'json5';
import {
  Observable,
  of,
} from 'rxjs';

import { environment } from '../environments/environment';
import {
  NGX_TRANSLATE_STATE,
  NgxTranslateState,
} from './ngx-translate-state';
import { resolveActiveThemeChain } from './theme-i18n.util';

/**
 * A TranslateLoader for ngx-translate to parse json5 files server-side, and store them in the
 * TransferState.
 *
 * Also overlays per-theme translation overrides from `<themeAssetsRoot>/<theme>/i18n/<lang>.json5`
 * for the active theme and its ancestors (in root → active order), merging them on top of the
 * base translations so the active theme's keys win. Only the active theme's inheritance chain is
 * loaded — sibling themes are excluded to prevent cross-theme key pollution.
 * The resulting merged map is stored in the TransferState so the browser does not need to
 * re-fetch the theme overrides after the initial SSR response.
 */
export class TranslateServerLoader implements TranslateLoader {

  constructor(
    protected transferState: TransferState,
    protected prefix: string = 'dist/assets/i18n/',
    protected suffix: string = '.json',
  ) {
  }

  /**
   * Return the i18n messages for a given language, and store them in the TransferState
   *
   * @param lang the language code
   */
  public getTranslation(lang: string): Observable<any> {
    const translationHash: string = (process.env.languageHashes as any)[lang + '.json5'];
    // Retrieve the base file for the given language and parse it
    const baseMessages = JSON.parse(readFileSync(`${this.prefix}${lang}.${translationHash}${this.suffix}`, 'utf8'));

    // Overlay theme override files (if any). Theme keys override base keys.
    const merged = Object.assign({}, baseMessages, this.readThemeOverrides(lang));

    // Store the parsed messages in the transfer state so they'll be available immediately when
    // the app loads on the client
    this.storeInTransferState(lang, merged);
    // Return the merged messages to translate things server side
    return of(merged);
  }

  /**
   * Read and merge i18n override files for the active theme's inheritance chain.
   * Only the active theme (and its ancestors) are loaded; sibling themes are excluded.
   * Returns an empty object if no overrides are present.
   *
   * @param lang the language code
   * @protected
   */
  protected readThemeOverrides(lang: string): Record<string, string> {
    const configured = environment.themes ?? [];
    if (configured.length === 0) {
      return {};
    }

    // Resolve only the active theme's chain (root ancestor → active theme).
    const activeName = getDefaultThemeConfig(environment as unknown as AppConfig).name;
    const orderedThemes = resolveActiveThemeChain(configured, activeName);

    // `this.prefix` looks like `dist/server/assets/i18n/`. Theme assets live next to `i18n/`
    // at `dist/server/assets/<theme>/i18n/<lang>.json5`.
    const assetsRoot = dirname(this.prefix.replace(/\/$/, ''));

    const overrides: Record<string, string> = {};
    for (const theme of orderedThemes) {
      const filePath = resolve(`${assetsRoot}/${theme}/i18n/${lang}.json5`);
      if (existsSync(filePath)) {
        try {
          const themeMessages = JSON5.parse(readFileSync(filePath, 'utf8')) as Record<string, string>;
          Object.assign(overrides, themeMessages);
        } catch (e) {
          // Skip malformed theme i18n files so they don't break SSR
          // eslint-disable-next-line no-console
          console.warn(`[TranslateServerLoader] Failed to parse theme i18n file ${filePath}:`, e);
        }
      }
    }
    return overrides;
  }

  /**
   * Store the i18n messages for the given language code in the transfer state, so they can be
   * retrieved client side
   *
   * @param lang the language code
   * @param messages the i18n messages
   * @protected
   */
  protected storeInTransferState(lang: string, messages) {
    const prevState = this.transferState.get<NgxTranslateState>(NGX_TRANSLATE_STATE, {});
    const nextState = Object.assign({}, prevState, {
      [lang]: messages,
    });
    this.transferState.set(NGX_TRANSLATE_STATE, nextState);
  }
}
