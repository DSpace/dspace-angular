export class Response {
  constructor(public isSuccessful: boolean) {}
}

export class SuccessResponse extends Response {
  constructor(public resourceUUIDs: Array<String>) {
    super(true);
  }
}

export class ErrorResponse extends Response {
  constructor(public errorMessage: string) {
    super(false);
  }
}

