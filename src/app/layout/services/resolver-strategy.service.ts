import { Injectable } from '@angular/core';
import { hasValue } from 'src/app/shared/empty.util';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ResolverStrategyService {

  /**
   * List of managed URN
   */
  private urn2baseurl: Map<string, string>;

  constructor() {
    /**
     * Set the list of managed URN
     */
    this.urn2baseurl = new Map();
    const urnList = environment.layout.urn;
    if (hasValue(urnList)) {
      for (const urn of urnList) {
        this.urn2baseurl.set(urn.name, urn.baseUrl);
      }
    }
  }

  /**
   * Returns the list of managed URN
   */
  get managedUrn(): IterableIterator<string> {
    return this.urn2baseurl.keys();
  }

  /**
   * Returns base url for a given URN
   * @param key string that represents the URN (DOI, HANDLE, EMAIL)
   */
  getBaseUrl(key: string): string {
    return this.urn2baseurl.get(key);
  }

  /**
   * Check if the give parameter is a link
   * @param value metadata value
   */
  checkLink(value: string): boolean {
    return hasValue(value) && (
      value.toLowerCase().startsWith('http://') ||
      value.toLowerCase().startsWith('https://') ||
      value.toLowerCase().startsWith('ftp://') ||
      value.toLowerCase().startsWith('ftps://') ) ;
  }
}
