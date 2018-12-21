export class RemoteDataError {
  constructor(
    public statusCode: number,
    public statusText: string,
    public message: string
  ) {
  }
}
