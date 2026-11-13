/* eslint-disable import/no-namespace */
import * as fileSaver from 'file-saver';
import { ExportAsService } from 'ngx-export-as';
import {
  BehaviorSubject,
  of,
} from 'rxjs';

import { BrowserExportService } from './browser-export.service';
import { ExportImageType } from './export.service';

describe('BrowserExportService', () => {
  let service: BrowserExportService;
  let mockDocument: any;
  let mockWindow: any;

  beforeEach(() => {
    mockWindow = {
      nativeWindow: {
        location: {
          origin: 'http://localhost:9876',
        },
      },
    };

    mockDocument = {
      styleSheets: [],
    };

    service = new BrowserExportService('browser', mockWindow, mockDocument);
  });

  describe('exportAsFile', () => {
    it('should create ExportAsService and call save', () => {
      const mockResult = of(null);
      spyOn(ExportAsService.prototype, 'save').and.returnValue(mockResult as any);

      const result = service.exportAsFile('csv', 'element-id', 'test-file');

      expect(ExportAsService.prototype.save).toHaveBeenCalled();
      expect(service.exportAsConfig).toEqual(jasmine.objectContaining({
        type: 'csv',
        elementIdOrContent: 'element-id',
        fileName: 'test-file',
        download: true,
      }));
      expect(result).toBe(mockResult);
    });

    it('should pass download=false when specified', () => {
      spyOn(ExportAsService.prototype, 'save').and.returnValue(of(null) as any);

      service.exportAsFile('xlsx', 'element-id', 'test-file', false);

      expect(service.exportAsConfig.download).toBe(false);
    });
  });

  describe('exportAsImage', () => {
    let domNode: HTMLElement;
    let isLoading: BehaviorSubject<boolean>;

    beforeEach(() => {
      domNode = document.createElement('div');
      isLoading = new BehaviorSubject<boolean>(true);
    });

    it('should call collectSameOriginFontCSS and set isLoading to false after export for png', async () => {
      spyOn(service, 'collectSameOriginFontCSS').and.returnValue('');

      service.exportAsImage(domNode, ExportImageType.png, 'test-image', isLoading);
      await new Promise(resolve => setTimeout(resolve, 100));

      expect(service.collectSameOriginFontCSS).toHaveBeenCalled();
      expect(isLoading.getValue()).toBe(false);
    });

    it('should call collectSameOriginFontCSS and set isLoading to false after export for jpeg', async () => {
      spyOn(service, 'collectSameOriginFontCSS').and.returnValue('');

      service.exportAsImage(domNode, ExportImageType.jpeg, 'test-image', isLoading);
      await new Promise(resolve => setTimeout(resolve, 100));

      expect(service.collectSameOriginFontCSS).toHaveBeenCalled();
      expect(isLoading.getValue()).toBe(false);
    });

    it('should pass fontEmbedCSS from collectSameOriginFontCSS to the export', async () => {
      const fakeFontCSS = '@font-face { font-family: Test; }';
      spyOn(service, 'collectSameOriginFontCSS').and.returnValue(fakeFontCSS);

      service.exportAsImage(domNode, ExportImageType.png, 'test', isLoading);
      await new Promise(resolve => setTimeout(resolve, 100));

      expect(service.collectSameOriginFontCSS).toHaveBeenCalled();
    });
  });

  describe('exportImageWithBase64', () => {
    let isLoading: BehaviorSubject<boolean>;

    beforeEach(() => {
      isLoading = new BehaviorSubject<boolean>(true);
    });

    it('should call saveAs with the base64 string when it has a value', () => {
      spyOn(fileSaver, 'saveAs');
      const base64 = 'data:image/png;base64,abc123';

      service.exportImageWithBase64(base64, ExportImageType.png, 'my-file', isLoading);

      expect(fileSaver.saveAs).toHaveBeenCalledWith(base64, 'my-file.png');
      expect(isLoading.getValue()).toBe(false);
    });

    it('should not call saveAs and should log error when base64 is null', () => {
      spyOn(fileSaver, 'saveAs');
      spyOn(console, 'error');

      service.exportImageWithBase64(null, ExportImageType.jpeg, 'my-file', isLoading);

      expect(fileSaver.saveAs).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledWith('Base64 string is empty');
      expect(isLoading.getValue()).toBe(false);
    });

    it('should set isLoading to false regardless', () => {
      spyOn(fileSaver, 'saveAs');

      service.exportImageWithBase64('data:image/jpeg;base64,xyz', ExportImageType.jpeg, 'file', isLoading);

      expect(isLoading.getValue()).toBe(false);
    });
  });

  describe('collectSameOriginFontCSS', () => {
    it('should skip cross-origin stylesheets', () => {
      const crossOriginSheet = { href: 'https://www.gstatic.com/charts/50/css/core/tooltip.css', cssRules: [] };
      mockDocument.styleSheets = [crossOriginSheet];

      const fontCSS = service.collectSameOriginFontCSS();

      expect(fontCSS).toBe('');
    });

    it('should silently skip stylesheets that throw on cssRules access', () => {
      spyOn(console, 'error');

      const badSheet = {
        href: null,
        get cssRules(): CSSRuleList {
          throw new DOMException('Not allowed');
        },
      };
      mockDocument.styleSheets = [badSheet];

      const fontCSS = service.collectSameOriginFontCSS();

      expect(console.error).toHaveBeenCalledWith('Error appending sheet to export: ', null);
      expect(fontCSS).toBe('');
    });

    it('should collect @font-face rules from null-href (inline) stylesheets', () => {
      const fontRule1 = { constructor: { name: 'CSSFontFaceRule' }, cssText: '@font-face { font-family: A; }' };
      const fontRule2 = { constructor: { name: 'CSSFontFaceRule' }, cssText: '@font-face { font-family: B; }' };
      const nonFontRule = { constructor: { name: 'CSSStyleRule' }, cssText: 'body { margin: 0; }' };
      mockDocument.styleSheets = [{ href: null, cssRules: [fontRule1, nonFontRule, fontRule2] }];

      const fontCSS = service.collectSameOriginFontCSS();

      expect(fontCSS).toBe('@font-face { font-family: A; }\n@font-face { font-family: B; }');
    });
  });
});

