import { Inject, Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

import { Observable, of as observableOf, Subscription, timer as observableTimer } from 'rxjs';
import { catchError, distinctUntilChanged, filter, first, map, startWith } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { ScrollToService } from '@nicky-lenaers/ngx-scroll-to';

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
  SetActiveSectionAction
} from './objects/submission-objects.actions';
import {
  SubmissionObjectEntry,
  SubmissionSectionEntry,
  SubmissionSectionError,
  SubmissionSectionObject
} from './objects/submission-objects.reducer';
import { submissionObjectFromIdSelector } from './selectors';
import { GlobalConfig } from '../../config/global-config.interface';
import { GLOBAL_CONFIG } from '../../config';
import { HttpOptions } from '../core/dspace-rest-v2/dspace-rest-v2.service';
import { SubmissionRestService } from './submission-rest.service';
import { SectionDataObject } from './sections/models/section-data.model';
import { SubmissionScopeType } from '../core/submission/submission-scope-type';
import { SubmissionObject } from '../core/submission/models/submission-object.model';
import { RouteService } from '../shared/services/route.service';
import { SectionsType } from './sections/sections-type';
import { NotificationsService } from '../shared/notifications/notifications.service';
import { SubmissionDefinitionsModel } from '../core/config/models/config-submission-definitions.model';
import { WorkspaceitemSectionsObject } from '../core/submission/models/workspaceitem-sections.model';

@Injectable()
export class SubmissionService {

  protected autoSaveSub: Subscription;
  protected timerObs: Observable<any>;

  constructor(@Inject(GLOBAL_CONFIG) protected EnvConfig: GlobalConfig,
              protected notificationsService: NotificationsService,
              protected restService: SubmissionRestService,
              protected router: Router,
              protected routeService: RouteService,
              protected scrollToService: ScrollToService,
              protected store: Store<SubmissionState>,
              protected translate: TranslateService) {
  }

  changeSubmissionCollection(submissionId, collectionId) {
    this.store.dispatch(new ChangeSubmissionCollectionAction(submissionId, collectionId));
  }

  createSubmission(): Observable<SubmissionObject> {
    return this.restService.postToEndpoint('workspaceitems', {}).pipe(
      map((workspaceitem: SubmissionObject) => workspaceitem[0]),
      catchError(() => observableOf({})))
  }

