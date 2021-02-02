import { Inject, Injectable } from '@angular/core';
import { RawRestResponse } from '../dspace-rest/raw-rest-response.model';
import { AuthService } from '../auth/auth.service';
import { take } from 'rxjs/operators';
import { NativeWindowRef, NativeWindowService } from '../services/window.service';
import { URLCombiner } from '../url-combiner/url-combiner';
import { hasValue } from '../../shared/empty.util';

/**
 * Provides utility methods to save files on the client-side.
 */
@Injectable({providedIn: 'root'})
export class FileService {
  constructor(
    @Inject(NativeWindowService) protected _window: NativeWindowRef,
    private authService: AuthService
  ) { }

  /**
   * Combines an URL with a short-lived token and sets the current URL to the newly created one
   *
   * @param url
   *    file url
   */
  downloadFile(url: string) {
    this.authService.getShortlivedToken().pipe(take(1)).subscribe((token) => {
      this._window.nativeWindow.location.href = hasValue(token) ? new URLCombiner(url, `?authentication-token=${token}`).toString() : url;
    });
  }

  /**
   * Derives file name from the http response
   * by looking inside content-disposition
   * @param res
   *    http RawRestResponse
   */
  getFileNameFromResponseContentDisposition(res: RawRestResponse) {
    // NOTE: to be able to retrieve 'Content-Disposition' header,
    // you need to set 'Access-Control-Expose-Headers': 'Content-Disposition' ON SERVER SIDE
    const contentDisposition = res.headers.get('content-disposition') || '';
    const matches = /filename="([^;]+)"/ig.exec(contentDisposition) || [];
    return (matches[1] || 'untitled').trim().replace(/\.[^/.]+$/, '');
  }
}
