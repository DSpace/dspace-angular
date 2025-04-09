import {
  AsyncPipe,
  LowerCasePipe,
  NgSwitch,
} from '@angular/common';
import { Component } from '@angular/core';

import { BrowseMostElementsComponent as BaseComponent } from '../../../../app/shared/browse-most-elements/browse-most-elements.component';
import { ThemedDefaultBrowseElementsComponent } from '../../../../app/shared/browse-most-elements/default-browse-elements/themed-default-browse-elements.component';

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
    ThemedDefaultBrowseElementsComponent,
    AsyncPipe,
    LowerCasePipe,
    NgSwitch,
  ],
})
export class BrowseMostElementsComponent extends BaseComponent {
}
