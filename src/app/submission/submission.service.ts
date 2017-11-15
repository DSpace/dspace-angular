import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { SubmissionState } from './submission.reducers';
import { submissionObjectFromIdSelector } from './selectors';

@Injectable()
export class SubmissionService {

  constructor(private store: Store<SubmissionState>) {}
/*
  public getCollectionPolicies(submissionId): Observable<any> {
    return this.store.select(submissionObjectFromIdSelector(submissionId))
      .map((state) => {
        if (state.data.collection && state.data.collection.policies) {
          return state.data.collection.policies;
        } else {
          return [];
        }
      })
      .distinctUntilChanged();
  }

  public getCollectionName(submissionId): Observable<any> {
    return this.store.select(submissionObjectFromIdSelector(submissionId))
      .map((state) => {
         if (state.data.collection && state.data.collection.name) {
           return state.data.collection.name;
         } else {
           return null;
         }
      })
      .distinctUntilChanged();
  }

  public getCollectionPoliciesMessageType(submissionId): Observable<any> {
    return this.store.select(submissionObjectFromIdSelector(submissionId))
      .map((state) => {
         if (state.data.collection && state.data.collection.policiesMessageType) {
           return state.data.collection.policiesMessageType;
         } else {
           return null;
         }
      })
      .distinctUntilChanged();
  }*/
}
