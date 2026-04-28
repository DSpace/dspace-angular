import { URLCombiner } from '../core/url-combiner/url-combiner';

export const PDF_VIEWER_MODULE_PATH = 'pdf-viewer';

export function getPdfViewerModuleRoute(): string {
  return `/${PDF_VIEWER_MODULE_PATH}`;
}

/**
 * Get the route to the PDF viewer of a bitstream
 * @param bitstreamId The ID of the bitstream to view
 */
export function getPdfViewerRoute(bitstreamId: string): string {
  return new URLCombiner(getPdfViewerModuleRoute(), bitstreamId).toString();
}

/**
 * Get the route to the PDF viewer of a bitstream at a given page
 * @param bitstreamId The ID of the bitstream to view
 * @param page        The page to visit
 */
export function getPdfViewerPageRoute(bitstreamId: string, page: number): string {
  return new URLCombiner(getPdfViewerRoute(bitstreamId), 'page', '' + page).toString();
}
