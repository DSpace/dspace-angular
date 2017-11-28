import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { SubmissionState } from '../../submission.reducers';
import { DeleteUploadedFileAction, EditFileDataAction, NewUploadedFileAction } from '../../objects/submission-objects.actions';
import {
  submissionUploadedFileFromUuidSelector,
  submissionUploadedFilesFromIdSelector
} from '../../selectors';
import { isUndefined } from '../../../shared/empty.util';
import { SubmissionUploadFileObject } from '../../models/submission-upload-file.model';

@Injectable()
export class SectionUploadService {

  constructor(private store: Store<SubmissionState>) {}

  public getUploadedFileList(submissionId: string, sectionId: string): Observable<any> {
    return this.store.select(submissionUploadedFilesFromIdSelector(submissionId, sectionId))
      .map((state) => state)
      .distinctUntilChanged();
  }

  public getFileData(submissionId: string, sectionId: string, fileId: string): Observable<any> {
    return this.store.select(submissionUploadedFileFromUuidSelector(submissionId, sectionId, fileId))
      .filter((state) => !isUndefined(state))
      .map((state) => state)
      .distinctUntilChanged();
  }

  public getDefaultPolicies(submissionId: string, sectionId: string, fileId: string): Observable<any> {
    return this.store.select(submissionUploadedFileFromUuidSelector(submissionId, sectionId, fileId))
      .map((state) => state)
      .distinctUntilChanged();
  }

  public setNewBitstream(submissionId: string, sectionId: string, fileId: string, data: SubmissionUploadFileObject) {
    this.store.dispatch(
      new NewUploadedFileAction(submissionId, sectionId, fileId, data)
    );
  }

  public editBitstream(submissionId: string, sectionId: string, fileId: string, data: SubmissionUploadFileObject) {
    this.store.dispatch(
      new EditFileDataAction(submissionId, sectionId, fileId, data)
    );
  }

  public deleteBitstream(submissionId: string, sectionId: string, fileId: string) {
    this.store.dispatch(
      new DeleteUploadedFileAction(submissionId, sectionId, fileId)
    );
  }
}
