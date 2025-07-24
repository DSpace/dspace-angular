import { of } from 'rxjs';

export class FileServiceStub {
  retrieveFileDownloadLink() {
    return of(null);
  }
}
