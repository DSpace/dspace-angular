import {
  hasCompleted,
  hasFailed,
  hasSucceeded,
  isError,
  isErrorStale,
  isLoading,
  isRequestPending,
  isResponsePending,
  isResponsePendingStale,
  isStale,
  isSuccess,
  isSuccessStale,
  RequestEntryState,
} from './request-entry-state.model';

describe(`isRequestPending`, () => {
  it(`should only return true if the given state is RequestPending`, () => {
    expect(isRequestPending(RequestEntryState.RequestPending)).toBeTrue();

    expect(isRequestPending(RequestEntryState.ResponsePending)).toBeFalse();
    expect(isRequestPending(RequestEntryState.Error)).toBeFalse();
    expect(isRequestPending(RequestEntryState.Success)).toBeFalse();
    expect(isRequestPending(RequestEntryState.ResponsePendingStale)).toBeFalse();
    expect(isRequestPending(RequestEntryState.ErrorStale)).toBeFalse();
    expect(isRequestPending(RequestEntryState.SuccessStale)).toBeFalse();
  });
});

describe(`isError`, () => {
  it(`should only return true if the given state is Error`, () => {
    expect(isError(RequestEntryState.Error)).toBeTrue();

    expect(isError(RequestEntryState.RequestPending)).toBeFalse();
    expect(isError(RequestEntryState.ResponsePending)).toBeFalse();
    expect(isError(RequestEntryState.Success)).toBeFalse();
    expect(isError(RequestEntryState.ResponsePendingStale)).toBeFalse();
    expect(isError(RequestEntryState.ErrorStale)).toBeFalse();
    expect(isError(RequestEntryState.SuccessStale)).toBeFalse();
  });
});

describe(`isSuccess`, () => {
  it(`should only return true if the given state is Success`, () => {
    expect(isSuccess(RequestEntryState.Success)).toBeTrue();

    expect(isSuccess(RequestEntryState.RequestPending)).toBeFalse();
    expect(isSuccess(RequestEntryState.ResponsePending)).toBeFalse();
    expect(isSuccess(RequestEntryState.Error)).toBeFalse();
    expect(isSuccess(RequestEntryState.ResponsePendingStale)).toBeFalse();
    expect(isSuccess(RequestEntryState.ErrorStale)).toBeFalse();
    expect(isSuccess(RequestEntryState.SuccessStale)).toBeFalse();
  });
});

describe(`isErrorStale`, () => {
  it(`should only return true if the given state is ErrorStale`, () => {
    expect(isErrorStale(RequestEntryState.ErrorStale)).toBeTrue();

    expect(isErrorStale(RequestEntryState.RequestPending)).toBeFalse();
    expect(isErrorStale(RequestEntryState.ResponsePending)).toBeFalse();
    expect(isErrorStale(RequestEntryState.Error)).toBeFalse();
    expect(isErrorStale(RequestEntryState.Success)).toBeFalse();
    expect(isErrorStale(RequestEntryState.ResponsePendingStale)).toBeFalse();
    expect(isErrorStale(RequestEntryState.SuccessStale)).toBeFalse();
  });
});

describe(`isSuccessStale`, () => {
  it(`should only return true if the given state is SuccessStale`, () => {
    expect(isSuccessStale(RequestEntryState.SuccessStale)).toBeTrue();

    expect(isSuccessStale(RequestEntryState.RequestPending)).toBeFalse();
    expect(isSuccessStale(RequestEntryState.ResponsePending)).toBeFalse();
    expect(isSuccessStale(RequestEntryState.Error)).toBeFalse();
    expect(isSuccessStale(RequestEntryState.Success)).toBeFalse();
    expect(isSuccessStale(RequestEntryState.ResponsePendingStale)).toBeFalse();
    expect(isSuccessStale(RequestEntryState.ErrorStale)).toBeFalse();
  });
});

describe(`isResponsePending`, () => {
  it(`should only return true if the given state is ResponsePending`, () => {
    expect(isResponsePending(RequestEntryState.ResponsePending)).toBeTrue();

    expect(isResponsePending(RequestEntryState.RequestPending)).toBeFalse();
    expect(isResponsePending(RequestEntryState.Error)).toBeFalse();
    expect(isResponsePending(RequestEntryState.Success)).toBeFalse();
    expect(isResponsePending(RequestEntryState.ResponsePendingStale)).toBeFalse();
    expect(isResponsePending(RequestEntryState.ErrorStale)).toBeFalse();
    expect(isResponsePending(RequestEntryState.SuccessStale)).toBeFalse();
  });
});

