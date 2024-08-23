import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { CrisLayoutModule } from '../cris-layout/cris-layout.module';
import { CrisItemPageComponent } from './cris-item-page.component';
import { ThemedLoadingComponent } from '../shared/loading/themed-loading.component';
import { ThemedItemAlertsComponent } from '../item-page/alerts/themed-item-alerts.component';
import { ViewTrackerComponent } from '../statistics/angulartics/dspace/view-tracker.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
    imports: [
        CommonModule,
        CrisLayoutModule,
        ThemedLoadingComponent,
        ThemedItemAlertsComponent,
        ViewTrackerComponent,
        TranslateModule,
        CrisItemPageComponent,
    ],
    exports: [
        CrisItemPageComponent,
    ],
})
export class CrisItemPageModule { }
