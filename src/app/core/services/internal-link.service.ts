import { Inject, Injectable } from '@angular/core';
import { NativeWindowRef, NativeWindowService } from './window.service';

/**
 * LinkService provides utility functions for working with links, such as checking if a link is internal
 * and transforming internal links based on the current URL.
 */
@Injectable()
export class InternalLinkService {
  currentURL = this._window.nativeWindow?.location?.origin;

  constructor(
    @Inject(NativeWindowService) protected _window: NativeWindowRef,
  ) {

  }

  /**
   * Check if the provided link is internal, i.e., it starts with a '/' or matches the current URL.
   *
   * @param link The link to be checked.
   * @returns A boolean indicating whether the link is internal.
   */
  public isLinkInternal(link: string): boolean {
    // Create a Domain object for the provided link
    const currentDomain = new URL(this.currentURL).hostname;

    return link.startsWith('/')
      || link.startsWith(this.currentURL)
      || link.startsWith(currentDomain)
      || link === currentDomain
      || !link.includes('://');
  }

  /**
   * Get the relative path for an internal link based on the current URL.
   *
   * @param link The internal link to be transformed.
   * @returns The relative path for the given internal link.
   */
  public getRelativePath(link: string): string {
    // Create a Domain object for the provided link
    const currentDomain = new URL(this.currentURL).hostname;

    if (link.startsWith(this.currentURL)) {
      const currentSegments = link.substring(this.currentURL.length);
      return currentSegments.startsWith('/') ? currentSegments : `/${currentSegments}`;
    }

    if (link.startsWith(currentDomain)) {
      const currentSegments = link.substring(currentDomain.length);
      return currentSegments.startsWith('/') ? currentSegments : `/${currentSegments}`;
    }

    return link;
  }
}
