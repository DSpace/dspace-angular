/* eslint-disable max-classes-per-file */
import { type } from '@dspace/core/ngrx/type';
import { Action } from '@ngrx/store';

export const PdfViewerFullscreenActionTypes = {
  SET_FULLSCREEN: type('dspace/pdf-viewer-fullscreen/SET_FULLSCREEN'),
  TOGGLE_FULLSCREEN: type('dspace/pdf-viewer-fullscreen/TOGGLE_FULLSCREEN'),
};

export abstract class PdfViewerFullScreenAction implements Action {
  type: string;
}

export class PdfViewerSetFullscreenAction extends PdfViewerFullScreenAction {
  type: string = PdfViewerFullscreenActionTypes.SET_FULLSCREEN;

  isFullscreen: boolean;

  constructor(isFullScreen: boolean) {
    super();
    this.isFullscreen = isFullScreen;
  }
}

export class PdfViewerToggleFullscreenAction extends PdfViewerFullScreenAction {
  type: string = PdfViewerFullscreenActionTypes.TOGGLE_FULLSCREEN;
  constructor() {
    super();
  }
}
