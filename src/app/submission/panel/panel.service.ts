import { Injectable, ViewContainerRef } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { createSelector, Store } from '@ngrx/store';

import { PanelFactoryComponent } from './panel.factory';
import { submissionSelector, SubmissionState } from '../submission.reducers';

import { isUndefined } from '../../shared/empty.util';
import { NewPanelDefinitionAction, NewDefinitionAction } from '../definitions/submission-definitions.actions';
import { PanelObject } from '../definitions/submission-definitions.reducer';
import { DisablePanelAction, EnablePanelAction } from '../objects/submission-objects.actions';
import { SubmissionPanelObject } from '../objects/submission-objects.reducer';
import {
  panelDefinitionFromIdSelector,
  submissionDefinitionFromIdSelector,
  submissionPanelFromIdSelector
} from '../selectors';

export const SUBMISSION_DEFINITIONS = [
  {
    name: 'traditional',
    panels: [
      {
        header: {en: 'First page'},
        mandatory: true,
        type: 'inputform',
        scope: null
      },
      {
        header: {en: 'Second page'},
        mandatory: true,
        type: 'inputform',
        scope: null
      },
      {
        header: {en: 'Files and access condition'},
        mandatory: true,
        type: 'uploadWithEmbargo',
        scope: null
      },
      {
        header: {en: 'Deposit license'},
        mandatory: true,
        type: 'license',
        scope: null
      },
      {
        header: {en: 'Creative Commons'},
        mandatory: false,
        type: 'cclicense',
        scope: null
      },
    ],
    isDefault: true
  },
  {
    name: 'custom',
    panels: [
      {
        header: {en: 'First page'},
        mandatory: true,
        type: 'inputform',
        scope: null
      },
      {
        header: {en: 'Files and access condition'},
        mandatory: true,
        type: 'uploadWithEmbargo',
        scope: null
      },
      {
        header: {en: 'Creative Commons'},
        mandatory: false,
        type: 'cclicense',
        scope: null
      },
    ],
    isDefault: false
  }
];

@Injectable()
export class PanelService {
  private _viewContainerRef: ViewContainerRef;

  constructor(private panelFactory: PanelFactoryComponent, private store: Store<SubmissionState>) {}

  initViewContainer(viewContainerRef: ViewContainerRef) {
    this._viewContainerRef = viewContainerRef;
  }

  private getDefinitionPanels(definitionId: string) {
    return this.store.select(submissionDefinitionFromIdSelector(definitionId))
      .map((state) => state.panels)
      .distinctUntilChanged();
  }

  retrievePanels() {
    SUBMISSION_DEFINITIONS
      .map((definition) => {
        this.store.dispatch(new NewDefinitionAction(definition.name, definition.isDefault));
        definition.panels.forEach((panelData, panelId) => {
          this.store.dispatch(new NewPanelDefinitionAction(definition.name, definition.name + '_' + panelId, panelData as PanelObject));
        });
      });
  }

  getAvailablePanelList(submissionId, definitionId): Observable<any> {
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
              && !isUndefined(submissionState[submissionId].panels) && !submissionState[submissionId].panels.hasOwnProperty(panelId)) {
              availablePanels.push({panelId: panelId, panelHeader: panelList[panelId].header});
            }
          });
        }
        return availablePanels;
      })
      .distinctUntilChanged();
  }

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

  loadDefaultPanels(submissionId, definitionId) {
    this.store.select(submissionDefinitionFromIdSelector(definitionId))
      .map((state) => {
        Object.keys(state.panels)
          .filter((panelId) => state.panels[panelId].mandatory)
          .map((panelId) => {
            this.loadPanel(submissionId, definitionId, panelId);
          })
      })
      .distinctUntilChanged()
      .subscribe();
  }

  private loadPanel(submissionId: string, definitionId: string, panelId: string) {
    let panelObject: PanelObject = Object.create(null);
    this.getPanelDefinition(definitionId, panelId)
      .subscribe((panel: PanelObject) => {
        panelObject = panel;
      });
    const componentRef = this.panelFactory.get(submissionId, panelId, panelObject, this._viewContainerRef);
    const viewIndex = this._viewContainerRef.indexOf(componentRef.hostView);
    this.store.dispatch(new EnablePanelAction(submissionId, panelId, viewIndex));
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
