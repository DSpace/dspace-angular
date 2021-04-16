import { Injectable } from '@angular/core';

import { ExportAsConfig, ExportAsService } from 'ngx-export-as';
import * as htmlToImage from 'html-to-image';
import { saveAs } from 'file-saver';
import { BehaviorSubject } from 'rxjs';
import { Options } from 'html-to-image';

export enum ExportImageType {
  png = 'png',
  jpeg = 'jpeg',
}

@Injectable()
export class ExportService {

  /**
   * Configuration for CSV export process
   */
  exportAsConfig: ExportAsConfig;

  constructor(private exportAsService: ExportAsService) { }

  /**
   * Creates excel from the table element reference.
   *
   * @param type of export.
   * @param fileName is the file name to save as.
   * @param elementIdOrContent is the content that is being exported.
   * @param download option if its going to be downloaded.
   */
  exportAsFile(type: any, elementIdOrContent: string, fileName: string, download: boolean = true) {

    this.exportAsConfig = {
      type:type,
      elementIdOrContent: elementIdOrContent,
      fileName:fileName,
      download:download
    };

    return this.exportAsService.save(this.exportAsConfig, fileName);
  }

  /**
   * Creates an image from the given element reference.
   *
   * @param domNode   The HTMLElement.
   * @param type      The type of image to export.
   * @param fileName  The file name to save as.
   * @param isLoading A boolean representing the exporting process status.
   */
  exportAsImage(domNode: HTMLElement, type: ExportImageType, fileName: string, isLoading: BehaviorSubject<boolean>): void {
    let options: Options = {};
    if (type === ExportImageType.png) {
      options = {backgroundColor: '#ffffff'};
    }
    htmlToImage.toBlob(domNode, options)
      .then((blob) => {
        saveAs(blob, fileName + '.' + type);
        isLoading.next(false);
      });
  }

}
