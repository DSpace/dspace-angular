import { Component } from '@angular/core';

import { FullFileSectionComponent as BaseComponent } from '../../../../../../../app/item-page/full/field-components/file-section/full-file-section.component';
import { PaginationComponent } from '../../../../../../../app/shared/pagination/pagination.component';
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { VarDirective } from '../../../../../../../app/shared/utils/var.directive';
import { ThemedThumbnailComponent } from '../../../../../../../app/thumbnail/themed-thumbnail.component';
import {
  ThemedFileDownloadLinkComponent
} from '../../../../../../../app/shared/file-download-link/themed-file-download-link.component';
import { FileSizePipe } from '../../../../../../../app/shared/utils/file-size-pipe';
import {
  MetadataFieldWrapperComponent
} from '../../../../../../../app/shared/metadata-field-wrapper/metadata-field-wrapper.component';

@Component({
  selector: 'ds-item-page-full-file-section',
  // styleUrls: ['./full-file-section.component.scss'],
  styleUrls: ['../../../../../../../app/item-page/full/field-components/file-section/full-file-section.component.scss'],
  // templateUrl: './full-file-section.component.html',
  templateUrl: '../../../../../../../app/item-page/full/field-components/file-section/full-file-section.component.html',
  standalone: true,
  imports: [
    PaginationComponent,
    NgIf,
    TranslateModule,
    AsyncPipe,
    VarDirective,
    ThemedThumbnailComponent,
    NgForOf,
    ThemedFileDownloadLinkComponent,
    FileSizePipe,
    MetadataFieldWrapperComponent
  ],
})
export class FullFileSectionComponent extends BaseComponent {
}
