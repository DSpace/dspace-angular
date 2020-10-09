import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule, Action, StoreConfig } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { CoreModule } from '../core/core.module';
import { SharedModule } from '../shared/shared.module';
import { storeModuleConfig } from '../app.reducer';
import { OpenaireBrokerTopicComponent } from './broker/openiare-broker-topic.component';
import { OpenaireStateService } from './openaire-state.service';
import { openaireReducers, OpenaireState } from './openaire.reducer';
import { openaireEffects } from './openaire.effects';
import { OpenaireBrokerTopicsService } from './broker/openaire-broker-topic.service';
import { OpenaireBrokerTopicRestService } from '../core/openaire/openaire-broker-topic-rest.service';

const MODULES = [
  CommonModule,
  SharedModule,
  CoreModule.forRoot(),
  StoreModule.forFeature('openaire', openaireReducers, storeModuleConfig as StoreConfig<OpenaireState, Action>),
  EffectsModule.forFeature(openaireEffects),
];

const COMPONENTS = [
  OpenaireBrokerTopicComponent,
];

const DIRECTIVES = [ ];

const ENTRY_COMPONENTS = [ ];

const PROVIDERS = [
  OpenaireStateService,
  OpenaireBrokerTopicsService,
  OpenaireBrokerTopicRestService
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
