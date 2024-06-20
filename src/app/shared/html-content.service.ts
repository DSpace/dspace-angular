import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { of as observableOf } from 'rxjs';

/**
 * Service for loading static `.html` files stored in the `/static-files` folder.
 */
@Injectable()
export class HtmlContentService {
  constructor(private http: HttpClient) {}

  /**
   * Load `.html` file content or return empty string if an error.
   * @param url file location
   */
  fetchHtmlContent(url: string) {
    // catchError -> return empty value.
    return this.http.get(url, { responseType: 'text' }).pipe(
      catchError(() => observableOf('')));
  }
}
