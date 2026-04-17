import { ACCESSIBILITY_COOKIE } from '../../accessibility/accessibility-settings.service';
import {
  IMPERSONATING_COOKIE,
  REDIRECT_COOKIE,
} from '../../core/auth/auth.service';
import { TOKENITEM } from '../../core/auth/models/auth-token-info.model';
import {
  CAPTCHA_COOKIE,
  CAPTCHA_NAME,
} from '../../core/google-recaptcha/google-recaptcha.service';
import { LANG_COOKIE } from '../../core/locale/locale.service';
import { NativeWindowRef } from '../../core/services/window.service';

/**
 * Cookie for has_agreed_end_user
 */
export const HAS_AGREED_END_USER = 'dsHasAgreedEndUser';

export const ANONYMOUS_STORAGE_NAME_OREJIME = 'orejime-anonymous';

export const GOOGLE_ANALYTICS_OREJIME_KEY = 'google-analytics';

export const MATOMO_OREJIME_KEY = 'matomo';

export const MATOMO_COOKIE = 'dsMatomo';

export const CORRELATION_ID_OREJIME_KEY = 'correlation-id';

export const CORRELATION_ID_COOKIE = 'CORRELATION-ID';

/**
 * Orejime configuration
 * For more information see https://github.com/empreinte-digitale/orejime
 */

export function getOrejimeConfiguration(_window: NativeWindowRef): any {
  return {
    cookieName: ANONYMOUS_STORAGE_NAME_OREJIME,

    privacyPolicy: './info/privacy',

    // Optional. You can set a custom expiration time for the Orejime cookie, in days.
    // defaults to 365.
    cookieExpiresAfterDays: 365,

    /*
    We need to explicitly enable the 'zz' language, where all translations are set, because Orejime's default is 'en'.
     */
    lang: 'zz',

    /*
    The appElement selector is used by Orejime to determine where to insert the consent
     */
    appElement: 'ds-app',

    stringifyCookie: (contents: any) => {
      return (typeof contents === 'string') ? contents : JSON.stringify(contents);
    },

    parseCookie: (cookie: string) => {
      if (typeof cookie === 'string') {
        cookie = decodeURIComponent(cookie);
        return JSON.parse(cookie);
      }
      return cookie;
    },

    /*
    You can overwrite existing translations and add translations for your app
    descriptions and purposes. See `src/translations/` for a full list of
    translations that can be overwritten:
    https://github.com/empreinte-digitale/orejime/blob/master/src/translations/en.yml
    */
    translations: {
      /*
        The `zz` key contains default translations that will be used as fallback values.
        This can e.g. be useful for defining a fallback privacy policy URL.
        FOR DSPACE: We use 'zz' to map to our own i18n translations for orejime, see
        translateConfiguration() in browser-orejime.service.ts. All the below i18n keys are specified
        in your /src/assets/i18n/*.json5 translation pack.
      */
      zz: {
        acceptAll: 'cookies.consent.accept-all',
        acceptSelected: 'cookies.consent.accept-selected',
        close: 'cookies.consent.close',
        consentModal: {
          title: 'cookies.consent.content-modal.title',
          description: 'cookies.consent.content-modal.description',
          privacyPolicy: {
            name: 'cookies.consent.content-modal.privacy-policy.name',
            text: 'cookies.consent.content-modal.privacy-policy.text',
          },
        },
        consentNotice: {
          changeDescription: 'cookies.consent.update',
          description: 'cookies.consent.content-notice.description',
          learnMore: 'cookies.consent.content-notice.learnMore',
        },
        decline: 'cookies.consent.decline',
        declineAll: 'cookies.consent.decline-all',
        accept: 'cookies.consent.ok',
        save: 'cookies.consent.save',
        purposes: {},
        app: {
          optOut: {
            description: 'cookies.consent.app.opt-out.description',
            title: 'cookies.consent.app.opt-out.title',
          },
          purpose: 'cookies.consent.app.purpose',
          purposes: 'cookies.consent.app.purposes',
          required: {
            title: 'cookies.consent.app.required.title',
            description: 'cookies.consent.app.required.description',
          },
        },
      },
    },
    apps: [
      {
        name: 'authentication',
        purposes: ['functional'],
        required: true,
        optOut: true,
        cookies: [
          TOKENITEM,
          IMPERSONATING_COOKIE,
          REDIRECT_COOKIE,
        ],
      },
      {
        name: 'preferences',
        purposes: ['functional'],
        required: true,
        optOut: true,
        cookies: [
          LANG_COOKIE,
        ],
      },
      {
        name: 'acknowledgement',
        purposes: ['functional'],
        required: true,
        optOut: true,
        cookies: [
          [/^orejime-.+$/],
          HAS_AGREED_END_USER,
        ],
      },
      {
        name: CORRELATION_ID_OREJIME_KEY,
        purposes: ['statistical'],
        required: false,
        cookies: [
          CORRELATION_ID_COOKIE,
        ],
        callback: () => {
          _window?.nativeWindow.initCorrelationId();
        },
      },
      {
        name: MATOMO_OREJIME_KEY,
        purposes: ['statistical'],
        required: false,
        cookies: [
          MATOMO_COOKIE,
        ],
        callback: (consent: boolean) => {
          _window?.nativeWindow.changeMatomoConsent(consent);
        },
      },
      {
        name: GOOGLE_ANALYTICS_OREJIME_KEY,
        purposes: ['statistical'],
        required: false,
        cookies: [
          //     /*
          //     you an either only provide a cookie name or regular expression (regex) or a list
          //     consisting of a name or regex, a path and a cookie domain. Providing a path and
          //     domain is necessary if you have services that set cookies for a path that is not
          //     "/", or a domain that is not the current domain. If you do not set these values
          //     properly, the cookie can't be deleted by Orejime, as there is no way to access the
          //     path or domain of a cookie in JS. Notice that it is not possible to delete
          //     cookies that were set on a third-party domain, or cookies that have the HTTPOnly
          //     attribute: https://developer.mozilla.org/en-US/docs/Web/API/Document/cookie#new-
          //     cookie_domain
          //     */
          //
          //     /*
          //     This rule will match cookies that contain the string '_pk_' and that are set on
          //     the path '/' and the domain 'orejime.kiprotect.com'
          //     */
          [/^_ga.?$/],
          [/^_gid$/],
          //
          //     /*
          //     Same as above, only for the 'localhost' domain
          //     */
          //     [/^_pk_.*$/, '/', 'localhost'],
          //
          //     /*
          //     This rule will match all cookies named 'piwik_ignore' that are set on the path
          //     '/' on the current domain
          //     */
          //     'piwik_ignore',
        ],
        /*
        If 'onlyOnce' is set to 'true', the app will only be executed once regardless
        how often the user toggles it on and off. This is relevant e.g. for tracking
        scripts that would generate new page view events every time Orejime disables and
        re-enables them due to a consent change by the user.
        */
        onlyOnce: true,
      },
      {
        name: CAPTCHA_NAME,
        purposes: ['registration-password-recovery'],
        required: false,
        cookies: [
          CAPTCHA_COOKIE,
        ],
        callback: (consent: boolean) => {
          _window?.nativeWindow.refreshCaptchaScript?.call();
        },
        onlyOnce: true,
      },
      {
        name: 'accessibility',
        purposes: ['functional'],
        required: false,
        cookies: [ACCESSIBILITY_COOKIE],
        onlyOnce: false,
      },
    ],
  };
}
