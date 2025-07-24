import {
  AsyncPipe,
  NgClass,
} from '@angular/common';
import { Component } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

import { AuthorizedCollectionSelectorComponent as BaseComponent } from '../../../../../../../app/shared/dso-selector/dso-selector/authorized-collection-selector/authorized-collection-selector.component';
import { HoverClassDirective } from '../../../../../../../app/shared/hover-class.directive';
import { ThemedLoadingComponent } from '../../../../../../../app/shared/loading/themed-loading.component';
import { ListableObjectComponentLoaderComponent } from '../../../../../../../app/shared/object-collection/shared/listable-object/listable-object-component-loader.component';

@Component({
  selector: 'ds-themed-authorized-collection-selector',
  // styleUrls: ['./authorized-collection-selector.component.scss'],
  styleUrls: ['../../../../../../../app/shared/dso-selector/dso-selector/dso-selector.component.scss'],
  // templateUrl: './authorized-collection-selector.component.html',
  templateUrl: '../../../../../../../app/shared/dso-selector/dso-selector/dso-selector.component.html',
  standalone: true,
  imports: [
    AsyncPipe,
    FormsModule,
    HoverClassDirective,
    InfiniteScrollModule,
    ListableObjectComponentLoaderComponent,
    NgClass,
    ReactiveFormsModule,
    ThemedLoadingComponent,
    TranslateModule,
  ],
})
export class AuthorizedCollectionSelectorComponent extends BaseComponent {
}
