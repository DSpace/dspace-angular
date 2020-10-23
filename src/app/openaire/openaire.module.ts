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
import { ProjectEntryImportModalComponent } from './broker/project-entry-import-modal/project-entry-import-modal.component';
import { ReciterSuggestionStateService } from './reciter/recitersuggestions.state.service';
import { SuggestionTargetsService } from './reciter/suggestion-target/suggestion-target.service';
import { SuggestionTargetRestService } from '../core/openaire/reciter-suggestions/reciter-suggestions-rest.service';
import { SuggestionTargetComponent } from './reciter/suggestion-target/suggestion-target.component';
import { SuggestionListItemComponent } from './reciter/suggestion-list-item/suggestion-list-item.component';
import { SuggestionEvidenceListItemComponent } from './reciter/suggestion-evidence-list/suggestion-evidence-list.component';

const MODULES = [
  CommonModule,
  SharedModule,
  CoreModule.forRoot(),
  StoreModule.forFeature('openaire', openaireReducers, storeModuleConfig as StoreConfig<OpenaireState, Action>),
  EffectsModule.forFeature(openaireEffects)
];

const COMPONENTS = [
  OpenaireBrokerTopicsComponent,
  OpenaireBrokerEventsComponent,
  SuggestionTargetComponent,
  SuggestionListItemComponent,
  SuggestionEvidenceListItemComponent
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
  ReciterSuggestionStateService,
  SuggestionTargetsService,
  SuggestionTargetRestService
];

@NgModule({
  imports: [
    ...MODULES
  ],
  declarations: [
    ...COMPONENTS,
    ...DIRECTIVES,
    ...ENTRY_COMPONENTS
  ],
  providers: [
    ...PROVIDERS
  ],
  entryComponents: [
    ...ENTRY_COMPONENTS
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
