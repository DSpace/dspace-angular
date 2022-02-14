import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { CookieService } from '../core/services/cookie.service';
import { distinctUntilChanged, filter, map, mergeMap, switchMap, take } from 'rxjs/operators';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AuthService } from '../core/auth/auth.service';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';

export const APP_THIS_ID_SELECTOR = '#at4-share';

@Injectable( { providedIn: 'root' } )
export class SocialService {

  private _showSocialButtons: BehaviorSubject<boolean>;

  constructor(protected cookie: CookieService,
              private router: Router,
              private authService: AuthService
  ) {
  }

  showSocialButtons(activatedRoute: ActivatedRoute): Observable<boolean> {

    if (!this._showSocialButtons) {
      this.initialize(activatedRoute);
    }

    return this._showSocialButtons.asObservable().pipe(distinctUntilChanged());
  }

  initializeAddThisScript(_document: Document): any {
    // console.log('Initializing the addThisCookie script');
    const script = _document.createElement('script');
    script.type = 'text/javascript';
    script.src = environment.addThisPlugin.scriptUrl + environment.addThisPlugin.siteId;
    _document.body.appendChild(script);
  }

  hide(_document: Document) {
    // console.log('Hiding social buttons');
    const socialButtons: HTMLElement = _document.querySelector(APP_THIS_ID_SELECTOR);
    if (socialButtons) {
      // console.log('HTML Element found, setting display to none');
      socialButtons.style.display = 'none';
    }
  }

  show(_document: Document) {
    // console.log('Showing social buttons');
    const socialButtons: HTMLElement = _document.querySelector(APP_THIS_ID_SELECTOR);
    if (socialButtons) {
      // console.log('HTML Element found, setting display to block');
      socialButtons.style.display = 'block';
    }
    // console.error('No HTML Elements to show');
  }

  protected initialize(activatedRoute: ActivatedRoute) {

    this._showSocialButtons = new BehaviorSubject<boolean>(false);

    if (!this.isSocialNetworksEnabled()) {
      return;
    }

    const cookiesSubject = new BehaviorSubject(this.cookie.getAll());
    this.cookie.cookies$.subscribe((cookie) => cookiesSubject.next(cookie));
    const cookies$ = cookiesSubject.asObservable();

    const userUUId$ = this.authService.isAuthenticated().pipe(
      switchMap((authenticated) =>
        authenticated ? this.authService.getAuthenticatedUserFromStore().pipe(map((user) => user.uuid))
          : of(null)));

    const primaryRouteData$ = this.router.events.pipe(
      filter(events => events instanceof NavigationEnd),
      map(evt => activatedRoute),
      map(route => {
        while (route.firstChild) {
          route = route.firstChild;
        }
        return route;
      }),
      filter(route => route.outlet === 'primary'),
      mergeMap(route => route.data)
    );

    // Subscriptions

    // Listen to every cookies / user state changes and evaluate sharing state
    combineLatest([cookies$, userUUId$]).subscribe(([cookieMap, userUUID]) => {
      // console.log('COOKIE/USER change detected. Evaluating.', cookieMap, userUUID);
      this.evaluateShowHide(cookieMap, userUUID);
    });

    // Listen to every route changes with data and evaluate sharing state
    primaryRouteData$.subscribe((routeData) => {
      // console.log('ROUTE DATA change detected. Evaluating.', routeData);
      if (routeData.showSocialButtons === true) {
        combineLatest([cookies$, userUUId$]).pipe(take(1)).subscribe(([cookieMap, userUUID]) => {
          this.evaluateShowHide(cookieMap, userUUID);
        });
      } else {
        this._showSocialButtons.next(false);
      }
    });
  }

  protected isSocialNetworksEnabled() {
    return environment.addThisPlugin.socialNetworksEnabled;
  }

  protected evaluateShowHide(cookieMap, userUUID) {
    if (this.isAddThisCookieEnabled(cookieMap, userUUID)) {
      this._showSocialButtons.next(true);
    } else {
      this._showSocialButtons.next(false);
    }
  }

  protected isAddThisCookieEnabled(cookieMap, userUUID) {
    // console.log(cookieMap, userUUID);
    // if (userUUID) {
    //   console.log('The user is authenticated, checking klaro-' + userUUID);
    // } else {
    //   console.log('The user is not authenticated, checking klaro-anonymous');
    // }
    const cookie = userUUID ? this.cookie.get('klaro-' + userUUID) : this.cookie.get('klaro-anonymous');
    const addThisCookie = cookie ? cookie['add-this'] : false;
    // console.log('AddThisCookie is ' + addThisCookie);
    return addThisCookie;
  }


}
