import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {TranslateModule} from '@ngx-translate/core';
import {UiSwitchModule} from 'ngx-ui-switch';

import {AccessControlArrayFormComponent} from './access-control-array-form/access-control-array-form.component';
import {SharedModule} from '../shared.module';
import {
  ItemAccessControlSelectBitstreamsModalComponent
} from './item-access-control-select-bitstreams-modal/item-access-control-select-bitstreams-modal.component';
import {AccessControlFormContainerComponent} from './access-control-form-container.component';
import {NgbDatepickerModule} from '@ng-bootstrap/ng-bootstrap';
import {ToDatePipe} from './access-control-array-form/to-date.pipe';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    TranslateModule,
    UiSwitchModule,
    NgbDatepickerModule
  ],
  declarations: [
    AccessControlFormContainerComponent,
    AccessControlArrayFormComponent,
    ItemAccessControlSelectBitstreamsModalComponent,
    ToDatePipe
  ],
  exports: [ AccessControlFormContainerComponent, AccessControlArrayFormComponent ],
})
export class AccessControlFormModule {}
