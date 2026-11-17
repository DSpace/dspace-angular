import { DOCUMENT } from '@angular/common';
import {
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { hasValue } from '@dspace/shared/utils/empty.util';
import { saveAs } from 'file-saver';
import {
  toJpeg,
  toPng,
} from 'html-to-image';
import { Options } from 'html-to-image/es/types';
import {
  ExportAsConfig,
  ExportAsService,
} from 'ngx-export-as';
import { BehaviorSubject } from 'rxjs';

import {
  NativeWindowRef,
  NativeWindowService,
} from '../services/window.service';
import {
  ExportImageType,
  ExportService,
} from './export.service';
/**
 *  IMPORTANT
 *  Due to a problem occurring on SSR with the ExportAsService dependency, which use window object, this service can't be injected.
 *  So we need to instantiate the class directly based on current the platform whn is needed
 *  TODO To be refactored when https://github.com/wnabil/ngx-export-as/pull/112 is fixed
 */
export class BrowserExportService implements ExportService {

  /**
   * Configuration for CSV export process
   */
  exportAsConfig: ExportAsConfig;

  constructor(@Inject(PLATFORM_ID) private platformId: any,
              @Inject(NativeWindowService) private _window: NativeWindowRef,
              @Inject(DOCUMENT) private document: any) {
  }

  /**
   * Creates excel from the table element reference.
   *
   * @param type of export.
   * @param fileName is the file name to save as.
   * @param elementIdOrContent is the content that is being exported.
   * @param download option if it's going to be downloaded.
   */
  exportAsFile(type: any, elementIdOrContent: string, fileName: string, download: boolean = true) {

    this.exportAsConfig = {
      type:type,
      elementIdOrContent: elementIdOrContent,
      fileName:fileName,
      download:download,
    };

    const exportAsService: ExportAsService = new ExportAsService(this.platformId);
    return exportAsService.save(this.exportAsConfig, fileName);
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
    // html-to-image internally iterates ALL document.styleSheets to inline fonts.
    // Cross-origin sheets (e.g. Google Charts CSS from gstatic.com) throw a DOMException
    // in Firefox when .cssRules is accessed (Same-Origin Policy).
    const fontEmbedCSS = this.collectSameOriginFontCSS();

    const options: Options = {
      backgroundColor: '#ffffff',
      fontEmbedCSS,
    };

    const export$ = type === ExportImageType.png
      ? toPng(domNode, options)
      : toJpeg(domNode, options);

    export$.then((dataUrl) => {
      saveAs(dataUrl, fileName + '.' + type);
      isLoading.next(false);
    }).catch((err) => {
      console.error('Image export failed', err);
      isLoading.next(false);
    });
  }

  /**
   * Collects all @font-face CSS rules from same-origin stylesheets only.
   * Cross-origin sheets are silently skipped so they never trigger a
   * DOMException when cssRules is accessed in Firefox.
   */
  collectSameOriginFontCSS(): string {
    const fontRules: string[] = [];
    const sheets = Array.from((this.document as Document).styleSheets);

    for (const sheet of sheets) {
      // Skip cross-origin sheets — accessing cssRules on them throws in Firefox
      if (sheet.href && new URL(sheet.href).origin !== this._window.nativeWindow.location.origin) {
        continue;
      }
      try {
        const rules = Array.from(sheet.cssRules ?? []);
        for (const rule of rules) {
          if (rule.constructor.name === 'CSSFontFaceRule') {
            fontRules.push(rule.cssText);
          }
        }
      } catch {
        console.error('Error appending sheet to export: ', sheet.href);
      }
    }

    return fontRules.join('\n');
  }


  /**
   * Creates an image from the given base64 string.
   * @param base64 the base64 string
   * @param type image type (png or jpeg)
   * @param fileName
   * @param isLoading
   */
  exportImageWithBase64(base64: string, type: ExportImageType, fileName: string, isLoading: BehaviorSubject<boolean>): void {
    if (hasValue(base64)) {
      saveAs(base64, fileName + '.' + type);
    } else {
      console.error('Base64 string is empty');
    }
    isLoading.next(false);
  }
}
