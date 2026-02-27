import { waitForAsync } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';

import { AppState } from '../../app.reducer';
import {
  PdfViewerSetFullscreenAction,
  PdfViewerToggleFullscreenAction,
} from './pdf-viewer-fullscreen.actions';
import { PdfViewerFullscreenState } from './pdf-viewer-fullscreen.reducer';
import { PdfViewerFullscreenService } from './pdf-viewer-fullscreen.service';

describe('PdfViewerFullscreenService', () => {
  let service: PdfViewerFullscreenService;
  let store: Store<AppState>;

  const pdfViewerFullscreenState: PdfViewerFullscreenState = { isFullscreen: true };

  beforeEach(waitForAsync(() => {
    store = jasmine.createSpyObj('store', {
      dispatch: {},
      select: of(pdfViewerFullscreenState),
    });
    service = new PdfViewerFullscreenService(store);
  }));

  describe('enableFullscreen', () => {
    it('should send an PdfViewerSetFullscreenAction with value true', () => {
      service.enableFullscreen();
      expect(store.dispatch as jasmine.Spy).toHaveBeenCalledWith(new PdfViewerSetFullscreenAction(true));
    });
  });

  describe('disableFullscreen', () => {
    it('should send an PdfViewerSetFullscreenAction with value false', () => {
      service.disableFullscreen();
      expect(store.dispatch as jasmine.Spy).toHaveBeenCalledWith(new PdfViewerSetFullscreenAction(false));
    });
  });

  describe('toggleFullscreen', () => {
    it('should send an PdfViewerToggleFullscreenAction', () => {
      service.toggleFullscreen();
      expect(store.dispatch as jasmine.Spy).toHaveBeenCalledWith(new PdfViewerToggleFullscreenAction());
    });
  });

  describe('isFullscreen', () => {
    it('should retrieve the isFullscreen property of the PdfViewerFullscreenState', (done) => {
      service.isFullscreen().subscribe((result) => {
        expect(result).toEqual(true);
        done();
      });
    });
  });

});
