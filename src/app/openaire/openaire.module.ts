import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Action, StoreConfig, StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { CoreModule } from '../core/core.module';
import { SharedModule } from '../shared/shared.module';
import { storeModuleConfig } from '../app.reducer';
import { openaireReducers, OpenaireState } from './openaire.reducer';
import { SuggestionTargetsStateService } from './reciter-suggestions/suggestion-targets/suggestion-targets.state.service';
import { SuggestionsService } from './reciter-suggestions/suggestions.service';
import { OpenaireSuggestionsDataService } from '../core/openaire/reciter-suggestions/openaire-suggestions-data.service';
import { SuggestionTargetsComponent } from './reciter-suggestions/suggestion-targets/suggestion-targets.component';
import { SuggestionListElementComponent } from './reciter-suggestions/suggestion-list-element/suggestion-list-element.component';
import { SuggestionEvidencesComponent } from './reciter-suggestions/suggestion-list-element/suggestion-evidences/suggestion-evidences.component';
import { SuggestionActionsComponent } from './reciter-suggestions/suggestion-actions/suggestion-actions.component';
import { SuggestionsPopupComponent } from './reciter-suggestions/suggestions-popup/suggestions-popup.component';
import { SuggestionsNotificationComponent } from './reciter-suggestions/suggestions-notification/suggestions-notification.component';
import { TranslateModule } from '@ngx-translate/core';
import { SearchModule } from '../shared/search/search.module';
import {openaireEffects} from './openaire.effects';

const MODULES = [
  CommonModule,
  SharedModule,
  CoreModule.forRoot(),
  StoreModule.forFeature('openaire', openaireReducers, storeModuleConfig as StoreConfig<OpenaireState, Action>),
  EffectsModule.forFeature(openaireEffects),
  TranslateModule
];

const COMPONENTS = [
  SuggestionTargetsComponent,
  SuggestionActionsComponent,
  SuggestionListElementComponent,
  SuggestionEvidencesComponent,
  SuggestionsPopupComponent,
  SuggestionsNotificationComponent
];

const DIRECTIVES = [ ];


const PROVIDERS = [
  SuggestionTargetsStateService,
  SuggestionsService,
  OpenaireSuggestionsDataService
];

@NgModule({
    imports: [
        ...MODULES,
        SearchModule
    ],
  declarations: [
    ...COMPONENTS,
    ...DIRECTIVES,
  ],
  providers: [
    ...PROVIDERS
  ],
  entryComponents: [
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
