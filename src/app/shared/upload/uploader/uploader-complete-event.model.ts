/**
 * An interface that represents a completed single-file upload, carrying both the
 * parsed response body and the client-side file name of the file that completed.
 */
export interface UploaderCompleteEvent {
  /**
   * The parsed response body (e.g. the submission object returned by REST)
   */
  response: any;

  /**
   * The client-side name of the file that completed uploading. Present only when a
   * non-empty file name is known — an empty file name is never emitted, so the presence
   * of this key means a usable name is available. Whitespace-only names are not trimmed.
   */
  fileName?: string;
}
