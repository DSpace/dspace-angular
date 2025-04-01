import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { FileUploadModule } from 'ng2-file-upload';

import { BtnDisabledDirective } from '../../../../../../app/shared/btn-disabled.directive';
import { UploaderComponent as BaseComponent } from '../../../../../../app/shared/upload/uploader/uploader.component';

@Component({
  selector: 'ds-themed-uploader',
  // templateUrl: 'uploader.component.html',
  templateUrl: '../../../../../../app/shared/upload/uploader/uploader.component.html',
  // styleUrls: ['./uploader.component.scss'],
  styleUrls: ['../../../../../../app/shared/upload/uploader/uploader.component.scss'],
  standalone: true,
  imports: [TranslateModule, FileUploadModule, CommonModule, BtnDisabledDirective],
})
export class UploaderComponent extends  BaseComponent {
}
