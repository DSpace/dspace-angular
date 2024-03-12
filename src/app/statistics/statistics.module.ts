import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule, } from '@angular/core';
import { ViewTrackerComponent } from './angulartics/dspace/view-tracker.component';
import { StatisticsEndpoint } from './statistics-endpoint.model';

/**
 * Declaration needed to make sure all decorator functions are called in time
 */
export const models = [
  StatisticsEndpoint,
];

@NgModule({
    imports: [
        CommonModule,
        ViewTrackerComponent
    ],
    exports: [
        ViewTrackerComponent,
  ],
})
/**
 * This module handles the statistics
 */
export class StatisticsModule {
  static forRoot(): ModuleWithProviders<StatisticsModule> {
    return {
      ngModule: StatisticsModule,
    };
  }
}
