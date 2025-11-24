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

import { DSOSelectorComponent as BaseComponent } from '../../../../../../app/shared/dso-selector/dso-selector/dso-selector.component';
import { HoverClassDirective } from '../../../../../../app/shared/hover-class.directive';
import { ThemedLoadingComponent } from '../../../../../../app/shared/loading/themed-loading.component';
import { ListableObjectComponentLoaderComponent } from '../../../../../../app/shared/object-collection/shared/listable-object/listable-object-component-loader.component';

@Component({
  selector: 'ds-themed-dso-selector',
  // styleUrls: ['./dso-selector.component.scss'],
  styleUrls: ['../../../../../../app/shared/dso-selector/dso-selector/dso-selector.component.scss'],
  // templateUrl: './dso-selector.component.html',
  templateUrl: '../../../../../../app/shared/dso-selector/dso-selector/dso-selector.component.html',
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
  standalone: true,
})
export class DSOSelectorComponent extends BaseComponent {
}
