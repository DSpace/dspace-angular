import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Action, StoreConfig, StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { CoreModule } from '../core/core.module';
import { SharedModule } from '../shared/shared.module';
import { storeModuleConfig } from '../app.reducer';
import { NotificationsBrokerTopicsComponent } from './broker/topics/notifications-broker-topics.component';
import { NotificationsBrokerEventsComponent } from './broker/events/notifications-broker-events.component';
import { NotificationsStateService } from './notifications-state.service';
import { notificationsReducers, NotificationsState } from './notifications.reducer';
import { notificationsEffects } from './notifications.effects';
import { NotificationsBrokerTopicsService } from './broker/topics/notifications-broker-topics.service';
import { NotificationsBrokerTopicRestService } from '../core/notifications/broker/topics/notifications-broker-topic-rest.service';
import { NotificationsBrokerEventRestService } from '../core/notifications/broker/events/notifications-broker-event-rest.service';
import { ProjectEntryImportModalComponent } from './broker/project-entry-import-modal/project-entry-import-modal.component';
import { TranslateModule } from '@ngx-translate/core';
import { SearchModule } from '../shared/search/search.module';
import { NotificationsBrokerSourceComponent } from './broker/source/notifications-broker-source.component';
import { NotificationsBrokerSourceService } from './broker/source/notifications-broker-source.service';
import { NotificationsBrokerSourceRestService } from '../core/notifications/broker/source/notifications-broker-source-rest.service';

const MODULES = [
  CommonModule,
  SharedModule,
  CoreModule.forRoot(),
  StoreModule.forFeature('notifications', notificationsReducers, storeModuleConfig as StoreConfig<NotificationsState, Action>),
  EffectsModule.forFeature(notificationsEffects),
  TranslateModule
];

const COMPONENTS = [
  NotificationsBrokerTopicsComponent,
  NotificationsBrokerEventsComponent,
  NotificationsBrokerSourceComponent
];

const DIRECTIVES = [ ];

const ENTRY_COMPONENTS = [
  ProjectEntryImportModalComponent
];

const PROVIDERS = [
  NotificationsStateService,
  NotificationsBrokerTopicsService,
  NotificationsBrokerSourceService,
  NotificationsBrokerTopicRestService,
  NotificationsBrokerSourceRestService,
  NotificationsBrokerEventRestService
];

@NgModule({
    imports: [
        ...MODULES,
        SearchModule
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
