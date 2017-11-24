import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { SubmissionState } from '../../submission.reducers';
import { DeleteBitstreamAction, EditBitstreamAction, NewBitstreamAction } from '../../objects/submission-objects.actions';
import {
  submissionUploadedFileFromUuidSelector,
  submissionUploadedFilesFromIdSelector
} from '../../selectors';
import { isUndefined } from '../../../shared/empty.util';
import { SubmissionUploadFileObject } from '../../models/submission-upload-file.model';

@Injectable()
export class BitstreamService {

  constructor(private store: Store<SubmissionState>) {}

  public getBitstreamList(submissionId, sectionId): Observable<any> {
    return this.store.select(submissionUploadedFilesFromIdSelector(submissionId, sectionId))
      .map((state) => state)
      .distinctUntilChanged();
  }

  public getBitstream(submissionId, sectionId, bitstreamId): Observable<any> {
    return this.store.select(submissionUploadedFileFromUuidSelector(submissionId, sectionId, bitstreamId))
      .filter((state) => !isUndefined(state))
      .map((state) => state)
      .distinctUntilChanged();
  }

  public getDefaultPolicies(submissionId, sectionId, bitstreamId): Observable<any> {
    return this.store.select(submissionUploadedFileFromUuidSelector(submissionId, sectionId, bitstreamId))
      .map((state) => state)
      .distinctUntilChanged();
  }

  public setNewBitstream(submissionId: string, sectionId: string, bitstreamId: string, data: SubmissionUploadFileObject) {
    this.store.dispatch(
      new NewBitstreamAction(
        submissionId, sectionId, bitstreamId, data
      )
    );
  }

  public editBitstream(submissionId, sectionId, bitstreamId, data) {
    this.store.dispatch(
      new EditBitstreamAction(
        submissionId, sectionId, bitstreamId, data
      )
    );
  }

  public deleteBitstream(submissionId, sectionId, bitstreamId) {
    this.store.dispatch(
      new DeleteBitstreamAction(
        submissionId, sectionId, bitstreamId
      )
    );
  }
}
