import { Component } from '@angular/core';
import { BrowseByTaxonomyComponent as BaseComponent } from '../../../../../app/browse-by/browse-by-taxonomy/browse-by-taxonomy.component';
import { BrowseByDataType } from '../../../../../app/browse-by/browse-by-switcher/browse-by-data-type';
import { rendersBrowseBy } from '../../../../../app/browse-by/browse-by-switcher/browse-by-decorator';
import { Context } from '../../../../../app/core/shared/context.model';
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
import { ThemedBrowseByComponent } from '../../../../../app/shared/browse-by/themed-browse-by.component';
import { RouterModule } from '@angular/router';
import {
  VocabularyTreeviewComponent
} from '../../../../../app/shared/form/vocabulary-treeview/vocabulary-treeview.component';

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
    ThemedBrowseByComponent
  ]
})
@rendersBrowseBy(BrowseByDataType.Hierarchy, Context.Any, 'custom')
export class BrowseByTaxonomyComponent extends BaseComponent {
}
