import { Injectable } from '@angular/core';

import { ExportAsConfig, ExportAsService } from 'ngx-export-as';

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
  export(type: any, elementIdOrContent: string, fileName: string, download: boolean = true) {

    this.exportAsConfig = {
      type:type,
      elementIdOrContent: elementIdOrContent,
      fileName:fileName,
      download:download
    };

    return this.exportAsService.save(this.exportAsConfig, fileName);
  }

}
