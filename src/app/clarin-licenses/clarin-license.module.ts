import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule} from '../shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ClarinLicensePageComponent } from './clarin-license-page/clarin-license-page.component';
import { ClarinLicenseRoutingModule } from './clarin-license-routing.module';
import { ClarinLicenseTableComponent } from './clarin-license-table/clarin-license-table.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DefineLicenseFormComponent } from './clarin-license-table/modal/define-license-form/define-license-form.component';
import { DefineLicenseLabelFormComponent } from './clarin-license-table/modal/define-license-label-form/define-license-label-form.component';
import { ClarinAllLicensesPageComponent } from './clarin-all-licenses-page/clarin-all-licenses-page.component';

@NgModule({
  declarations: [
    ClarinLicensePageComponent,
    ClarinLicenseTableComponent,
    DefineLicenseFormComponent,
    DefineLicenseLabelFormComponent,
    ClarinAllLicensesPageComponent,
  ],
    imports: [
        CommonModule,
        ClarinLicenseRoutingModule,
        TranslateModule,
        SharedModule,
        ReactiveFormsModule
    ],
  providers: [
    NgbActiveModal
  ],
})
export class ClarinLicenseModule { }
