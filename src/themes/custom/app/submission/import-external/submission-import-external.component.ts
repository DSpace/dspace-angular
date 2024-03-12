import { Component } from '@angular/core';

import { fadeIn } from '../../../../../app/shared/animations/fade';
import {
  SubmissionImportExternalComponent as BaseComponent
} from '../../../../../app/submission/import-external/submission-import-external.component';
import { ObjectCollectionComponent } from '../../../../../app/shared/object-collection/object-collection.component';
import { ThemedLoadingComponent } from '../../../../../app/shared/loading/themed-loading.component';
import { AlertComponent } from '../../../../../app/shared/alert/alert.component';
import { AsyncPipe, NgIf } from '@angular/common';
import {
  SubmissionImportExternalSearchbarComponent
} from '../../../../../app/submission/import-external/import-external-searchbar/submission-import-external-searchbar.component';
import { TranslateModule } from '@ngx-translate/core';
import { VarDirective } from '../../../../../app/shared/utils/var.directive';
import { RouterLink } from '@angular/router';

/**
 * This component allows to submit a new workspaceitem importing the data from an external source.
 */
@Component({
  selector: 'ds-submission-import-external',
  // styleUrls: ['./submission-import-external.component.scss'],
  styleUrls: ['../../../../../app/submission/import-external/submission-import-external.component.scss'],
  // templateUrl: './submission-import-external.component.html',
  templateUrl: '../../../../../app/submission/import-external/submission-import-external.component.html',
  animations: [fadeIn],
  standalone: true,
  imports: [
    ObjectCollectionComponent,
    ThemedLoadingComponent,
    AlertComponent,
    NgIf,
    AsyncPipe,
    SubmissionImportExternalSearchbarComponent,
    TranslateModule,
    VarDirective,
    RouterLink
  ],
})
export class SubmissionImportExternalComponent extends BaseComponent {

}
