import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { SubmissionState } from '../../submission.reducers';
import { DeleteBitstreamAction, EditBitstreamAction, NewBitstreamAction } from '../../objects/submission-objects.actions';
import { submissionBitstreamFromUuidSelector, submissionObjectFromIdSelector } from '../../selectors';
import {isUndefined} from "../../../shared/empty.util";

@Injectable()
export class BitstreamService {

  constructor(private store: Store<SubmissionState>) {}

  public getBitstreamList(submissionId): Observable<any> {
    return this.store.select(submissionObjectFromIdSelector(submissionId))
      .map((state) => {
        return state.bitstreams;
      })
      .distinctUntilChanged();
  }

  public getBitstream(submissionId, bitstreamId): Observable<any> {
    return this.store.select(submissionBitstreamFromUuidSelector(submissionId, bitstreamId))
      .filter((state) => !isUndefined(state))
      .map((state) => {
        return state;
      })
      .distinctUntilChanged();
  }

  public getDefaultPolicies(submissionId, bitstreamId): Observable<any> {
    return this.store.select(submissionBitstreamFromUuidSelector(submissionId, bitstreamId))
      .map((state) => {
        return state;
      })
      .distinctUntilChanged();
  }

  public setNewBitstream(submissionId, bitstreamId, data) {
    this.store.dispatch(
      new NewBitstreamAction(
        submissionId, bitstreamId, data
      )
    );
  }

  public editBitstream(submissionId, bitstreamId, data) {
    this.store.dispatch(
      new EditBitstreamAction(
        submissionId, bitstreamId, data
      )
    );
  }

  public deleteBitstream(submissionId, bitstreamId) {
    this.store.dispatch(
      new DeleteBitstreamAction(
        submissionId, bitstreamId
      )
    );
  }
}
