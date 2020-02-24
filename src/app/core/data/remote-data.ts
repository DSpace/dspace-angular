import { hasValue } from '../../shared/empty.util';
import { RemoteDataError } from './remote-data-error';

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
    private requestPending?: boolean,
    private responsePending?: boolean,
    private isSuccessful?: boolean,
    public error?: RemoteDataError,
    public payload?: T,
    public statusCode?: number,
  ) {
  }

  get state(): RemoteDataState {
    if (this.isSuccessful === true && hasValue(this.payload)) {
      return RemoteDataState.Success
    } else if (this.isSuccessful === false) {
      return RemoteDataState.Failed
    } else if (this.requestPending === true) {
      return RemoteDataState.RequestPending
    } else {
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
