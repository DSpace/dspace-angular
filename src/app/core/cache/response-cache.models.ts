import { RequestError } from '../data/request.models';
import { PageInfo } from '../shared/page-info.model';

/* tslint:disable:max-classes-per-file */
export class Response {
  constructor(
    public isSuccessful: boolean,
    public statusCode: string
  ) { }
}

export class SuccessResponse extends Response {
  constructor(
    public resourceUUIDs: string[],
    public statusCode: string,
    public pageInfo?: PageInfo
  ) {
    super(true, statusCode);
  }
}

export class ErrorResponse extends Response {
  errorMessage: string;

  constructor(error: RequestError) {
    super(false, error.statusText);
    console.error(error);
    this.errorMessage = error.message;
  }
}
/* tslint:enable:max-classes-per-file */
