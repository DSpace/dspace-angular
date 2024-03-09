import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  NgbDatepickerModule,
  NgbTimepickerModule,
} from '@ng-bootstrap/ng-bootstrap';
import { UiSwitchModule } from 'ngx-ui-switch';

import { SystemWideAlertDataService } from '../core/data/system-wide-alert-data.service';
import { SharedModule } from '../shared/shared.module';
import { SystemWideAlertBannerComponent } from './alert-banner/system-wide-alert-banner.component';
import { SystemWideAlertFormComponent } from './alert-form/system-wide-alert-form.component';
import { SystemWideAlertRoutingModule } from './system-wide-alert-routing.module';

@NgModule({
  imports: [
    FormsModule,
    SharedModule,
    UiSwitchModule,
    SystemWideAlertRoutingModule,
    NgbTimepickerModule,
    NgbDatepickerModule,
  ],
  exports: [
    SystemWideAlertBannerComponent,
  ],
  declarations: [
    SystemWideAlertBannerComponent,
    SystemWideAlertFormComponent,
  ],
  providers: [
    SystemWideAlertDataService,
  ],
})
export class SystemWideAlertModule {

}
