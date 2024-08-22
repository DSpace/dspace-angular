import { Component } from '@angular/core';

import { BrowseMostElementsComponent as BaseComponent } from '../../../../app/shared/browse-most-elements/browse-most-elements.component';
import {
  ListableObjectComponentLoaderComponent
} from '../../../../app/shared/object-collection/shared/listable-object/listable-object-component-loader.component';
import { ThemedLoadingComponent } from '../../../../app/shared/loading/themed-loading.component';
import { TranslateModule } from '@ngx-translate/core';
import { NgForOf, NgIf } from '@angular/common';

/**
 * Component representing the breadcrumbs of a page
 */
@Component({
  selector: 'ds-base-browse-most-elements',
  // templateUrl: './breadcrumbs.component.html',
  templateUrl: '../../../../app/shared/browse-most-elements/browse-most-elements.component.html',
  // styleUrls: ['./breadcrumbs.component.scss']
  styleUrls: ['../../../../app/shared/browse-most-elements/browse-most-elements.component.scss'],
  standalone: true,
  imports: [
    ListableObjectComponentLoaderComponent,
    ThemedLoadingComponent,
    TranslateModule,
    NgForOf,
    NgIf,
  ],
})
export class BrowseMostElementsComponent extends BaseComponent {
}
