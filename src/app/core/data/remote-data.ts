import { Observable } from 'rxjs/Observable';

import { PageInfo } from '../shared/page-info.model';

export enum RemoteDataState {
  RequestPending = 'RequestPending',
  ResponsePending = 'ResponsePending',
  Failed = 'Failed',
  Success = 'Success'
}

/**
 * A class to represent the state of a remote resource
 */
export class RemoteData<T> {
  constructor(
    public self: string,
    private requestPending: boolean,
    private responsePending: boolean,
    private isSuccessFul: boolean,
    public errorMessage: string,
    public statusCode: string,
    public pageInfo: PageInfo,
    public payload: T
  ) {
  }

  get state(): RemoteDataState {
    if (this.isSuccessFul === true) {
      return RemoteDataState.Success
    } else if (this.isSuccessFul === false) {
      return RemoteDataState.Failed
    } else if (this.requestPending === true) {
      return RemoteDataState.RequestPending
    } else if (this.responsePending === true || this.isSuccessFul === undefined) {
      return RemoteDataState.ResponsePending
    }
  }

  get isRequestPending(): boolean {
    return this.state === RemoteDataState.RequestPending;
  }

  get isResponsePending(): boolean {
    return this.state === RemoteDataState.ResponsePending;
  }

  get isLoading(): boolean {
    return this.state === RemoteDataState.RequestPending
      || this.state === RemoteDataState.ResponsePending;
  }

  get hasFailed(): boolean {
    return this.state === RemoteDataState.Failed;
  }

  get hasSucceeded(): boolean {
    return this.state === RemoteDataState.Success;
  }

}
