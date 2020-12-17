import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from '../core/core.module';
import { SharedModule } from '../shared/shared.module';
import { ViewTrackerComponent } from './angulartics/dspace/view-tracker.component';
import { StatisticsService } from './statistics.service';
import { StatisticsEndpoint } from './statistics-endpoint.model';

/**
 * Declaration needed to make sure all decorator functions are called in time
 */
export const models = [
  StatisticsEndpoint
];

@NgModule({
  imports: [
    CommonModule,
    CoreModule.forRoot(),
    SharedModule,
  ],
  declarations: [
    ViewTrackerComponent,
  ],
  exports: [
    ViewTrackerComponent,
  ],
  providers: [
    StatisticsService
  ]
})
/**
 * This module handles the statistics
 */
export class StatisticsModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: StatisticsModule,
      providers: [
        StatisticsService
      ]
    };
  }
}
