import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule, Action, StoreConfig } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { CoreModule } from '../core/core.module';
import { SharedModule } from '../shared/shared.module';
import { storeModuleConfig } from '../app.reducer';
import { OpenaireBrokerTopicComponent } from './broker/openiare-broker-topic.component';
/* import { DeduplicationComponent } from './deduplication.component';
import { DeduplicationStateService } from './deduplication-state.service';
import { DeduplicationSignaturesService } from './signatures/deduplication-signatures.service';
import { DeduplicationSetsService } from './sets/deduplication-sets.service';
import { DeduplicationState, deduplicationReducers } from './deduplication.reducer';
import { DeduplicationRestService } from '../core/deduplication/deduplication-rest.service';
import { DeduplicationSetRestService } from '../core/deduplication/deduplication-set-rest.service';
import { deduplicationEffects } from './deduplication.effects'; */

const MODULES = [
  CommonModule,
  SharedModule,
  CoreModule.forRoot(),
  // StoreModule.forFeature('openaire', openaireReducers, storeModuleConfig as StoreConfig<OpenaireState, Action>),
  // EffectsModule.forFeature(openaireEffects),
];

const COMPONENTS = [
  OpenaireBrokerTopicComponent
  // DeduplicationComponent,
  // DeduplicationSignaturesComponent,
];

const DIRECTIVES = [ ];

const ENTRY_COMPONENTS = [ ];

const PROVIDERS = [
  // DeduplicationStateService,
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
