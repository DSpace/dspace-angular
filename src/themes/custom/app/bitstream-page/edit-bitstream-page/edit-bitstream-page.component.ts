import { EditBitstreamPageComponent as BaseComponent } from '../../../../../app/bitstream-page/edit-bitstream-page/edit-bitstream-page.component';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ds-edit-bitstream-page',
  // styleUrls: ['./edit-bitstream-page.component.scss'],
  styleUrls: ['../../../../../app/bitstream-page/edit-bitstream-page/edit-bitstream-page.component.scss'],
  // templateUrl: './edit-bitstream-page.component.html',
  templateUrl: '../../../../../app/bitstream-page/edit-bitstream-page/edit-bitstream-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditBitstreamPageComponent extends BaseComponent {
}
