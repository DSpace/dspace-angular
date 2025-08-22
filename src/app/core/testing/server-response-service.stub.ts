/* eslint-disable no-empty,@typescript-eslint/no-empty-function */
/**
 * Stub class of {@link ServerResponseService}
 */
export class ServerResponseServiceStub {

  setStatus(_code: number, _message?: string): this {
    return this;
  }

  setUnauthorized(_message = 'Unauthorized'): this {
    return this;
  }

  setForbidden(_message = 'Forbidden'): this {
    return this;
  }

  setNotFound(_message = 'Not found'): this {
    return this;
  }

  setInternalServerError(_message = 'Internal Server Error'): this {
    return this;
  }

  setHeader(_header: string, _content: string): void {
  }

}
