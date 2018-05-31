import { Store } from '@ngrx/store';
import { SubmissionState } from '../../submission.reducers';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders } from '@angular/common/http';
import { HttpOptions } from '../../../core/dspace-rest-v2/dspace-rest-v2.service';

@Injectable()
export class DeduplicationService {

  constructor(private store: Store<SubmissionState>) {
  }

  // setWorkspaceDuplicated(payload: any): Observable<any> {
  //   const options: HttpOptions = Object.create({});
  //   let headers = new HttpHeaders();
  //   headers = headers.append('Content-Type', 'application/json');
  //   options.headers = headers;
  //   // TODO REST CALL
  //   // return this.restService.postToEndpoint('workspace/deduplication', payload, null, options);
  //   return Observable.of(payload);
  // }

  setWorkspaceDuplicationSuccess(payload: any): void {
    // TODO

  }

  setWorkspaceDuplicationError(payload: any): void {
    // TODO
  }

  // setWorkflowDuplicated(payload: any): Observable<any> {
  //   const options: HttpOptions = Object.create({});
  //   let headers = new HttpHeaders();
  //   headers = headers.append('Content-Type', 'application/json');
  //   options.headers = headers;
  //   // TODO REST CALL
  //   // return this.restService.postToEndpoint('workflow/deduplication', payload, null, options);
  //   return Observable.of(payload);
  // }

  setWorkflowDuplicationSuccess(payload: any): void {
    // TODO Update the redux store

  }

  setWorkflowDuplicationError(payload: any): void {
    // TODO Update the redux store
  }
}
