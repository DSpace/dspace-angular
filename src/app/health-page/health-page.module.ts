import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

import { SharedModule } from '../shared/shared.module';
import { HealthInfoComponent } from './health-info/health-info.component';
import { HealthInfoComponentComponent } from './health-info/health-info-component/health-info-component.component';
import { HealthPageComponent } from './health-page.component';
import { HealthPageRoutingModule } from './health-page.routing.module';
import { HealthComponentComponent } from './health-panel/health-component/health-component.component';
import { HealthPanelComponent } from './health-panel/health-panel.component';
import { HealthStatusComponent } from './health-panel/health-status/health-status.component';


@NgModule({
  imports: [
    CommonModule,
    HealthPageRoutingModule,
    NgbModule,
    SharedModule,
    TranslateModule,
  ],
  declarations: [
    HealthPageComponent,
    HealthPanelComponent,
    HealthStatusComponent,
    HealthComponentComponent,
    HealthInfoComponent,
    HealthInfoComponentComponent,
  ],
})
export class HealthPageModule {
}
