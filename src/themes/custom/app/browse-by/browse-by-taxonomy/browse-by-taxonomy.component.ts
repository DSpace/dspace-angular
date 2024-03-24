import {
  AsyncPipe,
  NgIf,
} from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { BrowseByTaxonomyComponent as BaseComponent } from '../../../../../app/browse-by/browse-by-taxonomy/browse-by-taxonomy.component';
import { BrowseByComponent } from '../../../../../app/shared/browse-by/browse-by.component';
import { ThemedBrowseByComponent } from '../../../../../app/shared/browse-by/themed-browse-by.component';
import { ThemedComcolPageBrowseByComponent } from '../../../../../app/shared/comcol/comcol-page-browse-by/themed-comcol-page-browse-by.component';
import { ComcolPageContentComponent } from '../../../../../app/shared/comcol/comcol-page-content/comcol-page-content.component';
import { ThemedComcolPageHandleComponent } from '../../../../../app/shared/comcol/comcol-page-handle/themed-comcol-page-handle.component';
import { ComcolPageHeaderComponent } from '../../../../../app/shared/comcol/comcol-page-header/comcol-page-header.component';
import { ComcolPageLogoComponent } from '../../../../../app/shared/comcol/comcol-page-logo/comcol-page-logo.component';
import { DsoEditMenuComponent } from '../../../../../app/shared/dso-page/dso-edit-menu/dso-edit-menu.component';
import { VocabularyTreeviewComponent } from '../../../../../app/shared/form/vocabulary-treeview/vocabulary-treeview.component';
import { ThemedLoadingComponent } from '../../../../../app/shared/loading/themed-loading.component';
import { VarDirective } from '../../../../../app/shared/utils/var.directive';

@Component({
  selector: 'ds-browse-by-taxonomy',
  // templateUrl: './browse-by-taxonomy.component.html',
  templateUrl: '../../../../../app/browse-by/browse-by-taxonomy/browse-by-taxonomy.component.html',
  // styleUrls: ['./browse-by-taxonomy.component.scss'],
  styleUrls: ['../../../../../app/browse-by/browse-by-taxonomy/browse-by-taxonomy.component.scss'],
  standalone: true,
  imports: [
    VarDirective,
    AsyncPipe,
    ComcolPageHeaderComponent,
    ComcolPageLogoComponent,
    NgIf,
    RouterModule,
    ThemedComcolPageHandleComponent,
    ComcolPageContentComponent,
    DsoEditMenuComponent,
    ThemedComcolPageBrowseByComponent,
    VocabularyTreeviewComponent,
    BrowseByComponent,
    TranslateModule,
    ThemedLoadingComponent,
    ThemedBrowseByComponent,
  ],
})
export class BrowseByTaxonomyComponent extends BaseComponent {
}
