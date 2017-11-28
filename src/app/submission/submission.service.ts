import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { SubmissionState } from './submission.reducers';
import { submissionObjectFromIdSelector, submissionObjectSectionsFromIdSelector } from './selectors';

import { find } from 'lodash';
import { isEmpty, isNotEmpty, isNotUndefined } from '../shared/empty.util';
import { SubmissionSectionObject } from './objects/submission-objects.reducer';

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

  getSectionsEnabled(submissionId): Observable<any> {
    console.log(this.store);
    return this.store.select(submissionObjectSectionsFromIdSelector(submissionId))
      .distinctUntilChanged()
      .startWith(undefined)
  }

  getSectionsState(submissionId): Observable<boolean> {
    return this.getSectionsEnabled(submissionId)
      .filter((sections) => isNotUndefined(sections))
      .map((sections) => {
        const states = [];
        Object.keys(sections)
          .filter((property) => sections.hasOwnProperty(property))
          .filter((property) => sections[property].isValid === false)
          .forEach((property) => {
            states.push(sections[property].isValid)
          })
        console.log(sections);
        return isEmpty(states) ? true : false;
      })
      .startWith(false)
  }
}
