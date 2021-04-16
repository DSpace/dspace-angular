import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

import { ExportImageType } from './export.service';

@Injectable()
export class ServerExportService {
  /**
   * Creates excel from the table element reference.
   *
   * @param type of export.
   * @param fileName is the file name to save as.
   * @param elementIdOrContent is the content that is being exported.
   * @param download option if its going to be downloaded.
   */
  exportAsFile(type: any, elementIdOrContent: string, fileName: string, download: boolean = true) {
    return;
  }

  /**
   * Creates an image from the given element reference.
   *
   * @param domNode   The HTMLElement.
   * @param type      The type of image to export.
   * @param fileName  The file name to save as.
   * @param isLoading A boolean representing the exporting process status.
   */
  exportAsImage(domNode: HTMLElement, type: ExportImageType, fileName: string, isLoading: BehaviorSubject<boolean>) {
    return;
  }
}
