import { BehaviorSubject } from 'rxjs';

import { ExportImageType, ExportService } from './export.service';

export class ServerExportService implements ExportService {
  /**
   * Creates excel from the table element reference.
   *
   * @param type of export.
   * @param fileName is the file name to save as.
   * @param elementIdOrContent is the content that is being exported.
   * @param download option if it'ss going to be downloaded.
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

  /**
   * Creates an image from the given base64 string.
   * @param base64 the base64 string
   * @param type image type (png or jpeg)
   * @param fileName
   * @param isLoading
   */
  exportImageWithBase64(base64: string, type: ExportImageType, fileName: string, isLoading: BehaviorSubject<boolean>) {
    return;
  }
}