  depositSubmission(selfUrl: string): Observable<any> {
    const options: HttpOptions = Object.create({});
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'text/uri-list');
    options.headers = headers;
    return this.restService.postToEndpoint('workflowitems', selfUrl, null, options);
  }

  discardSubmission(submissionId: string): Observable<any> {
    return this.restService.deleteById(submissionId);
  }

  dispatchInit(
    collectionId: string,
    submissionId: string,
    selfUrl: string,
    submissionDefinition: SubmissionDefinitionsModel,
    sections: WorkspaceitemSectionsObject,
    errors: SubmissionSectionError[]) {
    this.store.dispatch(new InitSubmissionFormAction(collectionId, submissionId, selfUrl, submissionDefinition, sections, errors));
  }

  dispatchDeposit(submissionId) {
    this.store.dispatch(new SaveAndDepositSubmissionAction(submissionId));
  }

  dispatchDiscard(submissionId) {
    this.store.dispatch(new DiscardSubmissionAction(submissionId));
  }

  dispatchSave(submissionId) {
    this.store.dispatch(new SaveSubmissionFormAction(submissionId));
  }

  dispatchSaveForLater(submissionId) {
    this.store.dispatch(new SaveForLaterSubmissionFormAction(submissionId));
  }

  dispatchSaveSection(submissionId, sectionId) {
    this.store.dispatch(new SaveSubmissionFormAction(submissionId));
  }

  getActiveSectionId(submissionId: string): Observable<string> {
    return this.getSubmissionObject(submissionId).pipe(
      map((submission: SubmissionObjectEntry) => submission.activeSection));
  }

  getSubmissionObject(submissionId: string): Observable<SubmissionObjectEntry> {
    return this.store.select(submissionObjectFromIdSelector(submissionId)).pipe(
      filter((submission: SubmissionObjectEntry) => isNotUndefined(submission)));
  }

  getSubmissionSections(submissionId: string): Observable<SectionDataObject[]> {
    return this.getSubmissionObject(submissionId).pipe(
      filter((submission: SubmissionObjectEntry) => isNotUndefined(submission.sections) && !submission.isLoading),
      first(),
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

  getSubmissionObjectLinkName(): string {
    const url = this.router.routerState.snapshot.url;
    if (url.startsWith('/workspaceitems') || url.startsWith('/submit')) {
      return 'workspaceitems';
    } else if (url.startsWith('/workflowitems')) {
      return 'workflowitems';
    } else {
      return 'edititems';
    }
  }

  getSubmissionScope(): SubmissionScopeType {
    let scope: SubmissionScopeType;
    switch (this.getSubmissionObjectLinkName()) {
      case 'workspaceitems':
        scope = SubmissionScopeType.WorkspaceItem;
        break;
      case 'workflowitems':
        scope = SubmissionScopeType.WorkflowItem;
        break;
      case 'edititems':
        scope = SubmissionScopeType.EditItem;
        break;
    }
    return scope;
  }

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

  getSubmissionSaveProcessingStatus(submissionId: string): Observable<boolean> {
    return this.getSubmissionObject(submissionId).pipe(
      map((state: SubmissionObjectEntry) => state.savePending),
      distinctUntilChanged(),
      startWith(false));
  }

  getSubmissionDepositProcessingStatus(submissionId: string): Observable<boolean> {
    return this.getSubmissionObject(submissionId).pipe(
      map((state: SubmissionObjectEntry) => state.depositPending),
      distinctUntilChanged(),
      startWith(false));
  }

  isSectionHidden(sectionData: SubmissionSectionObject) {
    return (isNotUndefined(sectionData.visibility)
      && sectionData.visibility.main === 'HIDDEN'
      && sectionData.visibility.other === 'HIDDEN');

  }

  isSubmissionLoading(submissionId: string): Observable<boolean> {
    return this.getSubmissionObject(submissionId).pipe(
      map((submission: SubmissionObjectEntry) => submission.isLoading),
      distinctUntilChanged());
  }

  notifyNewSection(submissionId: string, sectionId: string, sectionType?: SectionsType) {
    this.translate.get('submission.sections.general.metadata-extracted-new-section', {sectionId}).pipe(
      first())
      .subscribe((m) => {
        this.notificationsService.info(null, m, null, true);
      });
  }

  redirectToMyDSpace() {
    const previousUrl = this.routeService.getPreviousUrl();
    if (isEmpty(previousUrl)) {
      this.router.navigate(['/mydspace']);
    } else {
      this.router.navigateByUrl(previousUrl);
    }
  }

  resetAllSubmissionObjects() {
    this.store.dispatch(new CancelSubmissionFormAction());
  }

  resetSubmissionObject(
    collectionId: string,
    submissionId: string,
    selfUrl: string,
    submissionDefinition: SubmissionDefinitionsModel,
    sections: WorkspaceitemSectionsObject
  ) {
    this.store.dispatch(new ResetSubmissionFormAction(collectionId, submissionId, selfUrl, sections, submissionDefinition));
  }

  retrieveSubmission(submissionId): Observable<SubmissionObject> {
    return this.restService.getDataById(this.getSubmissionObjectLinkName(), submissionId).pipe(
      filter((submissionObjects: SubmissionObject[]) => isNotUndefined(submissionObjects)),
      first(),
      map((submissionObjects: SubmissionObject[]) => submissionObjects[0]));
  }

  setActiveSection(submissionId, sectionId) {
    this.store.dispatch(new SetActiveSectionAction(submissionId, sectionId));
  }

  startAutoSave(submissionId) {
    this.stopAutoSave();
    console.log('AUTOSAVE ON!!!');
    // AUTOSAVE submission
    // Retrieve interval from config and convert to milliseconds
    const duration = this.EnvConfig.submission.autosave.timer * (1000 * 60);
    // Dispatch save action after given duration
    this.timerObs = observableTimer(duration, duration);
    this.autoSaveSub = this.timerObs
      .subscribe(() => this.store.dispatch(new SaveSubmissionFormAction(submissionId)));
  }

  stopAutoSave() {
    if (hasValue(this.autoSaveSub)) {
      console.log('AUTOSAVE OFFF!!!');
      this.autoSaveSub.unsubscribe();
      this.autoSaveSub = null;
    }
  }
}
