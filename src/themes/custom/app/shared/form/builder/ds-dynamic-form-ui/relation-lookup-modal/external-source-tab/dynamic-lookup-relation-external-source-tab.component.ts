import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { SearchConfigurationService } from '../../../../../../../../../app/core/shared/search/search-configuration.service';
import { SEARCH_CONFIG_SERVICE } from '../../../../../../../../../app/my-dspace-page/my-dspace-configuration.service';
import {
  fadeIn,
  fadeInOut,
} from '../../../../../../../../../app/shared/animations/fade';
import { ErrorComponent } from '../../../../../../../../../app/shared/error/error.component';
import { DsDynamicLookupRelationExternalSourceTabComponent as BaseComponent } from '../../../../../../../../../app/shared/form/builder/ds-dynamic-form-ui/relation-lookup-modal/external-source-tab/dynamic-lookup-relation-external-source-tab.component';
import { ThemedLoadingComponent } from '../../../../../../../../../app/shared/loading/themed-loading.component';
import { ObjectCollectionComponent } from '../../../../../../../../../app/shared/object-collection/object-collection.component';
import { PageSizeSelectorComponent } from '../../../../../../../../../app/shared/page-size-selector/page-size-selector.component';
import { ThemedSearchFormComponent } from '../../../../../../../../../app/shared/search-form/themed-search-form.component';
import { VarDirective } from '../../../../../../../../../app/shared/utils/var.directive';

@Component({
  selector: 'ds-themed-dynamic-lookup-relation-external-source-tab',
  // styleUrls: ['./dynamic-lookup-relation-external-source-tab.component.scss'],
  styleUrls: ['../../../../../../../../../app/shared/form/builder/ds-dynamic-form-ui/relation-lookup-modal/external-source-tab/dynamic-lookup-relation-external-source-tab.component.scss'],
  // templateUrl: './dynamic-lookup-relation-external-source-tab.component.html',
  templateUrl: '../../../../../../../../../app/shared/form/builder/ds-dynamic-form-ui/relation-lookup-modal/external-source-tab/dynamic-lookup-relation-external-source-tab.component.html',
  providers: [
    {
      provide: SEARCH_CONFIG_SERVICE,
      useClass: SearchConfigurationService,
    },
  ],
  animations: [
    fadeIn,
    fadeInOut,
  ],
  standalone: true,
  imports: [
    AsyncPipe,
    ErrorComponent,
    ObjectCollectionComponent,
    PageSizeSelectorComponent,
    ThemedLoadingComponent,
    ThemedSearchFormComponent,
    TranslateModule,
    VarDirective,
  ],
})
export class DsDynamicLookupRelationExternalSourceTabComponent extends BaseComponent {
}
