import { Injectable } from '@angular/core';
import {
  createFeatureSelector,
  Store,
} from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AppState } from '../../app.reducer';
import {
  PdfViewerSetFullscreenAction,
  PdfViewerToggleFullscreenAction,
} from './pdf-viewer-fullscreen.actions';
import { PdfViewerFullscreenState } from './pdf-viewer-fullscreen.reducer';

export const pdfViewerFullscreenSelector = createFeatureSelector<PdfViewerFullscreenState>('pdfViewerFullscreen');

@Injectable({
  providedIn: 'root',
})
export class PdfViewerFullscreenService {

  constructor(
    protected store: Store<AppState>,
  ) {
  }

  enableFullscreen() {
    this.store.dispatch(new PdfViewerSetFullscreenAction(true));
  }

  disableFullscreen() {
    this.store.dispatch(new PdfViewerSetFullscreenAction(false));
  }

  toggleFullscreen() {
    this.store.dispatch(new PdfViewerToggleFullscreenAction());
  }

  isFullscreen(): Observable<boolean> {
    return this.store.select(pdfViewerFullscreenSelector).pipe(
      map((state: PdfViewerFullscreenState) => state.isFullscreen),
    );
  }

}
