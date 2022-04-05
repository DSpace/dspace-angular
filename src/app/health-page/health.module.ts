import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HealthPageRoutingModule } from './health.routing.module';
import { HealthComponent } from './health/health.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
    imports: [
        CommonModule,
        HealthPageRoutingModule,
        MatExpansionModule,
        NgbModule,
        TranslateModule
    ],
    declarations: [
        HealthComponent
    ]
  })
  export class HealthModule {
  }
