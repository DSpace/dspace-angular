import {
  EnvironmentProviders,
  importProvidersFrom,
  makeEnvironmentProviders,
} from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import {
  Action,
  StoreConfig,
  StoreModule,
} from '@ngrx/store';

import { storeModuleConfig } from '../app.reducer';
import {
  suggestionNotificationsReducers,
  SuggestionNotificationsState,
} from './notifications.reducer';
import { notificationsEffects } from './notifications-effects';

export const provideSuggestionNotificationsState = (): EnvironmentProviders => {
  return makeEnvironmentProviders([
    importProvidersFrom(
      StoreModule.forFeature('suggestionNotifications', suggestionNotificationsReducers, storeModuleConfig as StoreConfig<SuggestionNotificationsState, Action>),
      EffectsModule.forFeature(notificationsEffects),
    ),
  ]);
};
