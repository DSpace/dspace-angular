import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { MetadataImportPageComponent as BaseComponent } from '../../../../../app/admin/admin-import-metadata-page/metadata-import-page.component';
import { FileDropzoneNoUploaderComponent } from '../../../../../app/shared/upload/file-dropzone-no-uploader/file-dropzone-no-uploader.component';

@Component({
  selector: 'ds-themed-metadata-import-page',
  // templateUrl: './metadata-import-page.component.html',
  templateUrl: '../../../../../app/admin/admin-import-metadata-page/metadata-import-page.component.html',
  standalone: true,
  imports: [
    FileDropzoneNoUploaderComponent,
    FormsModule,
    TranslateModule,
  ],
})
export class MetadataImportPageComponent extends BaseComponent {
}
