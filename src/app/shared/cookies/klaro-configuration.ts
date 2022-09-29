import { TOKENITEM } from '../../core/auth/models/auth-token-info.model';
import { IMPERSONATING_COOKIE, REDIRECT_COOKIE } from '../../core/auth/auth.service';
import { LANG_COOKIE } from '../../core/locale/locale.service';
import { CAPTCHA_COOKIE, CAPTCHA_NAME } from '../../core/google-recaptcha/google-recaptcha.service';

/**
 * Cookie for has_agreed_end_user
 */
export const HAS_AGREED_END_USER = 'dsHasAgreedEndUser';

/**
 * Storage name used to store klaro cookie
 */
export const ANONYMOUS_STORAGE_NAME_KLARO = 'klaro-anonymous';

export const GOOGLE_ANALYTICS_KLARO_KEY = 'google-analytics';

/**
 * Klaro configuration
 * For more information see https://kiprotect.com/docs/klaro/annotated-config
 */
export const klaroConfiguration: any = {
  storageName: ANONYMOUS_STORAGE_NAME_KLARO,

  privacyPolicy: '/info/privacy',

  /*
  Setting 'hideLearnMore' to 'true' will hide the "learn more / customize" link in
  the consent notice. We strongly advise against using this under most
  circumstances, as it keeps the user from customizing their consent choices.
  */
  hideLearnMore: false,

  /*
  Setting 'acceptAll' to 'true' will show an "accept all" button in the notice and
  modal, which will enable all third-party services if the user clicks on it. If set
  to 'false', there will be an "accept" button that will only enable the services that
  are enabled in the consent modal.
  */
  acceptAll: true,

  /*
  You can also set a custom expiration time for the Klaro cookie. By default, it
  will expire after 30 days. Only relevant if 'storageMethod' is set to 'cookie'.
  */
  cookieExpiresAfterDays: 365,

  htmlTexts: true,

  /*
  You can overwrite existing translations and add translations for your app
  descriptions and purposes. See `src/translations/` for a full list of
  translations that can be overwritten:
  https://github.com/KIProtect/klaro/tree/master/src/translations
  */
  translations: {
    en: {
      acceptAll: 'cookies.consent.accept-all',
      acceptSelected: 'cookies.consent.accept-selected',
      app: {
        optOut: {
          description: 'cookies.consent.app.opt-out.description',
          title: 'cookies.consent.app.opt-out.title'
        },
        purpose: 'cookies.consent.app.purpose',
        purposes: 'cookies.consent.app.purposes',
        required: {
          description: 'cookies.consent.app.required.description',
          title: 'cookies.consent.app.required.title'
        }
      },
      close: 'cookies.consent.close',
      decline: 'cookies.consent.decline',
      changeDescription: 'cookies.consent.update',
      consentNotice: {
        description: 'cookies.consent.content-notice.description',
        learnMore: 'cookies.consent.content-notice.learnMore'
      },
      consentModal: {
        description: 'cookies.consent.content-modal.description',
        privacyPolicy: {
          name: 'cookies.consent.content-modal.privacy-policy.name',
          text: 'cookies.consent.content-modal.privacy-policy.text'
        },
        title: 'cookies.consent.content-modal.title'
      },
      purposes: {}
    }
  },
  services: [
    {
      name: 'authentication',
      purposes: ['functional'],
      required: true,
      cookies: [
        TOKENITEM,
        IMPERSONATING_COOKIE,
        REDIRECT_COOKIE
      ]
    },
    {
      name: 'preferences',
      purposes: ['functional'],
      required: true,
      cookies: [
        LANG_COOKIE
      ]
    },
    {
      name: 'acknowledgement',
      purposes: ['functional'],
      required: true,
      cookies: [
        [/^klaro-.+$/],
        HAS_AGREED_END_USER
      ]
    },
    {
      name: GOOGLE_ANALYTICS_KLARO_KEY,
      purposes: ['statistical'],
      required: false,
      cookies: [
        //     /*
        //     you an either only provide a cookie name or regular expression (regex) or a list
        //     consisting of a name or regex, a path and a cookie domain. Providing a path and
        //     domain is necessary if you have services that set cookies for a path that is not
        //     "/", or a domain that is not the current domain. If you do not set these values
        //     properly, the cookie can't be deleted by Klaro, as there is no way to access the
        //     path or domain of a cookie in JS. Notice that it is not possible to delete
        //     cookies that were set on a third-party domain, or cookies that have the HTTPOnly
        //     attribute: https://developer.mozilla.org/en-US/docs/Web/API/Document/cookie#new-
        //     cookie_domain
        //     */
        //
        //     /*
        //     This rule will match cookies that contain the string '_pk_' and that are set on
        //     the path '/' and the domain 'klaro.kiprotect.com'
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
      scripts that would generate new page view events every time Klaro disables and
      re-enables them due to a consent change by the user.
      */
      onlyOnce: true,
    },
    {
      name: CAPTCHA_NAME,
      purposes: ['registration-password-recovery'],
      required: false,
      cookies: [
        [/^klaro-.+$/],
        CAPTCHA_COOKIE
      ],
      onAccept: `window.refreshCaptchaScript?.call()`,
      onDecline: `window.refreshCaptchaScript?.call()`,
      onlyOnce: true,
    }
  ],
};
