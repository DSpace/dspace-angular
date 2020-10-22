import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule, Action, StoreConfig } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { CoreModule } from '../core/core.module';
import { SharedModule } from '../shared/shared.module';
import { storeModuleConfig } from '../app.reducer';
import { SuggestionTargetComponent } from './suggestion-target/suggestion-target.component';
import { ReciterSuggestionStateService } from './recitersuggestions.state.service';
import { reciterSuggestionReducers, ReciterSuggestionStat } from './recitersuggestions.reducer';
import { reciterSuggestionsEffects } from './recitersuggestions.effects';
import { SuggestionTargetsService } from './suggestion-target/suggestion-target.service';
import { SuggestionTargetRestService } from '../core/reciter-suggestions/reciter-suggestions-rest.service';

const MODULES = [
  CommonModule,
  SharedModule,
  CoreModule.forRoot(),
  StoreModule.forFeature('reciter', reciterSuggestionReducers, storeModuleConfig as StoreConfig<ReciterSuggestionStat, Action>),
  EffectsModule.forFeature(reciterSuggestionsEffects),
];

const COMPONENTS = [
  SuggestionTargetComponent,
];

const DIRECTIVES = [ ];

const ENTRY_COMPONENTS = [ ];

const PROVIDERS = [
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
 * This module handles all components that are necessary for the Reciter Suggestion components
 */
export class ReciterSuggestionModule {
}
