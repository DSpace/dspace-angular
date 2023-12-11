import { Component } from '@angular/core';
import {
  BrowseByTitlePageComponent as BaseComponent
} from '../../../../../app/browse-by/browse-by-title-page/browse-by-title-page.component';
import { VarDirective } from '../../../../../app/shared/utils/var.directive';
import { AsyncPipe, NgIf } from '@angular/common';
import {
  ComcolPageHeaderComponent
} from '../../../../../app/shared/comcol/comcol-page-header/comcol-page-header.component';
import { ComcolPageLogoComponent } from '../../../../../app/shared/comcol/comcol-page-logo/comcol-page-logo.component';
import {
  ThemedComcolPageHandleComponent
} from '../../../../../app/shared/comcol/comcol-page-handle/themed-comcol-page-handle.component';
import {
  ComcolPageContentComponent
} from '../../../../../app/shared/comcol/comcol-page-content/comcol-page-content.component';
import { DsoEditMenuComponent } from '../../../../../app/shared/dso-page/dso-edit-menu/dso-edit-menu.component';
import {
  ThemedComcolPageBrowseByComponent
} from '../../../../../app/shared/comcol/comcol-page-browse-by/themed-comcol-page-browse-by.component';
import { BrowseByComponent } from '../../../../../app/shared/browse-by/browse-by.component';
import { TranslateModule } from '@ngx-translate/core';
import { ThemedLoadingComponent } from '../../../../../app/shared/loading/themed-loading.component';
import { ThemedBrowseByComponent } from 'src/app/shared/browse-by/themed-browse-by.component';

@Component({
  selector: 'ds-browse-by-title-page',
  // styleUrls: ['./browse-by-title-page.component.scss'],
  styleUrls: ['../../../../../app/browse-by/browse-by-metadata-page/browse-by-metadata-page.component.scss'],
  // templateUrl: './browse-by-title-page.component.html'
  templateUrl: '../../../../../app/browse-by/browse-by-metadata-page/browse-by-metadata-page.component.html',
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
    ThemedBrowseByComponent
  ],
})

/**
 * Component for determining what Browse-By component to use depending on the metadata (browse ID) provided
 */

export class BrowseByTitlePageComponent extends BaseComponent {
}
