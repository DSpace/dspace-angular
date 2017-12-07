export class RemoteDataError {
  constructor(
    public statusCode: string,
    public message: string
  ) {
  }
}
