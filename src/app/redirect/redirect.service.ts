import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ActivatedRouteSnapshot, CanActivate, NavigationExtras, Router } from '@angular/router';
import { APP_CONFIG, AppConfig } from '../../config/app-config.interface';

export const LOCAL_PROTOCOL = 'local://';

export interface RedirectionExtras extends NavigationExtras {
  target?: string;
}

@Injectable({
  providedIn: 'root'
})
export class RedirectService implements CanActivate {

  private REGEX_URL = /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;

  constructor(
    readonly router: Router,
    @Inject(DOCUMENT) readonly document: Document,
    @Inject(APP_CONFIG) readonly appConfig: AppConfig
  ) {
  }

  /** The Window object from Document defaultView */
  get window(): Window {
    return this.document.defaultView;
  }

  /** Jumps instantly to the external link without the mediation of the router */
  public jump(url: string, target: string = '_blank'): Promise<boolean> {

    return new Promise<boolean>((resolve, reject) => {

      try {
        resolve(!!this.window.open(url, target));
      } catch (e) {
        reject(e);
      }
    });
  }

  /** Returns true if the given url looks external */
  public external(url: string): boolean {
    return !(
      !this.REGEX_URL.test(url) ||
      url.startsWith(this.appConfig.ui.baseUrl) ||
      url.startsWith(LOCAL_PROTOCOL)
    );
  }

  /** Redirects to the specified external link with the mediation of the router */
  public redirect(url: string, extras?: RedirectionExtras): Promise<boolean> {

    // Extracts the target from the extras
    const target = extras && extras.target;
    // Compose the url link for redirection
    const link = '/redirect?url=' + encodeURIComponent(url) + (!!target ? '&=' + target : '');
    // Navigates with the router activat the redirection guard
    return this.router.navigateByUrl(link, extras);
  }

  /** Navigates to the given url, redirecting when necessary
   * @param url An absolute URL. The function does not apply any delta to the current URL.
   * When starting with 'http(s)://' triggers the external redirection.
   * @param extras (optional). An object containing properties that modify the navigation strategy.
   * The function ignores any properties that would change the provided URL.
   */
  public navigate(url: string, extras?: RedirectionExtras): Promise<boolean> {

    return this.external(url) ?
      // Redirects to external link
      this.redirect(url, extras) :
      // Navigates with the router otherwise
      this.router.navigateByUrl(
        this.sanitizeLocalUrl(url),
        extras
      );
  }

  private sanitizeLocalUrl(url: string) {
    return url.replace(LOCAL_PROTOCOL, '').replace(this.appConfig.ui.baseUrl, '');
  }

  /**
   * Activates the route as a 404 - NOT FOUND Page if this function call
   * evaluates to true, otherwise redirects to the `redirect` url.
   * @param route
   */
  canActivate(route: ActivatedRouteSnapshot) {

    // Gets the url query parameter, if any
    const url = decodeURIComponent(route.queryParamMap.get('url'));
    // If the url matches an external link, redirects stopping the route activation
    if (this.external(url)) {
      // Gets the optional target, when specified
      const target = route.queryParamMap.get('target');
      // Jumps to the external resource
      return this.jump(url, target).then(() => false);
    }
    // Goes on activating the requested route, most likely to NotFound
    return true;
  }
}
