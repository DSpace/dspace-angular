import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { FileSectionComponent } from '../../../item-page/simple/field-components/file-section/file-section.component';
import { ThemedLoadingComponent } from '../../loading/themed-loading.component';
import { MetadataFieldWrapperComponent } from '../../metadata-field-wrapper/metadata-field-wrapper.component';
import { BitstreamAttachmentComponent } from '../bitstream-attachment.component';

/**
 * This component renders the attachment section of the item
 */
@Component({
  selector: 'ds-item-page-attachment-section',
  templateUrl: './attachment-section.component.html',
  imports: [
    AsyncPipe,
    BitstreamAttachmentComponent,
    MetadataFieldWrapperComponent,
    ThemedLoadingComponent,
    TranslateModule,
  ],
})
export class AttachmentSectionComponent extends FileSectionComponent {

}
