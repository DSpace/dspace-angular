import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CollectionPageComponent as BaseComponent } from '../../../../app/collection-page/collection-page.component';
import { fadeIn, fadeInOut } from '../../../../app/shared/animations/fade';
import {
  ComcolPageContentComponent
} from '../../../../app/shared/comcol/comcol-page-content/comcol-page-content.component';
import { ErrorComponent } from '../../../../app/shared/error/error.component';
import { AsyncPipe, NgIf } from '@angular/common';
import { ThemedLoadingComponent } from '../../../../app/shared/loading/themed-loading.component';
import { TranslateModule } from '@ngx-translate/core';
import { ViewTrackerComponent } from '../../../../app/statistics/angulartics/dspace/view-tracker.component';
import { VarDirective } from '../../../../app/shared/utils/var.directive';
import {
  ComcolPageHeaderComponent
} from '../../../../app/shared/comcol/comcol-page-header/comcol-page-header.component';
import { ComcolPageLogoComponent } from '../../../../app/shared/comcol/comcol-page-logo/comcol-page-logo.component';
import {
  ThemedComcolPageHandleComponent
} from '../../../../app/shared/comcol/comcol-page-handle/themed-comcol-page-handle.component';
import { DsoEditMenuComponent } from '../../../../app/shared/dso-page/dso-edit-menu/dso-edit-menu.component';
import {
  ThemedComcolPageBrowseByComponent
} from '../../../../app/shared/comcol/comcol-page-browse-by/themed-comcol-page-browse-by.component';
import { ObjectCollectionComponent } from '../../../../app/shared/object-collection/object-collection.component';


@Component({
  selector: 'ds-collection-page',
  // templateUrl: './collection-page.component.html',
  templateUrl: '../../../../app/collection-page/collection-page.component.html',
  // styleUrls: ['./collection-page.component.scss']
  styleUrls: ['../../../../app/collection-page/collection-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    fadeIn,
    fadeInOut
  ],
  standalone: true,
  imports: [
    ComcolPageContentComponent,
    ErrorComponent,
    NgIf,
    ThemedLoadingComponent,
    TranslateModule,
    ViewTrackerComponent,
    VarDirective,
    AsyncPipe,
    ComcolPageHeaderComponent,
    ComcolPageLogoComponent,
    ThemedComcolPageHandleComponent,
    DsoEditMenuComponent,
    ThemedComcolPageBrowseByComponent,
    ObjectCollectionComponent
  ],
})
/**
 * This component represents a detail page for a single collection
 */
export class CollectionPageComponent extends BaseComponent {}
