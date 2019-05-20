import { RemoteDataError } from '../../data/remote-data-error';

/**
 * A class to represent the data retrieved by after processing a task
 */
export class ProcessTaskResponse {
  constructor(
    private isSuccessful: boolean,
    public error?: RemoteDataError,
    public payload?: any
  ) {
  }

  get hasSucceeded(): boolean {
    return this.isSuccessful;
  }
}
