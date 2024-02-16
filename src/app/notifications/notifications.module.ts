import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Action, StoreConfig, StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { CoreModule } from '../core/core.module';
import { SharedModule } from '../shared/shared.module';
import { storeModuleConfig } from '../app.reducer';
import { QualityAssuranceTopicsComponent } from './qa/topics/quality-assurance-topics.component';
import { QualityAssuranceEventsComponent } from './qa/events/quality-assurance-events.component';
import { NotificationsStateService } from './notifications-state.service';
import { suggestionNotificationsReducers, SuggestionNotificationsState } from './notifications.reducer';
import { notificationsEffects } from './notifications-effects';
import { QualityAssuranceTopicsService } from './qa/topics/quality-assurance-topics.service';
import {
  QualityAssuranceTopicDataService
} from '../core/notifications/qa/topics/quality-assurance-topic-data.service';
import {
  QualityAssuranceEventDataService
} from '../core/notifications/qa/events/quality-assurance-event-data.service';
import { ProjectEntryImportModalComponent } from './qa/project-entry-import-modal/project-entry-import-modal.component';
import { TranslateModule } from '@ngx-translate/core';
import { SearchModule } from '../shared/search/search.module';
import { QualityAssuranceSourceComponent } from './qa/source/quality-assurance-source.component';
import { QualityAssuranceSourceService } from './qa/source/quality-assurance-source.service';
import {
  QualityAssuranceSourceDataService
} from '../core/notifications/qa/source/quality-assurance-source-data.service';
import { PublicationClaimComponent } from '../suggestion-notifications/suggestion-targets/publication-claim/publication-claim.component';
import { SuggestionActionsComponent } from '../suggestion-notifications/suggestion-actions/suggestion-actions.component';
import {
  SuggestionListElementComponent
} from '../suggestion-notifications/suggestion-list-element/suggestion-list-element.component';
import {
  SuggestionEvidencesComponent
} from '../suggestion-notifications/suggestion-list-element/suggestion-evidences/suggestion-evidences.component';
import { SuggestionsPopupComponent } from '../suggestion-notifications/suggestions-popup/suggestions-popup.component';
import {
  SuggestionsNotificationComponent
} from '../suggestion-notifications/suggestions-notification/suggestions-notification.component';
import { SuggestionsService } from '../suggestion-notifications/suggestions.service';
import { SuggestionsDataService } from '../core/suggestion-notifications/suggestions-data.service';
import {
  SuggestionSourceDataService
} from '../core/suggestion-notifications/source/suggestion-source-data.service';
import {
  SuggestionTargetDataService
} from '../core/suggestion-notifications/target/suggestion-target-data.service';
import {
  SuggestionTargetsStateService
} from '../suggestion-notifications/suggestion-targets/suggestion-targets.state.service';


const MODULES = [
  CommonModule,
  SharedModule,
  SearchModule,
  CoreModule.forRoot(),
  StoreModule.forFeature('suggestionNotifications', suggestionNotificationsReducers, storeModuleConfig as StoreConfig<SuggestionNotificationsState, Action>),
  EffectsModule.forFeature(notificationsEffects),
  TranslateModule
];

const COMPONENTS = [
  QualityAssuranceTopicsComponent,
  QualityAssuranceEventsComponent,
  QualityAssuranceSourceComponent,
  PublicationClaimComponent,
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
  NotificationsStateService,
  QualityAssuranceTopicsService,
  QualityAssuranceSourceService,
  QualityAssuranceTopicDataService,
  QualityAssuranceSourceDataService,
  QualityAssuranceEventDataService,
  SuggestionsService,
  SuggestionSourceDataService,
  SuggestionTargetDataService,
  SuggestionTargetsStateService,
  SuggestionsDataService
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
export class NotificationsModule {
}
