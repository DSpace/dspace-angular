import { Inject, Injectable, PLATFORM_ID } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, tap } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { isPlatformBrowser } from '@angular/common';

@Injectable( { providedIn: 'root' } )
export class SocialService {

  private showOnCurrentRouteSubject: BehaviorSubject<boolean>;

  private readonly isSocialEnabled: boolean;

  constructor(
    @Inject(PLATFORM_ID) protected platformId: Object,
  ) {
    this.showOnCurrentRouteSubject = new BehaviorSubject(false);
    this.isSocialEnabled = isPlatformBrowser(this.platformId) && environment.addToAnyPlugin.socialNetworksEnabled;
    this.initialize();
  }

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
   * Show/hide the social buttons according to the activated route
   */
  get showOnCurrentRoute$(): Observable<boolean> {
    return this.showOnCurrentRouteSubject.asObservable().pipe(
      tap((res) => {
        console.log('subject', res);
      }),
      distinctUntilChanged());
  }

  initializeAddToAnyScript(_document: Document): any {
    // Initializing the addThisCookie script
    const script = _document.createElement('script');
    script.type = 'text/javascript';
    script.src = environment.addToAnyPlugin.scriptUrl;
    script.async = true;
    _document.body.appendChild(script);
  }

  private initialize() {

    if (!this.enabled) {
      return;
    }

    // TODO observable below should emit the value of current route's "showSocialButton" data
    this.showOnCurrentRouteSubject.next(true);
  }

}
