import { Observable } from 'rxjs/Observable';

import { PageInfo } from '../shared/page-info.model';

export enum RemoteDataState {
  RequestPending = 'RequestPending' as any,
  ResponsePending = 'ResponsePending' as any,
  Failed = 'Failed' as any,
  Success = 'Success' as any
}

/**
 * A class to represent the state of a remote resource
 */
export class RemoteData<T> {
  constructor(
    public self: string,
    private requestPending: Observable<boolean>,
    private responsePending: Observable<boolean>,
    private isSuccessFul: Observable<boolean>,
    public errorMessage: Observable<string>,
    public statusCode: Observable<string>,
    public pageInfo: Observable<PageInfo>,
    public payload: Observable<T>
  ) {
  }

  get state(): Observable<RemoteDataState> {
    return Observable.combineLatest(
      this.requestPending,
      this.responsePending,
      this.isSuccessFul,
      (requestPending, responsePending, isSuccessFul) => {
        if (requestPending) {
          return RemoteDataState.RequestPending
        } else if (responsePending) {
          return RemoteDataState.ResponsePending
        } else if (!isSuccessFul) {
          return RemoteDataState.Failed
        } else {
          return RemoteDataState.Success
        }
      }
    ).distinctUntilChanged();
  }

  get isRequestPending(): Observable<boolean> {
    return this.state.map((state) => state === RemoteDataState.RequestPending).distinctUntilChanged();
  }

  get isResponsePending(): Observable<boolean> {
    return this.state.map((state) => state === RemoteDataState.ResponsePending).distinctUntilChanged();
  }

  get isLoading(): Observable<boolean> {
    return this.state.map((state) => {
      return state === RemoteDataState.RequestPending
        || state === RemoteDataState.ResponsePending
    }).distinctUntilChanged();
  }

  get hasFailed(): Observable<boolean> {
    return this.state.map((state) => state === RemoteDataState.Failed).distinctUntilChanged();
  }

  get hasSucceeded(): Observable<boolean> {
    return this.state.map((state) => state === RemoteDataState.Success).distinctUntilChanged();
  }

}
