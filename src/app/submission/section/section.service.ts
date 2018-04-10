import { Injectable, ViewContainerRef } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { createSelector, Store } from '@ngrx/store';

import { SectionFactoryComponent } from './section.factory';
import { submissionSelector, SubmissionState } from '../submission.reducers';

import { hasValue, isNotEmpty, isNotUndefined, isUndefined } from '../../shared/empty.util';
import {
  DisableSectionAction,
  EnableSectionAction,
  InertSectionErrorsAction,
  UpdateSectionDataAction
} from '../objects/submission-objects.actions';
import {
  SubmissionObjectEntry,
  SubmissionSectionError,
  SubmissionSectionObject
} from '../objects/submission-objects.reducer';
import {
  sectionDefinitionFromIdSelector,
  submissionDefinitionFromIdSelector,
  submissionObjectFromIdSelector,
  submissionSectionFromIdSelector
} from '../selectors';
import { SubmissionSectionModel } from '../../core/shared/config/config-submission-section.model';
import { SectionDataObject } from './section-data.model';
import {
  WorkspaceitemSectionDataType,
  WorkspaceitemSectionsObject
} from '../../core/submission/models/workspaceitem-sections.model';
import { ScrollToConfigOptions, ScrollToService } from '@nicky-lenaers/ngx-scroll-to';

@Injectable()
export class SectionService {

  private viewContainerRef: ViewContainerRef;

  constructor(private scrollToService: ScrollToService,
              private sectionFactory: SectionFactoryComponent,
              private store: Store<SubmissionState>) {
  }

  initViewContainer(viewContainerRef: ViewContainerRef) {
    this.viewContainerRef = viewContainerRef;
  }

  clearViewContainer() {
    this.viewContainerRef.clear();
  }

  /*private getDefinitionSections(definitionId: string) {
    return this.store.select(submissionDefinitionFromIdSelector(definitionId))
      .filter((state) => !isUndefined(state))
      .map((state) => state.sections)
      .distinctUntilChanged();
  }*/

  public getAvailableSectionList(submissionId, definitionId): Observable<any> {
    const submissionObjectsSelector = createSelector(submissionSelector, (state: SubmissionState) => state.objects);
    return this.store.select(submissionDefinitionFromIdSelector(definitionId))
      .flatMap((definition) => {
        let availableSections: any[] = [];
        return this.store.select(submissionObjectsSelector)
          .map((submissionState) => {
            if (!isUndefined(definition)) {
              availableSections = [];
              Object.keys(definition.sections).forEach((sectionId) => {
                if (!isUndefined(submissionState[submissionId])
                  && !isUndefined(submissionState[submissionId].sections)
                  && Object.keys(submissionState[submissionId].sections).length !== 0
                  && !submissionState[submissionId].sections.hasOwnProperty(sectionId)
                  && !this.isSectionHidden(definition.sections[sectionId])) {
                  availableSections.push({
                    id: sectionId,
                    header: definition.sections[sectionId].header
                  } as SectionDataObject);
                }
              });
            }
            return availableSections;
          })
      })
  }

  public getSectionDefinition(definitionId, sectionId): Observable<SubmissionSectionModel> {
    return this.store.select(sectionDefinitionFromIdSelector(definitionId, sectionId))
      .map((panel: SubmissionSectionModel) => panel)
      .distinctUntilChanged();
  }

  public getSectionState(submissionId, sectionId): Observable<SubmissionSectionObject> {
    return this.store.select(submissionSectionFromIdSelector(submissionId, sectionId))
      .filter((sectionObj) => hasValue(sectionObj))
      .map((sectionObj: SubmissionSectionObject) => sectionObj)
      .distinctUntilChanged();
  }

  public isSectionValid(submissionId, sectionId): Observable<boolean> {
    return this.store.select(submissionSectionFromIdSelector(submissionId, sectionId))
      .filter((sectionObj) => hasValue(sectionObj))
      .map((sectionObj: SubmissionSectionObject) => sectionObj.isValid)
      .distinctUntilChanged();
  }

