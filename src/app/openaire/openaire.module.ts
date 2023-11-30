import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Action, StoreConfig, StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { CoreModule } from '../core/core.module';
import { SharedModule } from '../shared/shared.module';
import { storeModuleConfig } from '../app.reducer';
import { OpenaireBrokerTopicsComponent } from './broker/topics/openaire-broker-topics.component';
import { OpenaireBrokerEventsComponent } from './broker/events/openaire-broker-events.component';
import { OpenaireStateService } from './openaire-state.service';
import { openaireReducers, OpenaireState } from './openaire.reducer';
import { openaireEffects } from './openaire.effects';
import { OpenaireBrokerTopicsService } from './broker/topics/openaire-broker-topics.service';
import { OpenaireBrokerTopicRestService } from '../core/openaire/broker/topics/openaire-broker-topic-rest.service';
import { OpenaireBrokerEventRestService } from '../core/openaire/broker/events/openaire-broker-event-rest.service';
import {
  ProjectEntryImportModalComponent
} from './broker/project-entry-import-modal/project-entry-import-modal.component';
import {
  SuggestionTargetsStateService
} from './reciter-suggestions/suggestion-targets/suggestion-targets.state.service';
import { SuggestionsService } from './reciter-suggestions/suggestions.service';
import { SuggestionTargetsComponent } from './reciter-suggestions/suggestion-targets/suggestion-targets.component';
import {
  SuggestionListElementComponent
} from './reciter-suggestions/suggestion-list-element/suggestion-list-element.component';
import {
  SuggestionEvidencesComponent
} from './reciter-suggestions/suggestion-list-element/suggestion-evidences/suggestion-evidences.component';
import { SuggestionActionsComponent } from './reciter-suggestions/suggestion-actions/suggestion-actions.component';
import { SuggestionsPopupComponent } from './reciter-suggestions/suggestions-popup/suggestions-popup.component';
import {
  SuggestionsNotificationComponent
} from './reciter-suggestions/suggestions-notification/suggestions-notification.component';
import { TranslateModule } from '@ngx-translate/core';
import { SearchModule } from '../shared/search/search.module';
import {
  QualityAssuranceSuggestionTargetDataService
} from '../core/openaire/reciter-suggestions/targets/quality-assurance-suggestion-target-data.service';
import {
  QualityAssuranceSuggestionDataService
} from '../core/openaire/reciter-suggestions/suggestions/quality-assurance-suggestion-data.service';
import {
  QualityAssuranceSourceDataService
} from '../core/openaire/broker/source/quality-assurance-source-data.service';

const MODULES = [
  CommonModule,
  SharedModule,
  CoreModule.forRoot(),
  StoreModule.forFeature('openaire', openaireReducers, storeModuleConfig as StoreConfig<OpenaireState, Action>),
  EffectsModule.forFeature(openaireEffects),
  TranslateModule,
  SearchModule
];

const COMPONENTS = [
  OpenaireBrokerTopicsComponent,
  OpenaireBrokerEventsComponent,
  SuggestionTargetsComponent,
  SuggestionActionsComponent,
  SuggestionListElementComponent,
  SuggestionEvidencesComponent,
  SuggestionsPopupComponent,
  SuggestionsNotificationComponent
];

const DIRECTIVES = [ ];

const ENTRY_COMPONENTS = [
  ProjectEntryImportModalComponent
];

const PROVIDERS = [
  OpenaireStateService,
  OpenaireBrokerTopicsService,
  OpenaireBrokerTopicRestService,
  OpenaireBrokerEventRestService,
  SuggestionTargetsStateService,
  SuggestionsService,
  QualityAssuranceSourceDataService,
  QualityAssuranceSuggestionTargetDataService,
  QualityAssuranceSuggestionDataService,
];

@NgModule({
    imports: [
        ...MODULES,
    ],
  declarations: [
    ...COMPONENTS,
    ...DIRECTIVES,
    ...ENTRY_COMPONENTS
  ],
  providers: [
    ...PROVIDERS
  ],
  exports: [
    ...COMPONENTS,
    ...DIRECTIVES
  ]
})

/**
 * This module handles all components that are necessary for the OpenAIRE components
 */
export class OpenaireModule {
}
