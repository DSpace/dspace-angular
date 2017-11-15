import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { SubmissionState } from '../../submission.reducers';
import { DeleteBitstreamAction, EditBitstreamAction, NewBitstreamAction } from '../../objects/submission-objects.actions';
import {
  submissionBitstreamFromUuidSelector,
  submissionSectionBitstreamsFromIdSelector
} from '../../selectors';
import { isUndefined } from '../../../shared/empty.util';

@Injectable()
export class BitstreamService {

  constructor(private store: Store<SubmissionState>) {}

  public getBitstreamList(submissionId, sectionId): Observable<any> {
    return this.store.select(submissionSectionBitstreamsFromIdSelector(submissionId, sectionId))
      .map((state) => state)
      .distinctUntilChanged();
  }

  public getBitstream(submissionId, sectionId, bitstreamId): Observable<any> {
    return this.store.select(submissionBitstreamFromUuidSelector(submissionId, sectionId, bitstreamId))
      .filter((state) => !isUndefined(state))
      .map((state) => state)
      .distinctUntilChanged();
  }

  public getDefaultPolicies(submissionId, sectionId, bitstreamId): Observable<any> {
    return this.store.select(submissionBitstreamFromUuidSelector(submissionId, sectionId, bitstreamId))
      .map((state) => state)
      .distinctUntilChanged();
  }

  public setNewBitstream(submissionId, sectionId, bitstreamId, data) {
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
