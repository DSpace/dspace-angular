import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { UiSwitchModule } from 'ngx-ui-switch';

import { SharedModule } from '../shared.module';
import { AccessControlArrayFormComponent } from './access-control-array-form/access-control-array-form.component';
import { ToDatePipe } from './access-control-array-form/to-date.pipe';
import { AccessControlFormContainerComponent } from './access-control-form-container.component';
import { ItemAccessControlSelectBitstreamsModalComponent } from './item-access-control-select-bitstreams-modal/item-access-control-select-bitstreams-modal.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    TranslateModule,
    UiSwitchModule,
    NgbDatepickerModule,
  ],
  declarations: [
    AccessControlFormContainerComponent,
    AccessControlArrayFormComponent,
    ItemAccessControlSelectBitstreamsModalComponent,
    ToDatePipe,
  ],
  exports: [ AccessControlFormContainerComponent, AccessControlArrayFormComponent ],
})
export class AccessControlFormModule {}
