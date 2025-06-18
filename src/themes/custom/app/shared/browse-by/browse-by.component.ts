import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ErrorComponent } from 'src/app/shared/error/error.component';
import { ThemedLoadingComponent } from 'src/app/shared/loading/themed-loading.component';
import { ObjectCollectionComponent } from 'src/app/shared/object-collection/object-collection.component';
import { ThemedResultsBackButtonComponent } from 'src/app/shared/results-back-button/themed-results-back-button.component';
import { VarDirective } from 'src/app/shared/utils/var.directive';

import {
  fadeIn,
  fadeInOut,
} from '../../../../../app/shared/animations/fade';
import { BrowseByComponent as BaseComponent } from '../../../../../app/shared/browse-by/browse-by.component';
import { StartsWithLoaderComponent } from '../../../../../app/shared/starts-with/starts-with-loader.component';

@Component({
  selector: 'ds-themed-browse-by',
  // styleUrls: ['./browse-by.component.scss'],
  styleUrls: ['../../../../../app/shared/browse-by/browse-by.component.scss'],
  // templateUrl: './browse-by.component.html',
  templateUrl: '../../../../../app/shared/browse-by/browse-by.component.html',
  animations: [
    fadeIn,
    fadeInOut,
  ],
  standalone: true,
  imports: [
    AsyncPipe,
    ErrorComponent,
    ObjectCollectionComponent,
    StartsWithLoaderComponent,
    ThemedLoadingComponent,
    ThemedResultsBackButtonComponent,
    TranslateModule,
    VarDirective,
  ],
})
export class BrowseByComponent extends BaseComponent {
}