  public isSectionLoaded(submissionId, sectionId): Observable<boolean> {
    return this.store.select(submissionObjectFromIdSelector(submissionId))
      .filter((submissionState: SubmissionObjectEntry) => isNotUndefined(submissionState))
      .map((submissionState: SubmissionObjectEntry) => {
        return isNotUndefined(submissionState.sections) && isNotUndefined(submissionState.sections[sectionId]);
      })
      .distinctUntilChanged();
  }

  public loadDefaultSections(collectionId: string,
                             submissionId: string,
                             definitionId: string,
                             sections: WorkspaceitemSectionsObject) {
    this.store.select(submissionDefinitionFromIdSelector(definitionId))
      .distinctUntilChanged()
      .filter((state) => !isUndefined(state))
      .filter((state) => !isUndefined(state.sections))
      .take(1)
      .subscribe((state) => {
        Object.keys(state.sections)
          .filter((sectionId) => state.sections[sectionId].mandatory || (isNotEmpty(sections) && sections.hasOwnProperty(sectionId)))
          .filter((sectionId) => !this.isSectionHidden(state.sections[sectionId]))
          .map((sectionId) => {
            const sectionData = (isNotUndefined(sections) && isNotUndefined(sections[sectionId])) ? sections[sectionId] : Object.create(null);
            this.loadSection(collectionId, submissionId, definitionId, sectionId, sectionData, null);
          })
      })
  }

  protected isSectionHidden(sectionData: SubmissionSectionModel) {
    return (isNotUndefined(sectionData.visibility)
      && sectionData.visibility.main === 'HIDDEN'
      && sectionData.visibility.other === 'HIDDEN');

  }

  private loadSection(collectionId: string,
                      submissionId: string,
                      definitionId: string,
                      sectionId: string,
                      sectionData: WorkspaceitemSectionDataType,
                      sectionErrors: SubmissionSectionError[],
                      scrollTo: boolean = false) {
    this.getSectionDefinition(definitionId, sectionId)
      .filter((sectionObj: SubmissionSectionModel) => isNotUndefined(sectionObj))
      .take(1)
      .subscribe((sectionObj: SubmissionSectionModel) => {
        const componentRef = this.sectionFactory.get(collectionId, submissionId, sectionId, sectionData, sectionObj, this.viewContainerRef);
        const viewIndex = this.viewContainerRef.indexOf(componentRef.hostView);
        if (scrollTo) {
          const config: ScrollToConfigOptions = {
            target: sectionId
          };

          this.scrollToService.scrollTo(config);
        }
        this.store.dispatch(new EnableSectionAction(submissionId, sectionId, viewIndex, sectionData, sectionErrors));
      });
  }

  public addSection(collectionId: string,
                    submissionId: string,
                    definitionId: string,
                    sectionId: string,
                    sectionData: WorkspaceitemSectionDataType = null,
                    sectionErrors: SubmissionSectionError[] = []) {
    this.loadSection(collectionId, submissionId, definitionId, sectionId, sectionData, sectionErrors, true);
  }

  public removeSection(submissionId, sectionId) {
    this.getSectionState(submissionId, sectionId)
      .take(1)
      .subscribe((sectionObject: SubmissionSectionObject) => {
        this.viewContainerRef.remove(sectionObject.sectionViewIndex);
        this.store.dispatch(new DisableSectionAction(submissionId, sectionId));
      });
  }

  public removeAllSections(submissionId) {
    this.store.select(submissionObjectFromIdSelector(submissionId))
      .filter((submission: SubmissionObjectEntry) => isNotUndefined(submission))
      .take(1)
      .subscribe((submission: SubmissionObjectEntry) => {
        Object.keys(submission.sections)
          .forEach((sectionId) => {
            this.viewContainerRef.remove(submission.sections[sectionId].sectionViewIndex);
          });
      });
  }

  public updateSectionData(submissionId, sectionId, data) {
    if (isNotEmpty(data)) {
      this.isSectionLoaded(submissionId, sectionId)
        .take(1)
        .filter((loaded) => loaded)
        .subscribe((loaded: boolean) => {
          this.store.dispatch(new UpdateSectionDataAction(submissionId, sectionId, data, []));
        });
    }
  }

  public setSectionError(submissionId: string, sectionId: string, errors: SubmissionSectionError[]) {
    this.store.dispatch(new InertSectionErrorsAction(submissionId, sectionId, errors));
  }
}
