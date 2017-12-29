import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { submissionSelector, SubmissionState } from './submission.reducers';

// utils
import { isEmpty, isNotUndefined } from '../shared/empty.util';

@Injectable()
export class SubmissionService {

  constructor(private store: Store<SubmissionState>) {
  }

  getSectionsEnabled(submissionId: string): Observable<any> {
    return this.store.select(submissionSelector)
      .map((submissions: SubmissionState) => submissions.objects[ submissionId ]);
  }

  getSectionsState(submissionId: string): Observable<boolean> {
    return this.getSectionsEnabled(submissionId)
      .filter((item) => isNotUndefined(item))
      .map((item) => item.sections)
      .map((sections) => {
        const states = [];

        Object.keys(sections)
          .filter((property) => sections.hasOwnProperty(property))
          .filter((property) => sections[ property ].isValid === false)
          .forEach((property) => {
            states.push(sections[ property ].isValid)
          });

        return !isEmpty(sections) && isEmpty(states);
      })
      .distinctUntilChanged()
      .startWith(false)
  }
}
