export enum RequestEntryState {
  RequestPending = 'RequestPending',
  ResponsePending = 'ResponsePending',
  Error = 'Error',
  Success = 'Success',
  ResponsePendingStale = 'ResponsePendingStale',
  ErrorStale = 'ErrorStale',
  SuccessStale = 'SuccessStale',
}

/**
 * Returns true if the given state is RequestPending, false otherwise
 */
export const isRequestPending = (state: RequestEntryState) =>
  state === RequestEntryState.RequestPending;

/**
 * Returns true if the given state is Error, false otherwise
 */
export const isError = (state: RequestEntryState) =>
  state === RequestEntryState.Error;

/**
 * Returns true if the given state is Success, false otherwise
 */
export const isSuccess = (state: RequestEntryState) =>
  state === RequestEntryState.Success;

/**
 * Returns true if the given state is ErrorStale, false otherwise
 */
export const isErrorStale = (state: RequestEntryState) =>
  state === RequestEntryState.ErrorStale;

/**
 * Returns true if the given state is SuccessStale, false otherwise
 */
export const isSuccessStale = (state: RequestEntryState) =>
  state === RequestEntryState.SuccessStale;

/**
 * Returns true if the given state is ResponsePending, false otherwise
 */
export const isResponsePending = (state: RequestEntryState) =>
  state === RequestEntryState.ResponsePending;

/**
 * Returns true if the given state is ResponsePendingStale, false otherwise
 */
export const isResponsePendingStale = (state: RequestEntryState) =>
  state === RequestEntryState.ResponsePendingStale;

/**
 * Returns true if the given state is RequestPending, RequestPendingStale, ResponsePending, or
 * ResponsePendingStale, false otherwise
 */
export const isLoading = (state: RequestEntryState) =>
  isRequestPending(state) ||
  isResponsePending(state) ||
  isResponsePendingStale(state);

/**
 * If isLoading is true for the given state, this method returns undefined, we can't know yet.
 * If it isn't this method will return true if the the given state is Error or ErrorStale,
 * false otherwise
 */
export const hasFailed = (state: RequestEntryState) => {
  if (isLoading(state)) {
    return undefined;
  } else {
    return isError(state) || isErrorStale(state);
  }
};

/**
 * If isLoading is true for the given state, this method returns undefined, we can't know yet.
 * If it isn't this method will return true if the the given state is Success or SuccessStale,
 * false otherwise
 */
export const hasSucceeded = (state: RequestEntryState) => {
  if (isLoading(state)) {
    return undefined;
  } else {
    return isSuccess(state) || isSuccessStale(state);
  }
};

/**
 * Returns true if the given state is not loading, false otherwise
 */
export const hasCompleted = (state: RequestEntryState) =>
  !isLoading(state);

/**
 * Returns true if the given state is isRequestPendingStale, isResponsePendingStale, SuccessStale or
 * ErrorStale, false otherwise
 */
export const isStale = (state: RequestEntryState) =>
  isResponsePendingStale(state) ||
  isSuccessStale(state) ||
  isErrorStale(state);
