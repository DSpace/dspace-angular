import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';

import { DSpaceRESTv2Service, HttpOptions } from '../dspace-rest-v2/dspace-rest-v2.service';
import { RestRequestMethod } from '../data/request.models';
import { saveAs } from 'file-saver';
import { DSpaceRESTV2Response } from '../dspace-rest-v2/dspace-rest-v2-response.model';

@Injectable()
export class FileService {
  constructor(
    private restService: DSpaceRESTv2Service
  ) { }

  downloadFile(url: string) {
    const headers = new HttpHeaders();
    const options: HttpOptions = Object.create({headers, responseType: 'blob'});
    return this.restService.request(RestRequestMethod.Get, url, null, options)
      .subscribe((data) => {
        saveAs(data.payload as Blob, this.getFileNameFromResponseContentDisposition(data));
      });
  }

  /**
   * Derives file name from the http response
   * by looking inside content-disposition
   * @param res http DSpaceRESTV2Response
   */
  getFileNameFromResponseContentDisposition(res: DSpaceRESTV2Response) {
    const contentDisposition = res.headers.get('content-disposition') || '';
    const matches = /filename="([^;]+)"/ig.exec(contentDisposition) || [];
    const fileName = (matches[1] || 'untitled').trim().replace(/\.[^/.]+$/, '');
    return fileName;
  };
}
