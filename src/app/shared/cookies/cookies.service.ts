import { Injectable } from '@angular/core';
import * as Klaro from 'klaro'
import { BehaviorSubject } from 'rxjs';
import { TOKENITEM } from '../../core/auth/models/auth-token-info.model';
import { IMPERSONATING_COOKIE, REDIRECT_COOKIE } from '../../core/auth/auth.service';
import { LANG_COOKIE } from '../../core/locale/locale.service';
import { TranslateService } from '@ngx-translate/core';

export const HAS_AGREED_END_USER = 'hasAgreedEndUser';
export const KLARO = 'klaro';

const cookieNameMessagePrefix = 'cookies.consent.app.title.';
const cookieDescriptionMessagePrefix = 'cookies.consent.app.description.';
const cookiePurposeMessagePrefix = 'cookies.consent.purpose.';

@Injectable({
  providedIn: 'root'
})

export class CookiesService {

  message$: BehaviorSubject<string> = new BehaviorSubject<string>('');

  klaroConfig = {
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

    htmlText: true,

    /*
    You can overwrite existing translations and add translations for your app
    descriptions and purposes. See `src/translations/` for a full list of
    translations that can be overwritten:
    https://github.com/KIProtect/klaro/tree/master/src/translations
    */
    translations: {
      en: {
        consentNotice: {
          description: 'We collect and process your personal information for the following purposes: {purposes}.<br>To learn more, please read our {privacyPolicy}'
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
          KLARO
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
        You can define an optional callback function that will be called each time the
        consent state for the given app changes. The consent value will be passed as the
        first parameter to the function (true=consented). The `app` config will be
        passed as the second parameter.
        */
        callback: (consent, app) => {
          this.message$.next('User consent for app ' + app.name + ': consent=' + consent);
        },
        /*
        If 'onlyOnce' is set to 'true', the app will only be executed once regardless
        how often the user toggles it on and off. This is relevant e.g. for tracking
        scripts that would generate new page view events every time Klaro disables and
        re-enables them due to a consent change by the user.
        */
        onlyOnce: true,
      },
    ]
  };

  constructor(private translateService: TranslateService) {
  }

  initialize() {
    this.klaroConfig.apps.forEach((app) => {
      this.klaroConfig.translations.en[app.name] = { title: this.getTitleTranslation(app.name), description: this.getDescriptionTranslation(app.name) };
      app.purposes.forEach((purpose) => {
        this.klaroConfig.translations.en.purposes[purpose] = this.getPurposeTranslation(purpose);
      })
    });

    Klaro.show(this.klaroConfig);
  }

  private getTitleTranslation(title: string) {
    return this.translateService.instant(cookieNameMessagePrefix + title);
  }

  private getDescriptionTranslation(description: string) {
    return this.translateService.instant(cookieDescriptionMessagePrefix + description);
  }

  private getPurposeTranslation(purpose: string) {
    return this.translateService.instant(cookiePurposeMessagePrefix + purpose);
  }
}
