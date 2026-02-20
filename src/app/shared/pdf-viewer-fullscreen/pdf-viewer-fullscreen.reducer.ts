import {
  PdfViewerFullScreenAction,
  PdfViewerFullscreenActionTypes,
  PdfViewerSetFullscreenAction,
} from './pdf-viewer-fullscreen.actions';

export interface PdfViewerFullscreenState {
  isFullscreen: boolean;
}

const initialState: PdfViewerFullscreenState = {
  isFullscreen: false,
};

export function pdfViewerFullscreenReducer(state: PdfViewerFullscreenState = initialState, action: PdfViewerFullScreenAction): PdfViewerFullscreenState {

  switch (action.type) {
    case PdfViewerFullscreenActionTypes.SET_FULLSCREEN: {
      return Object.assign({}, state, {
        isFullscreen: (action as PdfViewerSetFullscreenAction).isFullscreen,
      });
    }
    case PdfViewerFullscreenActionTypes.TOGGLE_FULLSCREEN: {
      return Object.assign({}, state, {
        isFullscreen: !state.isFullscreen,
      });
    }
    default:
      return state;
  }
}
