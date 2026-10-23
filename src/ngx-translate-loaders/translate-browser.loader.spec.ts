import {
  of,
  throwError,
} from 'rxjs';

import { environment } from '../environments/environment';
import { TranslateBrowserLoader } from './translate-browser.loader';

describe('TranslateBrowserLoader', () => {
  const PREFIX = 'assets/i18n/';
  const SUFFIX = '.json';

  let transferState: { get: jasmine.Spy; set: jasmine.Spy };
  let http: { get: jasmine.Spy };
  let loader: TranslateBrowserLoader;
  let originalThemes: typeof environment.themes;

  /** Match the base i18n request regardless of the production content hash. */
  const isBaseRequest = (url: string): boolean => url.startsWith(`${PREFIX}en`) && url.endsWith(SUFFIX);

  beforeEach(() => {
    transferState = {
      get: jasmine.createSpy('get'),
      set: jasmine.createSpy('set'),
    };
    http = { get: jasmine.createSpy('get') };
    loader = new TranslateBrowserLoader(transferState as any, http as any, PREFIX, SUFFIX);
    originalThemes = environment.themes;
  });

  afterEach(() => {
    environment.themes = originalThemes;
  });

  it('returns the cached translations from the TransferState without any HTTP call', (done) => {
    const cached = { 'home.title': 'Cached' };
    transferState.get.and.returnValue({ en: cached });

    loader.getTranslation('en').subscribe((messages) => {
      expect(messages).toEqual(cached);
      expect(http.get).not.toHaveBeenCalled();
      done();
    });
  });

  it('fetches the base file and merges theme overrides on top (theme keys win)', (done) => {
    environment.themes = [{ name: 'custom' }];
    transferState.get.and.returnValue({});
    http.get.and.callFake((url: string) => {
      if (isBaseRequest(url)) {
        return of(JSON.stringify({ 'home.title': 'Base', 'home.subtitle': 'Base sub' }));
      }
      if (url === 'assets/custom/i18n/en.json5') {
        return of('{ "home.title": "Custom" }');
      }
      return throwError(() => new Error('404'));
    });

    loader.getTranslation('en').subscribe((messages) => {
      expect(messages).toEqual({ 'home.title': 'Custom', 'home.subtitle': 'Base sub' });
      done();
    });
  });

  it('falls back to the base translations when a theme override file is missing', (done) => {
    environment.themes = [{ name: 'custom' }];
    transferState.get.and.returnValue({});
    http.get.and.callFake((url: string) => {
      if (isBaseRequest(url)) {
        return of(JSON.stringify({ 'home.title': 'Base' }));
      }
      return throwError(() => new Error('404'));
    });

    loader.getTranslation('en').subscribe((messages) => {
      expect(messages).toEqual({ 'home.title': 'Base' });
      done();
    });
  });

  it('applies overrides in inheritance order so descendant themes win over ancestors', (done) => {
    environment.themes = [{ name: 'child-theme', extends: 'parent-theme' }, { name: 'parent-theme' }];
    transferState.get.and.returnValue({});
    http.get.and.callFake((url: string) => {
      if (isBaseRequest(url)) {
        return of(JSON.stringify({ key: 'base' }));
      }
      if (url === 'assets/parent-theme/i18n/en.json5') {
        return of('{ key: "parent" }');
      }
      if (url === 'assets/child-theme/i18n/en.json5') {
        return of('{ key: "child" }');
      }
      return throwError(() => new Error('404'));
    });

    loader.getTranslation('en').subscribe((messages) => {
      expect(messages.key).toBe('child');
      done();
    });
  });

  it('returns the base translations unchanged when no themes are configured', (done) => {
    environment.themes = [];
    transferState.get.and.returnValue({});
    http.get.and.callFake((url: string) => {
      if (isBaseRequest(url)) {
        return of(JSON.stringify({ 'home.title': 'Base' }));
      }
      return throwError(() => new Error('404'));
    });

    loader.getTranslation('en').subscribe((messages) => {
      expect(messages).toEqual({ 'home.title': 'Base' });
      done();
    });
  });

  it('does NOT apply sibling theme overrides when the active theme is first in the list', (done) => {
    // Regression: when parent-theme is active, a sibling theme that also extends parent-theme
    // must NOT override parent-theme's translations.
    environment.themes = [
      { name: 'parent-theme' },
      { name: 'sibling-theme', extends: 'parent-theme' },
    ];
    transferState.get.and.returnValue({});
    http.get.and.callFake((url: string) => {
      if (isBaseRequest(url)) {
        return of(JSON.stringify({ key: 'base' }));
      }
      if (url === 'assets/parent-theme/i18n/en.json5') {
        return of('{ key: "parent" }');
      }
      if (url === 'assets/sibling-theme/i18n/en.json5') {
        // sibling has its own value for the same key — must NOT win when parent-theme is active
        return of('{ key: "sibling" }');
      }
      return throwError(() => new Error('404'));
    });

    loader.getTranslation('en').subscribe((messages) => {
      expect(messages.key).toBe('parent');
      done();
    });
  });

  it('applies the full ancestor chain when a child theme is active', (done) => {
    // When child-theme (extends parent-theme) is active, parent-theme keys provide the base
    // and child-theme keys override only what they define.
    environment.themes = [
      { name: 'child-theme', extends: 'parent-theme' },
      { name: 'parent-theme' },
    ];
    transferState.get.and.returnValue({});
    http.get.and.callFake((url: string) => {
      if (isBaseRequest(url)) {
        return of(JSON.stringify({ 'key.a': 'base-a', 'key.b': 'base-b' }));
      }
      if (url === 'assets/parent-theme/i18n/en.json5') {
        return of('{ "key.a": "parent-a" }');
      }
      if (url === 'assets/child-theme/i18n/en.json5') {
        return of('{ "key.b": "child-b" }');
      }
      return throwError(() => new Error('404'));
    });

    loader.getTranslation('en').subscribe((messages) => {
      expect(messages['key.a']).toBe('parent-a');  // inherited from parent-theme
      expect(messages['key.b']).toBe('child-b');   // overridden by child-theme
      done();
    });
  });
});
