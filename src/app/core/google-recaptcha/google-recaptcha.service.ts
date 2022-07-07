import { Inject, Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { getFirstCompletedRemoteData } from '../shared/operators';
import { ConfigurationProperty } from '../shared/configuration-property.model';
import { isNotEmpty } from '../../shared/empty.util';
import { DOCUMENT } from '@angular/common';
import { ConfigurationDataService } from '../data/configuration-data.service';
import { RemoteData } from '../data/remote-data';
import { map } from 'rxjs/operators';
import { combineLatest } from 'rxjs';

/**
 * A GoogleRecaptchaService used to send action and get a token from REST
 */
@Injectable()
export class GoogleRecaptchaService {

  private renderer: Renderer2;
  /**
   * A Google Recaptcha site key
   */
  captchaSiteKey: string;

  constructor(
    @Inject(DOCUMENT) private _document: Document,
    rendererFactory: RendererFactory2,
    private configService: ConfigurationDataService,
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
    const registrationVerification$ = this.configService.findByPropertyName('registration.verification.enabled').pipe(
      getFirstCompletedRemoteData(),
      map((res: RemoteData<ConfigurationProperty>) => {
        return res.hasSucceeded && res.payload && isNotEmpty(res.payload.values) && res.payload.values[0].toLowerCase() === 'true';
      })
    );
    const recaptchaKey$ = this.configService.findByPropertyName('google.recaptcha.key.site').pipe(
      getFirstCompletedRemoteData(),
    );
    combineLatest(registrationVerification$, recaptchaKey$).subscribe(([registrationVerification, recaptchaKey]) => {
      if (registrationVerification) {
        if (recaptchaKey.hasSucceeded && isNotEmpty(recaptchaKey?.payload?.values[0])) {
          this.captchaSiteKey = recaptchaKey?.payload?.values[0];
          this.loadScript(this.buildCaptchaUrl(recaptchaKey?.payload?.values[0]));
        }
      }
    });
  }

  /**
   * Returns an observable of string
   * @param action action is the process type in which used to protect multiple spam REST calls
   */
  public async getRecaptchaToken (action) {
    return await grecaptcha.execute(this.captchaSiteKey, {action: action});
  }

  /**
   * Return the google captcha ur with google captchas api key
   *
   * @param key contains a secret key of a google captchas
   * @returns string which has google captcha url with google captchas key
   */
  buildCaptchaUrl(key: string) {
    return `https://www.google.com/recaptcha/api.js?render=${key}`;
  }

  /**
   * Append the google captchas script to the document
   *
   * @param url contains a script url which will be loaded into page
   * @returns A promise
   */
  private loadScript(url) {
    return new Promise((resolve, reject) => {
      const script = this.renderer.createElement('script');
      script.type = 'text/javascript';
      script.src = url;
      script.text = ``;
      script.onload = resolve;
      script.onerror = reject;
      this.renderer.appendChild(this._document.head, script);
    });
  }

}
