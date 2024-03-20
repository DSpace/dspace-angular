import {
  AsyncPipe,
  NgIf,
} from '@angular/common';
import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { BrowseByTitleComponent as BaseComponent } from '../../../../../app/browse-by/browse-by-title/browse-by-title.component';
import { BrowseByComponent } from '../../../../../app/shared/browse-by/browse-by.component';
import { ThemedBrowseByComponent } from '../../../../../app/shared/browse-by/themed-browse-by.component';
import { ThemedComcolPageBrowseByComponent } from '../../../../../app/shared/comcol/comcol-page-browse-by/themed-comcol-page-browse-by.component';
import { ComcolPageContentComponent } from '../../../../../app/shared/comcol/comcol-page-content/comcol-page-content.component';
import { ThemedComcolPageHandleComponent } from '../../../../../app/shared/comcol/comcol-page-handle/themed-comcol-page-handle.component';
import { ComcolPageHeaderComponent } from '../../../../../app/shared/comcol/comcol-page-header/comcol-page-header.component';
import { ComcolPageLogoComponent } from '../../../../../app/shared/comcol/comcol-page-logo/comcol-page-logo.component';
import { DsoEditMenuComponent } from '../../../../../app/shared/dso-page/dso-edit-menu/dso-edit-menu.component';
import { ThemedLoadingComponent } from '../../../../../app/shared/loading/themed-loading.component';
import { VarDirective } from '../../../../../app/shared/utils/var.directive';

@Component({
  selector: 'ds-browse-by-title',
  // styleUrls: ['./browse-by-title.component.scss'],
  styleUrls: ['../../../../../app/browse-by/browse-by-metadata/browse-by-metadata.component.scss'],
  // templateUrl: './browse-by-title.component.html',
  templateUrl: '../../../../../app/browse-by/browse-by-metadata/browse-by-metadata.component.html',
  standalone: true,
  imports: [
    VarDirective,
    AsyncPipe,
    ComcolPageHeaderComponent,
    ComcolPageLogoComponent,
    NgIf,
    ThemedComcolPageHandleComponent,
    ComcolPageContentComponent,
    DsoEditMenuComponent,
    ThemedComcolPageBrowseByComponent,
    BrowseByComponent,
    TranslateModule,
    ThemedLoadingComponent,
    ThemedBrowseByComponent,
  ],
})
export class BrowseByTitleComponent extends BaseComponent {
}
