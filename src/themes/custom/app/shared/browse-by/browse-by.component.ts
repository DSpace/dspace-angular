import { Component } from '@angular/core';

import {
  fadeIn,
  fadeInOut,
} from '../../../../../app/shared/animations/fade';
import { BrowseByComponent as BaseComponent } from '../../../../../app/shared/browse-by/browse-by.component';
import { VarDirective } from 'src/app/shared/utils/var.directive';
import { AsyncPipe, NgClass, NgComponentOutlet, NgIf } from '@angular/common';
import {
  ThemedResultsBackButtonComponent
} from 'src/app/shared/results-back-button/themed-results-back-button.component';
import { ObjectCollectionComponent } from 'src/app/shared/object-collection/object-collection.component';
import { ThemedLoadingComponent } from 'src/app/shared/loading/themed-loading.component';
import { ErrorComponent } from 'src/app/shared/error/error.component';
import { TranslateModule } from '@ngx-translate/core';
import { StartsWithLoaderComponent } from '../../../../../app/shared/starts-with/starts-with-loader.component';

@Component({
  selector: 'ds-browse-by',
  // styleUrls: ['./browse-by.component.scss'],
  styleUrls: ['../../../../../app/shared/browse-by/browse-by.component.scss'],
  // templateUrl: './browse-by.component.html',
  templateUrl: '../../../../../app/shared/browse-by/browse-by.component.html',
  animations: [
    fadeIn,
    fadeInOut,
  ],
  standalone: true,
  imports: [VarDirective, NgClass, NgComponentOutlet, NgIf, ThemedResultsBackButtonComponent, ObjectCollectionComponent,
    ThemedLoadingComponent, ErrorComponent, AsyncPipe, TranslateModule, StartsWithLoaderComponent]
})
export class BrowseByComponent extends BaseComponent {
}
