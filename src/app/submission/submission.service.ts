import { Inject, Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

import { Observable, of as observableOf, Subscription, timer as observableTimer } from 'rxjs';
import {
  catchError, concatMap,
  distinctUntilChanged,
  filter,
  find,
  map,
  startWith, take, tap
} from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';

import { submissionSelector, SubmissionState } from './submission.reducers';
import { hasValue, isEmpty, isNotUndefined } from '../shared/empty.util';
import {
  CancelSubmissionFormAction,
  ChangeSubmissionCollectionAction,
  DiscardSubmissionAction,
  InitSubmissionFormAction,
  ResetSubmissionFormAction,
  SaveAndDepositSubmissionAction,
  SaveForLaterSubmissionFormAction,
  SaveSubmissionFormAction,
  SaveSubmissionSectionFormAction,
  SetActiveSectionAction
} from './objects/submission-objects.actions';
import { SubmissionObjectEntry, SubmissionSectionEntry, SubmissionSectionError, SubmissionSectionObject } from './objects/submission-objects.reducer';
import { submissionObjectFromIdSelector } from './selectors';
import { GlobalConfig } from '../../config/global-config.interface';
import { GLOBAL_CONFIG } from '../../config';
import { HttpOptions } from '../core/dspace-rest-v2/dspace-rest-v2.service';
import { SubmissionRestService } from '../core/submission/submission-rest.service';
import { SectionDataObject } from './sections/models/section-data.model';
import { SubmissionScopeType } from '../core/submission/submission-scope-type';
import { SubmissionObject } from '../core/submission/models/submission-object.model';
import { RouteService } from '../core/services/route.service';
import { SectionsType } from './sections/sections-type';
import { NotificationsService } from '../shared/notifications/notifications.service';
import { SubmissionDefinitionsModel } from '../core/config/models/config-submission-definitions.model';
import { WorkspaceitemSectionsObject } from '../core/submission/models/workspaceitem-sections.model';
import { RemoteData } from '../core/data/remote-data';
import { ErrorResponse } from '../core/cache/response.models';
import { RemoteDataError } from '../core/data/remote-data-error';
import {
  createFailedRemoteDataObject$,
  createSuccessfulRemoteDataObject,
  createSuccessfulRemoteDataObject$
} from '../shared/testing/utils';
import { RequestService } from '../core/data/request.service';
import { SearchService } from '../core/shared/search/search.service';

/**
 * A service that provides methods used in submission process.
 */
@Injectable()
export class SubmissionService {

  /**
   * Subscription
   */
  protected autoSaveSub: Subscription;

  /**
   * Observable used as timer
   */
  protected timer$: Observable<any>;

  private workspaceLinkPath = 'workspaceitems';
  private workflowLinkPath = 'workflowitems';
  /**
   * Initialize service variables
   * @param {GlobalConfig} EnvConfig
   * @param {NotificationsService} notificationsService
   * @param {SubmissionRestService} restService
   * @param {Router} router
   * @param {RouteService} routeService
   * @param {Store<SubmissionState>} store
   * @param {TranslateService} translate
   * @param {SearchService} searchService
   * @param {RequestService} requestService
   */
  constructor(@Inject(GLOBAL_CONFIG) protected EnvConfig: GlobalConfig,
              protected notificationsService: NotificationsService,
              protected restService: SubmissionRestService,
              protected router: Router,
              protected routeService: RouteService,
              protected store: Store<SubmissionState>,
              protected translate: TranslateService,
              protected searchService: SearchService,
              protected requestService: RequestService) {
  }

  /**
   * Dispatch a new [ChangeSubmissionCollectionAction]
   *
   * @param submissionId
   *    The submission id
   * @param collectionId
   *    The collection id
   */
  changeSubmissionCollection(submissionId, collectionId) {
    this.store.dispatch(new ChangeSubmissionCollectionAction(submissionId, collectionId));
  }

  /**
   * Perform a REST call to create a new workspaceitem and return response
   *
   * @param collectionId
   *    The owning collection id
   * @return Observable<SubmissionObject>
   *    observable of SubmissionObject
   */
  createSubmission(collectionId?: string): Observable<SubmissionObject> {
    return this.restService.postToEndpoint(this.workspaceLinkPath, {}, null, null, collectionId).pipe(
      map((workspaceitem: SubmissionObject) => workspaceitem[0]),
      catchError(() => observableOf({})))
  }

  /**
   * Perform a REST call to deposit a workspaceitem and return response
   *
   * @param selfUrl
   *    The workspaceitem self url
   * @return Observable<SubmissionObject>
   *    observable of SubmissionObject
   */
  depositSubmission(selfUrl: string): Observable<SubmissionObject[]> {
    const options: HttpOptions = Object.create({});
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'text/uri-list');
    options.headers = headers;
    return this.restService.postToEndpoint(this.workflowLinkPath, selfUrl, null, options) as Observable<SubmissionObject[]>;
  }

  /**
   * Perform a REST call to delete a workspaceitem and return response
   *
   * @param submissionId
   *    The submission id
   * @return Observable<SubmissionObject>
   *    observable of SubmissionObject
   */
  discardSubmission(submissionId: string): Observable<SubmissionObject[]> {
    return this.restService.deleteById(submissionId) as Observable<SubmissionObject[]>;
  }

  /**
   * Dispatch a new [InitSubmissionFormAction]
   *
   * @param collectionId
   *    The collection id
   * @param submissionId
   *    The submission id
   * @param selfUrl
   *    The workspaceitem self url
   * @param submissionDefinition
   *    The [SubmissionDefinitionsModel] that define submission configuration
   * @param sections
   *    The [WorkspaceitemSectionsObject] that define submission sections init data
   * @param errors
   *    The [SubmissionSectionError] that define submission sections init errors
   */
  dispatchInit(
    collectionId: string,
    submissionId: string,
    selfUrl: string,
    submissionDefinition: SubmissionDefinitionsModel,
    sections: WorkspaceitemSectionsObject,
    errors: SubmissionSectionError[]) {
    this.store.dispatch(new InitSubmissionFormAction(collectionId, submissionId, selfUrl, submissionDefinition, sections, errors));
  }

  /**
   * Dispatch a new [SaveAndDepositSubmissionAction]
   *
   * @param submissionId
   *    The submission id
   */
  dispatchDeposit(submissionId) {
    this.store.dispatch(new SaveAndDepositSubmissionAction(submissionId));
  }

  /**
   * Dispatch a new [DiscardSubmissionAction]
   *
   * @param submissionId
   *    The submission id
   */
  dispatchDiscard(submissionId) {
    this.store.dispatch(new DiscardSubmissionAction(submissionId));
  }

  /**
   * Dispatch a new [SaveSubmissionFormAction]
   *
   * @param submissionId
   *    The submission id
   */
  dispatchSave(submissionId) {
    this.getSubmissionSaveProcessingStatus(submissionId).pipe(
      find((isPending: boolean) => !isPending)
    ).subscribe(() => {
      this.store.dispatch(new SaveSubmissionFormAction(submissionId));
    })
  }

  /**
   * Dispatch a new [SaveForLaterSubmissionFormAction]
   *
   * @param submissionId
   *    The submission id
   */
  dispatchSaveForLater(submissionId) {
    this.store.dispatch(new SaveForLaterSubmissionFormAction(submissionId));
  }

  /**
   * Dispatch a new [SaveSubmissionSectionFormAction]
   *
   * @param submissionId
   *    The submission id
   * @param sectionId
   *    The section id
   */
  dispatchSaveSection(submissionId, sectionId) {
    this.store.dispatch(new SaveSubmissionSectionFormAction(submissionId, sectionId));
  }

  /**
   * Return the id of the current focused section for the specified submission
   *
   * @param submissionId
   *    The submission id
   * @return Observable<string>
   *    observable of section id
   */
  getActiveSectionId(submissionId: string): Observable<string> {
    return this.getSubmissionObject(submissionId).pipe(
      map((submission: SubmissionObjectEntry) => submission.activeSection));
  }

  /**
   * Return the [SubmissionObjectEntry] for the specified submission
   *
   * @param submissionId
   *    The submission id
   * @return Observable<SubmissionObjectEntry>
   *    observable of SubmissionObjectEntry
   */
  getSubmissionObject(submissionId: string): Observable<SubmissionObjectEntry> {
    return this.store.select(submissionObjectFromIdSelector(submissionId)).pipe(
      filter((submission: SubmissionObjectEntry) => isNotUndefined(submission)));
  }

  /**
   * Return a list of the active [SectionDataObject] belonging to the specified submission
   *
   * @param submissionId
   *    The submission id
   * @return Observable<SubmissionObjectEntry>
   *    observable with the list of active submission's sections
   */
  getSubmissionSections(submissionId: string): Observable<SectionDataObject[]> {
    return this.getSubmissionObject(submissionId).pipe(
      find((submission: SubmissionObjectEntry) => isNotUndefined(submission.sections) && !submission.isLoading),
      map((submission: SubmissionObjectEntry) => submission.sections),
      map((sections: SubmissionSectionEntry) => {
        const availableSections: SectionDataObject[] = [];
        Object.keys(sections)
          .filter((sectionId) => !this.isSectionHidden(sections[sectionId] as SubmissionSectionObject))
          .forEach((sectionId) => {
            const sectionObject: SectionDataObject = Object.create({});
            sectionObject.config = sections[sectionId].config;
            sectionObject.mandatory = sections[sectionId].mandatory;
            sectionObject.data = sections[sectionId].data;
            sectionObject.errors = sections[sectionId].errors;
            sectionObject.header = sections[sectionId].header;
            sectionObject.id = sectionId;
            sectionObject.sectionType = sections[sectionId].sectionType;
            availableSections.push(sectionObject);
          });
        return availableSections;
      }),
      startWith([]),
      distinctUntilChanged());
  }

  /**
   * Return a list of the disabled [SectionDataObject] belonging to the specified submission
   *
   * @param submissionId
   *    The submission id
   * @return Observable<SubmissionObjectEntry>
   *    observable with the list of disabled submission's sections
   */
  getDisabledSectionsList(submissionId: string): Observable<SectionDataObject[]> {
    return this.getSubmissionObject(submissionId).pipe(
      filter((submission: SubmissionObjectEntry) => isNotUndefined(submission.sections) && !submission.isLoading),
      map((submission: SubmissionObjectEntry) => submission.sections),
      map((sections: SubmissionSectionEntry) => {
        const disabledSections: SectionDataObject[] = [];
        Object.keys(sections)
          .filter((sectionId) => !this.isSectionHidden(sections[sectionId] as SubmissionSectionObject))
          .filter((sectionId) => !sections[sectionId].enabled)
          .forEach((sectionId) => {
            const sectionObject: SectionDataObject = Object.create({});
            sectionObject.header = sections[sectionId].header;
            sectionObject.id = sectionId;
            disabledSections.push(sectionObject);
          });
        return disabledSections;
      }),
      startWith([]),
      distinctUntilChanged());
  }

  /**
   * Return the correct REST endpoint link path depending on the page route
   *
   * @return string
   *    link path
   */
  getSubmissionObjectLinkName(): string {
    const url = this.router.routerState.snapshot.url;
    if (url.startsWith('/workspaceitems') || url.startsWith('/submit')) {
      return this.workspaceLinkPath;
    } else if (url.startsWith('/workflowitems')) {
      return this.workflowLinkPath;
    } else {
      return 'edititems';
    }
  }

  /**
   * Return the submission scope
   *
   * @return SubmissionScopeType
   *    the SubmissionScopeType
   */
  getSubmissionScope(): SubmissionScopeType {
    let scope: SubmissionScopeType;
    switch (this.getSubmissionObjectLinkName()) {
      case this.workspaceLinkPath:
        scope = SubmissionScopeType.WorkspaceItem;
        break;
      case this.workflowLinkPath:
        scope = SubmissionScopeType.WorkflowItem;
        break;
    }
    return scope;
  }

  /**
   * Return the validity status of the submission
   *
   * @param submissionId
   *    The submission id
   * @return Observable<boolean>
   *    observable with submission validity status
   */
  getSubmissionStatus(submissionId: string): Observable<boolean> {
    return this.store.select(submissionSelector).pipe(
      map((submissions: SubmissionState) => submissions.objects[submissionId]),
      filter((item) => isNotUndefined(item) && isNotUndefined(item.sections)),
      map((item) => item.sections),
      map((sections) => {
        const states = [];

        if (isNotUndefined(sections)) {
          Object.keys(sections)
            .filter((sectionId) => sections.hasOwnProperty(sectionId))
            .filter((sectionId) => !this.isSectionHidden(sections[sectionId] as SubmissionSectionObject))
            .filter((sectionId) => sections[sectionId].enabled)
            .filter((sectionId) => sections[sectionId].isValid === false)
            .forEach((sectionId) => {
              states.push(sections[sectionId].isValid);
            });
        }

        return !isEmpty(sections) && isEmpty(states);
      }),
      distinctUntilChanged(),
      startWith(false));
  }

  /**
   * Return the save processing status of the submission
   *
   * @param submissionId
   *    The submission id
   * @return Observable<boolean>
   *    observable with submission save processing status
   */
  getSubmissionSaveProcessingStatus(submissionId: string): Observable<boolean> {
    return this.getSubmissionObject(submissionId).pipe(
      map((state: SubmissionObjectEntry) => state.savePending),
      distinctUntilChanged(),
      startWith(false));
  }

  /**
   * Return the deposit processing status of the submission
   *
   * @param submissionId
   *    The submission id
   * @return Observable<boolean>
   *    observable with submission deposit processing status
   */
  getSubmissionDepositProcessingStatus(submissionId: string): Observable<boolean> {
    return this.getSubmissionObject(submissionId).pipe(
      map((state: SubmissionObjectEntry) => state.depositPending),
      distinctUntilChanged(),
      startWith(false));
  }

  /**
   * Return the visibility status of the specified section
   *
   * @param sectionData
   *    The section data
   * @return boolean
   *    true if section is hidden, false otherwise
   */
  isSectionHidden(sectionData: SubmissionSectionObject): boolean {
    return (isNotUndefined(sectionData.visibility)
      && sectionData.visibility.main === 'HIDDEN'
      && sectionData.visibility.other === 'HIDDEN');
  }

  /**
   * Return the loading status of the submission
   *
   * @param submissionId
   *    The submission id
   * @return Observable<boolean>
   *    observable with submission loading status
   */
  isSubmissionLoading(submissionId: string): Observable<boolean> {
    return this.getSubmissionObject(submissionId).pipe(
      map((submission: SubmissionObjectEntry) => submission.isLoading),
      distinctUntilChanged());
  }

  /**
   * Show a notification when a new section is added to submission form
   *
   * @param submissionId
   *    The submission id
   * @param sectionId
   *    The section id
   * @param sectionType
   *    The section type
   */
  notifyNewSection(submissionId: string, sectionId: string, sectionType?: SectionsType) {
    const m = this.translate.instant('submission.sections.general.metadata-extracted-new-section', { sectionId });
    this.notificationsService.info(null, m, null, true);
  }

  /**
   * Redirect to MyDspace page
   */
  redirectToMyDSpace() {
    // This assures that the cache is empty before redirecting to mydspace.
    // See https://github.com/DSpace/dspace-angular/pull/468
    this.searchService.getEndpoint().pipe(
      take(1),
      tap((url) => this.requestService.removeByHrefSubstring(url)),
      // Now, do redirect.
      concatMap(
        () => this.routeService.getPreviousUrl().pipe(
          take(1),
          tap((previousUrl) => {
            if (isEmpty(previousUrl) || !previousUrl.startsWith('/mydspace')) {
              this.router.navigate(['/mydspace']);
            } else {
              this.router.navigateByUrl(previousUrl);
            }
        })))
    ).subscribe();
  }

  /**
   * Dispatch a new [CancelSubmissionFormAction]
   */
  resetAllSubmissionObjects() {
    this.store.dispatch(new CancelSubmissionFormAction());
  }

  /**
   * Dispatch a new [ResetSubmissionFormAction]
   *
   * @param collectionId
   *    The collection id
   * @param submissionId
   *    The submission id
   * @param selfUrl
   *    The workspaceitem self url
   * @param submissionDefinition
   *    The [SubmissionDefinitionsModel] that define submission configuration
   * @param sections
   *    The [WorkspaceitemSectionsObject] that define submission sections init data
   */
  resetSubmissionObject(
    collectionId: string,
    submissionId: string,
    selfUrl: string,
    submissionDefinition: SubmissionDefinitionsModel,
    sections: WorkspaceitemSectionsObject
  ) {
    this.store.dispatch(new ResetSubmissionFormAction(collectionId, submissionId, selfUrl, sections, submissionDefinition));
  }

  /**
   * Perform a REST call to retrieve an existing workspaceitem/workflowitem and return response
   *
   * @return Observable<RemoteData<SubmissionObject>>
   *    observable of RemoteData<SubmissionObject>
   */
  retrieveSubmission(submissionId): Observable<RemoteData<SubmissionObject>> {
    return this.restService.getDataById(this.getSubmissionObjectLinkName(), submissionId).pipe(
      find((submissionObjects: SubmissionObject[]) => isNotUndefined(submissionObjects)),
      map((submissionObjects: SubmissionObject[]) => createSuccessfulRemoteDataObject(
        submissionObjects[0])),
      catchError((errorResponse: ErrorResponse) => {
        return createFailedRemoteDataObject$(null,
          new RemoteDataError(errorResponse.statusCode, errorResponse.statusText, errorResponse.errorMessage)
        )
      })
    );
  }

  /**
   * Dispatch a new [SetActiveSectionAction]
   *
   * @param submissionId
   *    The submission id
   * @param sectionId
   *    The section id
   */
  setActiveSection(submissionId, sectionId) {
    this.store.dispatch(new SetActiveSectionAction(submissionId, sectionId));
  }

  /**
   * Allow to save automatically the submission
   *
   * @param submissionId
   *    The submission id
   */
  startAutoSave(submissionId) {
    this.stopAutoSave();
    // AUTOSAVE submission
    // Retrieve interval from config and convert to milliseconds
    const duration = this.EnvConfig.submission.autosave.timer * (1000 * 60);
    // Dispatch save action after given duration
    this.timer$ = observableTimer(duration, duration);
    this.autoSaveSub = this.timer$
      .subscribe(() => this.store.dispatch(new SaveSubmissionFormAction(submissionId)));
  }

  /**
   * Unsubscribe subscription to timer
   */
  stopAutoSave() {
    if (hasValue(this.autoSaveSub)) {
      this.autoSaveSub.unsubscribe();
      this.autoSaveSub = null;
    }
  }
}
