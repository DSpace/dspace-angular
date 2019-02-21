import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';

import { DSpaceRESTv2Service, HttpOptions } from '../dspace-rest-v2/dspace-rest-v2.service';
import { RestRequestMethod } from '../data/rest-request-method';
import { saveAs } from 'file-saver';
import { DSpaceRESTV2Response } from '../dspace-rest-v2/dspace-rest-v2-response.model';

/**
 * Provides utility methods to save files on the client-side.
 */
@Injectable()
export class FileService {
  constructor(
    private restService: DSpaceRESTv2Service
  ) { }

  /**
   * Makes a HTTP Get request to download a file
   *
   * @param url
   *    file url
   */
  downloadFile(url: string) {
    const headers = new HttpHeaders();
    const options: HttpOptions = Object.create({headers, responseType: 'blob'});
    return this.restService.request(RestRequestMethod.GET, url, null, options)
      .subscribe((data) => {
        saveAs(data.payload as Blob, this.getFileNameFromResponseContentDisposition(data));
      });
  }

  /**
   * Derives file name from the http response
   * by looking inside content-disposition
   * @param res
   *    http DSpaceRESTV2Response
   */
  getFileNameFromResponseContentDisposition(res: DSpaceRESTV2Response) {
    // NOTE: to be able to retrieve 'Content-Disposition' header,
    // you need to set 'Access-Control-Expose-Headers': 'Content-Disposition' ON SERVER SIDE
    const contentDisposition = res.headers.get('content-disposition') || '';
    const matches = /filename="([^;]+)"/ig.exec(contentDisposition) || [];
    return (matches[1] || 'untitled').trim().replace(/\.[^/.]+$/, '');
  };
}
