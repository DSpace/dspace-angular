import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { EditBitstreamPageComponent as BaseComponent } from '../../../../../app/bitstream-page/edit-bitstream-page/edit-bitstream-page.component';
import { ErrorComponent } from '../../../../../app/shared/error/error.component';
import { FormComponent } from '../../../../../app/shared/form/form.component';
import { ThemedLoadingComponent } from '../../../../../app/shared/loading/themed-loading.component';
import { FileSizePipe } from '../../../../../app/shared/utils/file-size-pipe';
import { VarDirective } from '../../../../../app/shared/utils/var.directive';
import { ThemedThumbnailComponent } from '../../../../../app/thumbnail/themed-thumbnail.component';

@Component({
  selector: 'ds-themed-edit-bitstream-page',
  // styleUrls: ['./edit-bitstream-page.component.scss'],
  styleUrls: ['../../../../../app/bitstream-page/edit-bitstream-page/edit-bitstream-page.component.scss'],
  // templateUrl: './edit-bitstream-page.component.html',
  templateUrl: '../../../../../app/bitstream-page/edit-bitstream-page/edit-bitstream-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    AsyncPipe,
    ErrorComponent,
    FileSizePipe,
    FormComponent,
    RouterLink,
    ThemedLoadingComponent,
    ThemedThumbnailComponent,
    TranslateModule,
    VarDirective,
  ],
})
export class EditBitstreamPageComponent extends BaseComponent {
}
