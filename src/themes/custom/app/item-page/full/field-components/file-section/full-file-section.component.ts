import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { FullFileSectionComponent as BaseComponent } from '../../../../../../../app/item-page/full/field-components/file-section/full-file-section.component';
import { ThemedFileDownloadLinkComponent } from '../../../../../../../app/shared/file-download-link/themed-file-download-link.component';
import { MetadataFieldWrapperComponent } from '../../../../../../../app/shared/metadata-field-wrapper/metadata-field-wrapper.component';
import { PaginationComponent } from '../../../../../../../app/shared/pagination/pagination.component';
import { FileSizePipe } from '../../../../../../../app/shared/utils/file-size-pipe';
import { VarDirective } from '../../../../../../../app/shared/utils/var.directive';
import { ThemedThumbnailComponent } from '../../../../../../../app/thumbnail/themed-thumbnail.component';

@Component({
  selector: 'ds-themed-item-page-full-file-section',
  // styleUrls: ['./full-file-section.component.scss'],
  styleUrls: ['../../../../../../../app/item-page/full/field-components/file-section/full-file-section.component.scss'],
  // templateUrl: './full-file-section.component.html',
  templateUrl: '../../../../../../../app/item-page/full/field-components/file-section/full-file-section.component.html',
  standalone: true,
  imports: [
    AsyncPipe,
    FileSizePipe,
    MetadataFieldWrapperComponent,
    PaginationComponent,
    ThemedFileDownloadLinkComponent,
    ThemedThumbnailComponent,
    TranslateModule,
    VarDirective,
  ],
})
export class FullFileSectionComponent extends BaseComponent {
}
