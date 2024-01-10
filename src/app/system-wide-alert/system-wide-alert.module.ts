import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SystemWideAlertBannerComponent } from './alert-banner/system-wide-alert-banner.component';
import { SystemWideAlertFormComponent } from './alert-form/system-wide-alert-form.component';
import { SystemWideAlertDataService } from '../core/data/system-wide-alert-data.service';
import { UiSwitchModule } from 'ngx-ui-switch';
import { NgbDatepickerModule, NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
    imports: [
        FormsModule,
        UiSwitchModule,
        NgbTimepickerModule,
        NgbDatepickerModule,
        SystemWideAlertBannerComponent,
        SystemWideAlertFormComponent
    ],
    exports: [
        SystemWideAlertBannerComponent
    ],
    providers: [
        SystemWideAlertDataService
    ]
})
export class SystemWideAlertModule {

}
