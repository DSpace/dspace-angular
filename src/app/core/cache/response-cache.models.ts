export class Response {
  constructor(public isSuccessful: boolean) {}
}

export class SuccessResponse extends Response {
  constructor(public resourceUUIDs: Array<String>) {
    super(true);
  }
}

export class ErrorResponse extends Response {
  errorMessage: string;

  constructor(error: Error) {
    super(false);
    console.error(error);
    this.errorMessage = error.message;
  }
}