describe(`isResponsePendingStale`, () => {
  it(`should only return true if the given state is requestPending`, () => {
    expect(isResponsePendingStale(RequestEntryState.ResponsePendingStale)).toBeTrue();

    expect(isResponsePendingStale(RequestEntryState.RequestPending)).toBeFalse();
    expect(isResponsePendingStale(RequestEntryState.ResponsePending)).toBeFalse();
    expect(isResponsePendingStale(RequestEntryState.Error)).toBeFalse();
    expect(isResponsePendingStale(RequestEntryState.Success)).toBeFalse();
    expect(isResponsePendingStale(RequestEntryState.ErrorStale)).toBeFalse();
    expect(isResponsePendingStale(RequestEntryState.SuccessStale)).toBeFalse();
  });
});

describe(`isLoading`, () => {
  it(`should only return true if the given state is RequestPending, ResponsePending or ResponsePendingStale`, () => {
    expect(isLoading(RequestEntryState.RequestPending)).toBeTrue();
    expect(isLoading(RequestEntryState.ResponsePending)).toBeTrue();
    expect(isLoading(RequestEntryState.ResponsePendingStale)).toBeTrue();

    expect(isLoading(RequestEntryState.Error)).toBeFalse();
    expect(isLoading(RequestEntryState.Success)).toBeFalse();
    expect(isLoading(RequestEntryState.ErrorStale)).toBeFalse();
    expect(isLoading(RequestEntryState.SuccessStale)).toBeFalse();
  });
});

describe(`hasFailed`, () => {
  describe(`when the state is loading`, () => {
    it(`should return undefined`, () => {
      expect(hasFailed(RequestEntryState.RequestPending)).toBeUndefined();
      expect(hasFailed(RequestEntryState.ResponsePending)).toBeUndefined();
      expect(hasFailed(RequestEntryState.ResponsePendingStale)).toBeUndefined();
    });
  });

  describe(`when the state has completed`, () => {
    it(`should only return true if the given state is Error or ErrorStale`, () => {
      expect(hasFailed(RequestEntryState.Error)).toBeTrue();
      expect(hasFailed(RequestEntryState.ErrorStale)).toBeTrue();

      expect(hasFailed(RequestEntryState.Success)).toBeFalse();
      expect(hasFailed(RequestEntryState.SuccessStale)).toBeFalse();
    });
  });
});

describe(`hasSucceeded`, () => {
  describe(`when the state is loading`, () => {
    it(`should return undefined`, () => {
      expect(hasSucceeded(RequestEntryState.RequestPending)).toBeUndefined();
      expect(hasSucceeded(RequestEntryState.ResponsePending)).toBeUndefined();
      expect(hasSucceeded(RequestEntryState.ResponsePendingStale)).toBeUndefined();
    });
  });

  describe(`when the state has completed`, () => {
    it(`should only return true if the given state is Error or ErrorStale`, () => {
      expect(hasSucceeded(RequestEntryState.Success)).toBeTrue();
      expect(hasSucceeded(RequestEntryState.SuccessStale)).toBeTrue();

      expect(hasSucceeded(RequestEntryState.Error)).toBeFalse();
      expect(hasSucceeded(RequestEntryState.ErrorStale)).toBeFalse();
    });
  });
});


describe(`hasCompleted`, () => {
  it(`should only return true if the given state is Error, Success, ErrorStale or SuccessStale`, () => {
    expect(hasCompleted(RequestEntryState.Error)).toBeTrue();
    expect(hasCompleted(RequestEntryState.Success)).toBeTrue();
    expect(hasCompleted(RequestEntryState.ErrorStale)).toBeTrue();
    expect(hasCompleted(RequestEntryState.SuccessStale)).toBeTrue();

    expect(hasCompleted(RequestEntryState.RequestPending)).toBeFalse();
    expect(hasCompleted(RequestEntryState.ResponsePending)).toBeFalse();
    expect(hasCompleted(RequestEntryState.ResponsePendingStale)).toBeFalse();
  });
});

describe(`isStale`, () => {
  it(`should only return true if the given state is ResponsePendingStale, SuccessStale or ErrorStale`, () => {
    expect(isStale(RequestEntryState.ResponsePendingStale)).toBeTrue();
    expect(isStale(RequestEntryState.SuccessStale)).toBeTrue();
    expect(isStale(RequestEntryState.ErrorStale)).toBeTrue();

    expect(isStale(RequestEntryState.RequestPending)).toBeFalse();
    expect(isStale(RequestEntryState.ResponsePending)).toBeFalse();
    expect(isStale(RequestEntryState.Error)).toBeFalse();
    expect(isStale(RequestEntryState.Success)).toBeFalse();
  });
});
