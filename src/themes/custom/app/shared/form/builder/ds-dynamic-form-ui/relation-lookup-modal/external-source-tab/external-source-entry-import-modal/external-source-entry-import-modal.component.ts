import {
  AsyncPipe,
  NgIf,
} from '@angular/common';
import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { ExternalSourceEntryImportModalComponent as BaseComponent } from '../../../../../../../../../../app/shared/form/builder/ds-dynamic-form-ui/relation-lookup-modal/external-source-tab/external-source-entry-import-modal/external-source-entry-import-modal.component';
import { ThemedSearchResultsComponent } from '../../../../../../../../../../app/shared/search/search-results/themed-search-results.component';

@Component({
  selector: 'ds-themed-external-source-entry-import-modal',
  styleUrls: ['../../../../../../../../../../app/shared/form/builder/ds-dynamic-form-ui/relation-lookup-modal/external-source-tab/external-source-entry-import-modal/external-source-entry-import-modal.component.scss'],
  // styleUrls: ['./external-source-entry-import-modal.component.scss'],
  templateUrl: '../../../../../../../../../../app/shared/form/builder/ds-dynamic-form-ui/relation-lookup-modal/external-source-tab/external-source-entry-import-modal/external-source-entry-import-modal.component.html',
  standalone: true,
  imports: [
    TranslateModule,
    ThemedSearchResultsComponent,
    NgIf,
    AsyncPipe,
  ],
})
export class ExternalSourceEntryImportModalComponent extends BaseComponent {

}
