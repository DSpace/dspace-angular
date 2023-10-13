import { Inject, Injectable, PLATFORM_ID } from '@angular/core';

import { BehaviorSubject } from 'rxjs';
import { distinctUntilChanged, filter, map } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { ChildActivationEnd, Router } from '@angular/router';

@Injectable( { providedIn: 'root' } )
export class SocialService {

  private showOnCurrentRouteSubject = new BehaviorSubject(false);

  /**
   * Show/hide the social buttons according to the activated route
   */
  showOnCurrentRoute$ = this.showOnCurrentRouteSubject.asObservable();

  private readonly isSocialEnabled: boolean;

  constructor(
    @Inject(PLATFORM_ID) protected platformId: Object,
    @Inject(DOCUMENT) private _document: Document,
    private router: Router,
  ) {
    this.isSocialEnabled = isPlatformBrowser(this.platformId) && environment.addToAnyPlugin.socialNetworksEnabled;
  }

  activatedRouteDataChanges$ = this.router.events.pipe(
    filter(events => events instanceof ChildActivationEnd),
    map((event: ChildActivationEnd) => event.snapshot),
    map(route => {
      while (route.firstChild) {
        route = route.firstChild;
      }
      return route;
    }),
    filter(route => route.outlet === 'primary'),
    map(route => route.data)
  );

  /**
   * Returns whether the social network buttons are enabled
   */
  get enabled() {
    return this.isSocialEnabled;
  }

  /**
   * Returns the list of available buttons
   */
  get configuration() {
    return environment.addToAnyPlugin;
  }

  /**
   * Returns the homepage link to be used by AddToAny.
   * If no link is provided in the configuration then the current page url will be used.
   */
  get link(): string {
    return environment.addToAnyPlugin.link ?? null;
  }

  /**
   * Import the AddToAny JavaScript
   */
  initializeAddToAnyScript(): any {
    // Initializing the addThisCookie script
    const script = this._document.createElement('script');
    script.type = 'text/javascript';
    script.src = environment.addToAnyPlugin.scriptUrl;
    script.async = true;
    this._document.body.appendChild(script);
  }

  /**
   * Initialize the Social service. This method must be called only inside app component.
   */
  initialize() {
    if (!this.enabled) {
      return;
    }

    const showSocialButtons = this.activatedRouteDataChanges$.pipe(
      map(data => data?.showSocialButtons === true),
      distinctUntilChanged(),
    );

    showSocialButtons.subscribe(this.showOnCurrentRouteSubject);
  }

}
