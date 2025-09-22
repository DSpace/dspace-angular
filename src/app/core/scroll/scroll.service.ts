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
}
