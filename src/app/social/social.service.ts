import {
  DOCUMENT,
  isPlatformBrowser,
} from '@angular/common';
import {
  Inject,
  Injectable,
  PLATFORM_ID,
} from '@angular/core';
import {
  ChildActivationEnd,
  Router,
} from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  map,
} from 'rxjs/operators';

import { environment } from '../../environments/environment';

/**
 * Singleton service responsible for integration with AddToAny plugin to initialize 3rd party script and hold state
 * Bootstrap with Angular start in {@link AppComponent} which initializess route subscription
 * Bootstrap of integration starts at clientside with {@link SocialComponent} which loads 3rd party script
 */
@Injectable( { providedIn: 'root' } )
export class SocialService {
  private showOnCurrentRouteSubject = new BehaviorSubject(false);

  /**
   * Show/hide the social buttons according to the activated route
   */
  showOnCurrentRoute$ = this.showOnCurrentRouteSubject.asObservable();

  private readonly isSocialEnabled: boolean;

  constructor(
    @Inject(PLATFORM_ID) protected platformId: any,
    @Inject(DOCUMENT) private _document: Document,
    private router: Router,
  ) {
    this.isSocialEnabled = isPlatformBrowser(this.platformId) && environment.addToAnyPlugin.socialNetworksEnabled;
  }

  /**
   * Traverse tree from bottom to parent in route definition to get whenever feature is enabled via *showSocialButtons*
   */
  private activatedRouteDataChanges$ = this.router.events.pipe(
    filter(events => events instanceof ChildActivationEnd),
    map((event: ChildActivationEnd) => event.snapshot),
    map(route => {
      while (route.firstChild) {
        route = route.firstChild;
      }
      return route;
    }),
    filter(route => route.outlet === 'primary'),
    map(route => route.data),
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
   * Import the AddToAny JavaScript
   */
  initializeAddToAnyScript(): any {
    if (!this.enabled) {
      return;
    }
    // Initializing the addToAny script
    const script = this._document.createElement('script');
    script.type = 'text/javascript';
    script.src = environment.addToAnyPlugin.scriptUrl;
    script.async = true;

    // Wait for document to finish grow vertically so that script listener handles properly body height changes
    let lastBodyHeight = 0;
    const documentBody = this._document.body;

    const bodyHeightInterval = setInterval(() => {
      const currentBodyHeight = documentBody.getBoundingClientRect().height;

      if (currentBodyHeight > lastBodyHeight) {
        lastBodyHeight = currentBodyHeight;
      } else {
        this._document.head.appendChild(script);
        clearInterval(bodyHeightInterval);
        this.observeAddToAnyModal();
      }
    }, 200);
  }

  /**
   * Observes DOM changes to detect when the AddToAny modal is opened or closed.
   * Since AddToAny does not reliably expose lifecycle callbacks, a MutationObserver
   * is used to monitor the presence and visibility of the modal element.
   *
   * When the modal is visible, background scrolling is disabled by setting
   * `overflow: hidden` on the document body. When the modal is no longer visible,
   * the original scrolling behavior is restored.
   */
  private observeAddToAnyModal(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const body = this._document.body;
    let isLocked = false;

    const observer = new MutationObserver(() => {
      const modal = this._document.querySelector('.a2a_full') as HTMLElement;
      const isVisible = modal && this.isElementVisible(modal);

      if (isVisible && !isLocked) {
        body.style.overflow = 'hidden';
        isLocked = true;
      } else if (!isVisible && isLocked) {
        body.style.overflow = '';
        isLocked = false;
      }
    });

    observer.observe(body, {
      childList: true,
      subtree: true,
      attributes: true,
    });
  }

  /**
   * Determines whether a given HTML element is currently visible in the DOM.
   * This is necessary because the AddToAny modal may remain in the DOM while hidden.
   *
   * @param element The element to check for visibility
   * @returns true if the element is visible, false otherwise
   */
  private isElementVisible(element: HTMLElement): boolean {
    return !!(
      element.offsetWidth ||
      element.offsetHeight ||
      element.getClientRects().length
    );
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
