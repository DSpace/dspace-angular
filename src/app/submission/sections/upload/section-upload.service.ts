import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  map,
} from 'rxjs/operators';
import { JsonPatchOperationPathObject } from 'src/app/core/json-patch/builder/json-patch-operation-path-combiner';
import { JsonPatchOperationsBuilder } from 'src/app/core/json-patch/builder/json-patch-operations-builder';
import { WorkspaceitemSectionUploadObject } from 'src/app/core/submission/models/workspaceitem-section-upload.model';

import { WorkspaceitemSectionUploadFileObject } from '../../../core/submission/models/workspaceitem-section-upload-file.model';
import { isUndefined } from '../../../shared/empty.util';
import {
  DeleteUploadedFileAction,
  EditFileDataAction,
  EditFilePrimaryBitstreamAction,
  NewUploadedFileAction,
} from '../../objects/submission-objects.actions';
import {
  submissionSectionDataFromIdSelector,
  submissionUploadedFileFromUuidSelector,
  submissionUploadedFilesFromIdSelector,
} from '../../selectors';
import { SubmissionState } from '../../submission.reducers';

/**
 * A service that provides methods to handle submission's bitstream state.
 */
@Injectable({ providedIn: 'root' })
export class SectionUploadService {

  /**
   * Initialize service variables
   *
   * @param {Store<SubmissionState>} store
   * @param {JsonPatchOperationsBuilder} operationsBuilder
   */
  constructor(private store: Store<SubmissionState>, private operationsBuilder: JsonPatchOperationsBuilder) {}

  /**
   * Define and add an operation based on a change
   *
   * @param path
   *    The path to endpoint
   * @param intitialPrimary
   *    The initial primary indicator
   * @param primary
   *    the new primary indicator
    * @param fileId
   *    The file id
   * @returns {void}
   */
  public updatePrimaryBitstreamOperation(path: JsonPatchOperationPathObject, intitialPrimary: boolean | null, primary: boolean | null, fileId: string): void {
    if (intitialPrimary === null && primary) {
      this.operationsBuilder.add(path, fileId, false, true);
      return;
    }

    if (intitialPrimary !== primary) {
      if (primary) {
        this.operationsBuilder.replace(path, fileId, true);
        return;
      }
      this.operationsBuilder.remove(path);
    }
  }

  /**
   * Return submission's bitstream data from state
   *
   * @param submissionId
   *    The submission id
   * @param sectionId
   *    The section id
   * @returns {WorkspaceitemSectionUploadObject}
   *    Returns submission's bitstream data
   */
  public getUploadedFilesData(submissionId: string, sectionId: string): Observable<WorkspaceitemSectionUploadObject> {
    return this.store.select(submissionSectionDataFromIdSelector(submissionId, sectionId)).pipe(
      map((state) => state),
      distinctUntilChanged());
  }

  /**
   * Return submission's bitstream list from state
   *
   * @param submissionId
   *    The submission id
   * @param sectionId
   *    The section id
   * @returns {Array}
   *    Returns submission's bitstream list
   */
  public getUploadedFileList(submissionId: string, sectionId: string): Observable<any> {
    return this.store.select(submissionUploadedFilesFromIdSelector(submissionId, sectionId)).pipe(
      map((state) => state),
      distinctUntilChanged());
  }

  /**
   * Return bitstream's metadata
   *
   * @param submissionId
   *    The submission id
   * @param sectionId
   *    The section id
   * @param fileUUID
   *    The bitstream UUID
   * @returns {Observable}
   *    Emits bitstream's metadata
   */
  public getFileData(submissionId: string, sectionId: string, fileUUID: string): Observable<any> {
    return this.store.select(submissionUploadedFilesFromIdSelector(submissionId, sectionId)).pipe(
      filter((state) => !isUndefined(state)),
      map((state) => {
        let fileState;
        Object.keys(state)
          .filter((key) => state[key].uuid === fileUUID)
          .forEach((key) => fileState = state[key]);
        return fileState;
      }),
      distinctUntilChanged());
  }

  /**
   * Return bitstream's default policies
   *
   * @param submissionId
   *    The submission id
   * @param sectionId
   *    The section id
   * @param fileUUID
   *    The bitstream UUID
   * @returns {Observable}
   *    Emits bitstream's default policies
   */
  public getDefaultPolicies(submissionId: string, sectionId: string, fileUUID: string): Observable<any> {
    return this.store.select(submissionUploadedFileFromUuidSelector(submissionId, sectionId, fileUUID)).pipe(
      map((state) => state),
      distinctUntilChanged());
  }

  /**
   * Add a new bitstream to the state
   *
   * @param submissionId
   *    The submission id
   * @param sectionId
   *    The section id
   * @param fileUUID
   *    The bitstream UUID
   * @param data
   *    The [[WorkspaceitemSectionUploadFileObject]] object
   */
  public addUploadedFile(submissionId: string, sectionId: string, fileUUID: string, data: WorkspaceitemSectionUploadFileObject) {
    this.store.dispatch(
      new NewUploadedFileAction(submissionId, sectionId, fileUUID, data),
    );
  }

  /**
   * Update primary bitstream into the state
   *
   * @param submissionId
   *    The submission id
   * @param sectionId
   *    The section id
   * @param fileUUID
   *    The bitstream UUID
   */
  public updateFilePrimaryBitstream(submissionId: string, sectionId: string, fileUUID: string | null) {
    this.store.dispatch(
      new EditFilePrimaryBitstreamAction(submissionId, sectionId, fileUUID),
    );
  }

  /**
   * Update bitstream metadata into the state
   *
   * @param submissionId
   *    The submission id
   * @param sectionId
   *    The section id
   * @param fileUUID
   *    The bitstream UUID
   * @param data
   *    The [[WorkspaceitemSectionUploadFileObject]] object
   */
  public updateFileData(submissionId: string, sectionId: string, fileUUID: string, data: WorkspaceitemSectionUploadFileObject) {
    this.store.dispatch(
      new EditFileDataAction(submissionId, sectionId, fileUUID, data),
    );
  }

  /**
   * Remove bitstream from the state
   *
   * @param submissionId
   *    The submission id
   * @param sectionId
   *    The section id
   * @param fileUUID
   *    The bitstream UUID
   */
  public removeUploadedFile(submissionId: string, sectionId: string, fileUUID: string) {
    this.store.dispatch(
      new DeleteUploadedFileAction(submissionId, sectionId, fileUUID),
    );
  }
}
