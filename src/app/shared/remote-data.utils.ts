import { RemoteData } from '../core/data/remote-data';
import { Observable, of as observableOf } from 'rxjs';
import { RemoteDataError } from '../core/data/remote-data-error';

/**
 * Method to create a remote data object that has succeeded
 * @param object The object to wrap
 */
export function createSuccessfulRemoteDataObject<T>(object: T): RemoteData<T> {
  return new RemoteData(
    false,
    false,
    true,
    undefined,
    object
  );
}

/**
 * Method to create a remote data object that has succeeded, wrapped in an observable
 * @param object The object to wrap
 */
export function createSuccessfulRemoteDataObject$<T>(object: T): Observable<RemoteData<T>> {
  return observableOf(createSuccessfulRemoteDataObject(object));
}

/**
 * Method to create a remote data object that has failed
 * @param object The object to wrap
 * @param error The RemoteDataError that caused the failure
 */
export function createFailedRemoteDataObject<T>(object?: T, error?: RemoteDataError): RemoteData<T> {
  return new RemoteData(
    false,
    false,
    false,
    error,
    object
  );
}

/**
 * Method to create a remote data object that has failed, wrapped in an observable
 * @param object The object to wrap
 * @param error The RemoteDataError that caused the failure
 */
export function createFailedRemoteDataObject$<T>(object?: T, error?: RemoteDataError): Observable<RemoteData<T>> {
  return observableOf(createFailedRemoteDataObject(object, error));
}

/**
 * Method to create a remote data object that is still pending
 * @param object The object to wrap
 */
export function createPendingRemoteDataObject<T>(object?: T): RemoteData<T> {
  return new RemoteData(
    true,
    true,
    true,
    null,
    object
  );
}

/**
 * Method to create a remote data object that is still pending, wrapped in an observable
 * @param object The object to wrap
 */
export function createPendingRemoteDataObject$<T>(object?: T): Observable<RemoteData<T>> {
  return observableOf(createPendingRemoteDataObject(object));
}
