import { RestRequestMethod } from '../../core/data/rest-request-method';

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
   * The request method to use for the file upload request
   */
  method: RestRequestMethod = RestRequestMethod.POST;
}
