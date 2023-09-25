import { Component } from '@angular/core';
import { slideSidebarPadding } from '../../../../../../../app/shared/animations/slide';
import {
  FileSectionComponent as BaseComponent
} from '../../../../../../../app/item-page/simple/field-components/file-section/file-section.component';
import { CommonModule } from '@angular/common';
import {
  ThemedFileDownloadLinkComponent
} from '../../../../../../../app/shared/file-download-link/themed-file-download-link.component';
import {
  MetadataFieldWrapperComponent
} from '../../../../../../../app/shared/metadata-field-wrapper/metadata-field-wrapper.component';
import { ThemedLoadingComponent } from '../../../../../../../app/shared/loading/themed-loading.component';
import { TranslateModule } from '@ngx-translate/core';
import { FileSizePipe } from '../../../../../../../app/shared/utils/file-size-pipe';
import { VarDirective } from '../../../../../../../app/shared/utils/var.directive';

@Component({
  selector: 'ds-item-page-file-section',
  // templateUrl: './file-section.component.html',
  templateUrl: '../../../../../../../app/item-page/simple/field-components/file-section/file-section.component.html',
  animations: [slideSidebarPadding],
  standalone: true,
  imports: [
    CommonModule,
    ThemedFileDownloadLinkComponent,
    MetadataFieldWrapperComponent,
    ThemedLoadingComponent,
    TranslateModule,
    FileSizePipe,
    VarDirective,
  ],
})
export class FileSectionComponent extends BaseComponent {

}
