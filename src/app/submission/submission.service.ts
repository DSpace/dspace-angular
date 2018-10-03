import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Store } from '@ngrx/store';

import { submissionSelector, SubmissionState } from './submission.reducers';
import { hasValue, isEmpty, isNotUndefined } from '../shared/empty.util';
import { SaveSubmissionFormAction, SetActiveSectionAction } from './objects/submission-objects.actions';
import {
  SubmissionObjectEntry,
  SubmissionSectionEntry,
  SubmissionSectionObject
} from './objects/submission-objects.reducer';
import { submissionObjectFromIdSelector } from './selectors';
import { GlobalConfig } from '../../config/global-config.interface';
import { GLOBAL_CONFIG } from '../../config';
import { HttpHeaders } from '@angular/common/http';
import { HttpOptions } from '../core/dspace-rest-v2/dspace-rest-v2.service';
import { SubmissionRestService } from './submission-rest.service';
import { SectionDataObject } from './sections/models/section-data.model';
import { SubmissionScopeType } from '../core/submission/submission-scope-type';
import { SubmissionObject } from '../core/submission/models/submission-object.model';
import { RouteService } from '../shared/services/route.service';
import { SectionsType } from './sections/sections-type';
import { TranslateService } from '@ngx-translate/core';
import { NotificationsService } from '../shared/notifications/notifications.service';
import { ScrollToConfigOptions, ScrollToService } from '@nicky-lenaers/ngx-scroll-to';
import { NotificationOptions } from '../shared/notifications/models/notification-options.model';

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

  createSubmission(): Observable<SubmissionObject> {
    return this.restService.postToEndpoint('workspaceitems', {})
      .map((workspaceitems) => workspaceitems[0])
      .catch(() => Observable.of({}))
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

  getActiveSectionId(submissionId: string): Observable<string> {
    return this.getSubmissionObject(submissionId)
      .map((submission: SubmissionObjectEntry) => submission.activeSection);
  }

  getSubmissionObject(submissionId: string): Observable<SubmissionObjectEntry> {
    return this.store.select(submissionObjectFromIdSelector(submissionId))
      .filter((submission: SubmissionObjectEntry) => isNotUndefined(submission))
  }

  getSubmissionSections(submissionId: string): Observable<SectionDataObject[]> {
    return this.getSubmissionObject(submissionId)
      .filter((submission: SubmissionObjectEntry) => isNotUndefined(submission.sections) && !submission.isLoading)
      .take(1)
      .map((submission: SubmissionObjectEntry) => submission.sections)
      .map((sections: SubmissionSectionEntry) => {
        const availableSections: SectionDataObject[] = [];
        Object.keys(sections)
          .filter((sectionId) => !this.isSectionHidden(sections[sectionId] as SubmissionSectionObject))
          // .filter((sectionId) => sections[sectionId].sectionType !== SectionsType.DetectDuplicate || isNotEmpty(sections[sectionId].data))
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
      })
      .startWith([])
      .distinctUntilChanged();
  }

  getDisabledSectionsList(submissionId: string): Observable<SectionDataObject[]> {
    return this.getSubmissionObject(submissionId)
      .filter((submission: SubmissionObjectEntry) => isNotUndefined(submission.sections) && !submission.isLoading)
      .map((submission: SubmissionObjectEntry) => submission.sections)
      .map((sections: SubmissionSectionEntry) => {
        const disabledSections: SectionDataObject[] = [];
        Object.keys(sections)
          .filter((sectionId) => !this.isSectionHidden(sections[sectionId] as SubmissionSectionObject))
          .filter((sectionId) => !sections[sectionId].enabled)
          .filter((sectionId) => sections[sectionId].sectionType !== SectionsType.DetectDuplicate)
          .forEach((sectionId) => {
            const sectionObject: SectionDataObject = Object.create({});
            sectionObject.header = sections[sectionId].header;
            sectionObject.id = sectionId;
            disabledSections.push(sectionObject);
          });
        return disabledSections;
      })
      .startWith([])
      .distinctUntilChanged();
  }

  isSectionHidden(sectionData: SubmissionSectionObject) {
    return (isNotUndefined(sectionData.visibility)
      && sectionData.visibility.main === 'HIDDEN'
      && sectionData.visibility.other === 'HIDDEN');

  }

  isSubmissionLoading(submissionId: string): Observable<boolean> {
    return this.getSubmissionObject(submissionId)
      .map((submission: SubmissionObjectEntry) => submission.isLoading)
      .distinctUntilChanged()
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
    return this.store.select(submissionSelector)
      .map((submissions: SubmissionState) => submissions.objects[submissionId])
      .filter((item) => isNotUndefined(item) && isNotUndefined(item.sections))
      .map((item) => item.sections)
      .map((sections) => {
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
      })
      .distinctUntilChanged()
      .startWith(false);
  }

  getSubmissionSaveProcessingStatus(submissionId: string): Observable<boolean> {
    return this.getSubmissionObject(submissionId)
      .map((state: SubmissionObjectEntry) => state.savePending)
      .distinctUntilChanged()
      .startWith(false);
  }

  getSubmissionDepositProcessingStatus(submissionId: string): Observable<boolean> {
    return this.getSubmissionObject(submissionId)
      .map((state: SubmissionObjectEntry) => state.depositPending)
      .distinctUntilChanged()
      .startWith(false);
  }

  getSubmissionDuplicateDecisionProcessingStatus(submissionId: string): Observable<boolean> {
    return this.getSubmissionObject(submissionId)
      .map((state: SubmissionObjectEntry) => state.saveDecisionPending)
      .distinctUntilChanged()
      .startWith(false);
  }

  redirectToMyDSpace() {
    const previousUrl = this.routeService.getPreviousUrl();
    if (isEmpty(previousUrl)) {
      this.router.navigate(['/mydspace']);
    } else {
      this.router.navigateByUrl(previousUrl);
    }
  }

  notifyNewSection(submissionId: string, sectionId: string, sectionType?: SectionsType) {

    if (sectionType === SectionsType.DetectDuplicate) {
      this.setActiveSection(submissionId, sectionId);
      this.translate.get('submission.sections.detect-duplicate.duplicate-detected', {sectionId})
        .take(1)
        .subscribe((msg) => {
          this.notificationsService.warning(null, msg, new NotificationOptions(0));
        });
      const config: ScrollToConfigOptions = {
        target: sectionId,
        offset: -70
      };

      this.scrollToService.scrollTo(config);
    } else {
      this.translate.get('submission.sections.general.metadata-extracted-new-section', {sectionId})
        .take(1)
        .subscribe((msg) => {
          this.notificationsService.info(null, msg, null, true);
        });
    }
  }
  retrieveSubmission(submissionId): Observable<SubmissionObject> {
    return this.restService.getDataById(this.getSubmissionObjectLinkName(), submissionId)
      .filter((submissionObjects: SubmissionObject[]) => isNotUndefined(submissionObjects))
      .take(1)
      .map((submissionObjects: SubmissionObject[]) => submissionObjects[0]);
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
    this.timerObs = Observable.timer(duration, duration);
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
