import { Injectable, ViewContainerRef } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { createSelector, Store } from '@ngrx/store';

import { PanelFactoryComponent } from './panel.factory';
import { submissionSelector, SubmissionState } from '../submission.reducers';

import { isUndefined } from '../../shared/empty.util';

import { PanelObject } from '../definitions/submission-definitions.reducer';
import { DisablePanelAction, EnablePanelAction } from '../objects/submission-objects.actions';
import { SubmissionObjectEntry, SubmissionPanelObject } from '../objects/submission-objects.reducer';
import {
  panelDefinitionFromIdSelector,
  submissionDefinitionFromIdSelector, submissionObjectFromIdSelector,
  submissionPanelFromIdSelector
} from '../selectors';

import { SubmissionDefinitionsConfigService } from '../../core/config/submission-definitions-config.service';
import { SubmissionSectionsConfigService } from '../../core/config/submission-sections-config.service';

@Injectable()
export class PanelService {
  private _viewContainerRef: ViewContainerRef;

  constructor(private definitionsConfigService: SubmissionDefinitionsConfigService,
              private sectionsConfigService: SubmissionSectionsConfigService,
              private panelFactory: PanelFactoryComponent,
              private store: Store<SubmissionState>) {}

  initViewContainer(viewContainerRef: ViewContainerRef) {
    this._viewContainerRef = viewContainerRef;
  }

  private getDefinitionPanels(definitionId: string) {
    return this.store.select(submissionDefinitionFromIdSelector(definitionId))
      .filter((state) => !isUndefined(state))
      .map((state) => state.panels)
      .distinctUntilChanged();
  }

  getAvailablePanelList(submissionId, definitionId): Observable<any> {
    const submissionObjectsSelector = createSelector(submissionSelector, (state: SubmissionState) => state.objects);
    return this.store.select(submissionDefinitionFromIdSelector(definitionId))
      .flatMap((definition) => {
        let availablePanels: any[] = [];
        return this.store.select(submissionObjectsSelector)
          .map((submissionState) => {
            if (!isUndefined(definition)) {
              availablePanels = [];
              Object.keys(definition.panels).forEach((panelId) => {
                if (!isUndefined(submissionState[submissionId])
                  && !isUndefined(submissionState[submissionId].panels)
                  && Object.keys(submissionState[submissionId].panels).length !== 0
                  && !submissionState[submissionId].panels.hasOwnProperty(panelId)) {
                  availablePanels.push({panelId: panelId, panelHeader: definition.panels[panelId].header});
                }
              });
            }
            return availablePanels;
          })
      })
  }

  /*getAvailablePanelList(submissionId, definitionId): Observable<any> {
    let panelList: any;
    this.getDefinitionPanels(definitionId)
      .subscribe((panels) => {
        panelList = panels;
      });
    const submissionObjectsSelector = createSelector(submissionSelector, (state: SubmissionState) => state.objects);
    return this.store.select(submissionObjectsSelector)
      .map((submissionState) => {
        const availablePanels: any[] = [];
        if (!isUndefined(panelList)) {
          Object.keys(panelList).forEach((panelId) => {
            if (!isUndefined(submissionState[submissionId])
              && !isUndefined(submissionState[submissionId].panels)
              && Object.keys(submissionState[submissionId].panels).length !== 0
              && !submissionState[submissionId].panels.hasOwnProperty(panelId)) {
              availablePanels.push({panelId: panelId, panelHeader: panelList[panelId].header});
            }
          });
        }
        return availablePanels;
      })
      .distinctUntilChanged();
  }*/

  getPanelDefinition(definitionId, panelId): Observable<PanelObject> {
    return this.store.select(panelDefinitionFromIdSelector(definitionId, panelId))
      .map((panel: PanelObject) => panel)
      .distinctUntilChanged();
  }

  getPanelState(submissionId, panelId): Observable<SubmissionPanelObject> {
    return this.store.select(submissionPanelFromIdSelector(submissionId, panelId))
      .map((panel: SubmissionPanelObject) => panel)
      .distinctUntilChanged();
  }

  isPanelValid(submissionId, panelId): Observable<boolean> {
    return this.store.select(submissionPanelFromIdSelector(submissionId, panelId))
      .map((panel: SubmissionPanelObject) => panel.isValid)
      .distinctUntilChanged();
  }

  isPanelLoaded(submissionId, panelId): Observable<boolean> {
    return this.store.select(submissionObjectFromIdSelector(submissionId))
      .map((submissionState: SubmissionObjectEntry) => {
        return !isUndefined(submissionState.panels[panelId])
      })
      .distinctUntilChanged();
  }

  loadDefaultPanels(submissionId, definitionId) {
    this.store.select(submissionDefinitionFromIdSelector(definitionId))
      .distinctUntilChanged()
      .filter((state) => !isUndefined(state.panels))
      .map((state) => {
        Object.keys(state.panels)
          .filter((panelId) => state.panels[panelId].mandatory)
          .map((panelId) => {
            this.loadPanel(submissionId, definitionId, panelId);
          })
      })
      .subscribe();
  }

  private loadPanel(submissionId: string, definitionId: string, panelId: string) {
    this.isPanelLoaded(submissionId, panelId)
      .subscribe((loaded) => {
        if (!loaded) {
          let panelObject: PanelObject = Object.create(null);
          this.getPanelDefinition(definitionId, panelId)
            .subscribe((panel: PanelObject) => {
              panelObject = panel;
            });
          const componentRef = this.panelFactory.get(submissionId, panelId, panelObject, this._viewContainerRef);
          const viewIndex = this._viewContainerRef.indexOf(componentRef.hostView);
          this.store.dispatch(new EnablePanelAction(submissionId, panelId, viewIndex));
        }
      })
  }

  addPanel(submissionId, definitionId, panelId) {
    this.loadPanel(submissionId, definitionId, panelId);
  }

  removePanel(submissionId, panelId) {
    let panelObject: SubmissionPanelObject = Object.create(null);
    this.getPanelState(submissionId, panelId)
      .subscribe((panel: SubmissionPanelObject) => {
        panelObject = panel;
      });
    this._viewContainerRef.remove(panelObject.panelViewIndex);
    this.store.dispatch(new DisablePanelAction(submissionId, panelId));
  }
}
