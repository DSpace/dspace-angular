import { Observable } from "rxjs";
import { hasValue } from "../../shared/empty.util";

export enum RemoteDataState {
  //TODO RequestPending will never happen: implement it in the store & DataEffects.
  RequestPending,
  ResponsePending,
  Failed,
  Success
}

/**
 * A class to represent the state of
 */
export class RemoteData<T> {

  constructor(
    private storeLoading: Observable<boolean>,
    public errorMessage: Observable<string>,
    public payload: Observable<T>
  ) {
  }

  get state(): Observable<RemoteDataState> {
    return Observable.combineLatest(
      this.storeLoading,
      this.errorMessage.map(msg => hasValue(msg)),
      (storeLoading, hasMsg) => {
        if (storeLoading) {
          return RemoteDataState.ResponsePending
        }
        else if (hasMsg) {
          return RemoteDataState.Failed
        }
        else {
          return RemoteDataState.Success
        }
      }
    ).distinctUntilChanged();
  }

  get isRequestPending(): Observable<boolean> {
    return this.state
      .map(state => state == RemoteDataState.RequestPending)
      .distinctUntilChanged();
  }

  get isResponsePending(): Observable<boolean> {
    return this.state
      .map(state => state == RemoteDataState.ResponsePending)
      .distinctUntilChanged();
  }

  get isLoading(): Observable<boolean> {
    return this.state
      .map(state => {
        return state == RemoteDataState.RequestPending
          || state === RemoteDataState.ResponsePending
      })
      .distinctUntilChanged();
  }

  get hasFailed(): Observable<boolean> {
    return this.state
      .map(state => state == RemoteDataState.Failed)
      .distinctUntilChanged();
  }

  get hasSucceeded(): Observable<boolean> {
    return this.state
      .map(state => state == RemoteDataState.Success)
      .distinctUntilChanged();
  }

}
