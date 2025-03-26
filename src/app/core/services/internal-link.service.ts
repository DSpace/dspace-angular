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
    // Obtaining the base URL, disregarding query parameters
    const baseUrl = link.split('?')[0];
    const currentDomain = new URL(this.currentURL).hostname;

    if (baseUrl.startsWith(this.currentURL) || baseUrl.startsWith(currentDomain)) {
      const base = baseUrl.startsWith(this.currentURL) ? this.currentURL : currentDomain;
      const currentSegments = baseUrl.substring(base.length);
      return currentSegments.startsWith('/') ? currentSegments : `/${currentSegments}`;
    }

    return baseUrl.startsWith('/') ? baseUrl : `/${baseUrl}`;
  }

  /**
   * Parse the query parameters from a given URL link.
   *
   * @param link The URL link containing query parameters.
   * @returns An object containing the parsed query parameters.
   */
  public getQueryParams(link: string): Record<string, string> {
    const queryParams: Record<string, string> = {};

    const queryStringStartIndex = link.indexOf('?');
    if (queryStringStartIndex !== -1) {
        const paramsString = link.substring(queryStringStartIndex + 1);
        const paramsArray = paramsString.split('&');

        paramsArray.forEach(param => {
            const [key, value] = param.split('=');
            if (key && value) {
                queryParams[key] = decodeURIComponent(value.replace(/\+/g, ' '));
            }
        });
    }

    return queryParams;
  }
}
