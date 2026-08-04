import { DOCUMENT } from '@angular/common';
import {
  Inject,
  Injectable,
} from '@angular/core';

/**
 * Service used to scroll to a specific fragment/ID on the page
 */
@Injectable({
  providedIn: 'root',
})
export class ScrollService {

  activeFragment: string | null = null;

  constructor(
    @Inject(DOCUMENT) protected document: Document,
  ) {
  }

  /**
   * Sets the fragment/ID that the user should jump to when the route is refreshed
   *
   * @param fragment The fragment/ID
   */
  setFragment(fragment: string): void {
    this.activeFragment = fragment;
  }

  /**
   * Scrolls to the active fragment/ID if it exists
   */
  scrollToActiveFragment(): void {
    if (this.activeFragment) {
      this.document.getElementById(this.activeFragment)?.scrollIntoView({
        block: 'start',
      });
    }
  }

  /**
   * Returns the current window scroll position as [x, y]
   */
  getScrollPosition(): [number, number] {
    return [
      this.document.defaultView?.scrollX ?? 0,
      this.document.defaultView?.scrollY ?? 0,
    ];
  }

  /**
   * Restores the window scroll position instantly (no smooth scroll).
   *
   * @param position The [x, y] scroll coordinates to restore
   */
  restoreScrollPosition([x, y]: [number, number]): void {
    const window = this.document.defaultView;

    if (!window) {
      return;
    }

    // this timeout runs after the scroll-to-top.
    setTimeout(() => {
      window.scrollTo({
        left: x,
        top: y,
        // behavior: 'instant',
      });
    });
  }
}
