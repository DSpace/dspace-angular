import {
  AsyncPipe,
  CommonModule,
  NgForOf,
  NgIf,
} from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { ItemBitstreamsComponent as BaseComponent } from '../../../../../../app/item-page/edit-item-page/item-bitstreams/item-bitstreams.component';
import { ItemEditBitstreamBundleComponent } from '../../../../../../app/item-page/edit-item-page/item-bitstreams/item-edit-bitstream-bundle/item-edit-bitstream-bundle.component';
import { AlertComponent } from '../../../../../../app/shared/alert/alert.component';
import { BtnDisabledDirective } from '../../../../../../app/shared/btn-disabled.directive';
import { ThemedLoadingComponent } from '../../../../../../app/shared/loading/themed-loading.component';
import { VarDirective } from '../../../../../../app/shared/utils/var.directive';

@Component({
  selector: 'ds-themed-item-bitstreams',
  styleUrls: ['../../../../../../app/item-page/edit-item-page/item-bitstreams/item-bitstreams.component.scss'],
  templateUrl: '../../../../../../app/item-page/edit-item-page/item-bitstreams/item-bitstreams.component.html',
  imports: [
    CommonModule,
    AsyncPipe,
    TranslateModule,
    ItemEditBitstreamBundleComponent,
    RouterLink,
    NgIf,
    VarDirective,
    NgForOf,
    ThemedLoadingComponent,
    AlertComponent,
    BtnDisabledDirective,
  ],
  standalone: true,
})
export class ItemBitstreamsComponent extends BaseComponent {

}
