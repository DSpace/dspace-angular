import {
  EnvironmentProviders,
  importProvidersFrom,
  makeEnvironmentProviders,
} from '@angular/core';
import {
  submissionReducers,
  SubmissionState,
} from '@dspace/core';
import { EffectsModule } from '@ngrx/effects';
import {
  Action,
  StoreConfig,
  StoreModule,
} from '@ngrx/store';

import { storeModuleConfig } from '../app.reducer';
import { submissionEffects } from './submission.effects';

export const provideSubmissionState = (): EnvironmentProviders => {
  return makeEnvironmentProviders([
    importProvidersFrom(
      StoreModule.forFeature('submission', submissionReducers, storeModuleConfig as StoreConfig<SubmissionState, Action>),
      EffectsModule.forFeature(submissionEffects),
    ),
  ]);
};

