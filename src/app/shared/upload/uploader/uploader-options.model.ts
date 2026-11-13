import { RestRequestMethod } from '@dspace/config/rest-request-method';

export class UploaderOptions {
  /**
   * URL of the REST endpoint for file upload.
   */
  url: string;

  authToken: string;

  disableMultipart = false;

  itemAlias: string = null;

  /**
   * Automatically send out an upload request when adding files
   */
  autoUpload = true;

  /**
   * Set the max number of files that can be loaded
   */
  maxFileNumber: number;

  /**
   * The largest file accepted, in bytes. Larger files are rejected before any data is sent.
   * Undefined or zero means no client-side limit.
   */
  maxFileSize?: number;

  /**
   * Impersonating user uuid
   */
  impersonatingID: string;

  /**
   * The request method to use for the file upload request
   */
  method: RestRequestMethod = RestRequestMethod.POST;
}
