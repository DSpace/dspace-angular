import { TOKENITEM } from '../../core/auth/models/auth-token-info.model';
import { IMPERSONATING_COOKIE, REDIRECT_COOKIE } from '../../core/auth/auth.service';
import { LANG_COOKIE } from '../../core/locale/locale.service';
import { HAS_AGREED_END_USER } from './browser-klaro.service';

export const ANONYMOUS_STORAGE_NAME_KLARO = 'klaro-anonymous';

export const klaroConfiguration: any = {
  storageName: ANONYMOUS_STORAGE_NAME_KLARO,

  privacyPolicy: '/info/privacy',

  /*
  Setting 'hideLearnMore' to 'true' will hide the "learn more / customize" link in
  the consent notice. We strongly advise against using this under most
  circumstances, as it keeps the user from customizing his/her consent choices.
  */
  hideLearnMore: false,

  /*
  Setting 'acceptAll' to 'true' will show an "accept all" button in the notice and
  modal, which will enable all third-party apps if the user clicks on it. If set
  to 'false', there will be an "accept" button that will only enable the apps that
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
  apps: [
    {
      name: 'token_item',
      purposes: ['authentication'],
      required: true,
      cookies: [
        TOKENITEM
      ]
    },
    {
      name: 'impersonation',
      purposes: ['authentication'],
      required: true,
      cookies: [
        IMPERSONATING_COOKIE
      ]
    },
    {
      name: 'redirect',
      purposes: ['authentication'],
      required: true,
      cookies: [
        REDIRECT_COOKIE
      ]
    },
    {
      name: 'language',
      purposes: ['preferences'],
      required: true,
      cookies: [
        LANG_COOKIE
      ]
    },
    {
      name: 'klaro',
      purposes: ['acknowledgement'],
      required: true,
      cookies: [
        [/^klaro-.+$/],
      ]
    },
    {
      name: 'has_agreed_end_user',
      purposes: ['acknowledgement'],
      required: true,
      cookies: [
        HAS_AGREED_END_USER
      ]
    },
    {
      name: 'google-analytics',
      purposes: ['statistics'],
      required: false,
      cookies: [
        //     /*
        //     you an either only provide a cookie name or regular expression (regex) or a list
        //     consisting of a name or regex, a path and a cookie domain. Providing a path and
        //     domain is necessary if you have apps that set cookies for a path that is not
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
  ],
};
