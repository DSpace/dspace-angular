import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { MetadataRepresentationListComponent as BaseComponent } from '../../../../../../app/item-page/simple/metadata-representation-list/metadata-representation-list.component';
import { ThemedLoadingComponent } from '../../../../../../app/shared/loading/themed-loading.component';
import { MetadataFieldWrapperComponent } from '../../../../../../app/shared/metadata-field-wrapper/metadata-field-wrapper.component';
import { MetadataRepresentationLoaderComponent } from '../../../../../../app/shared/metadata-representation/metadata-representation-loader.component';
import { VarDirective } from '../../../../../../app/shared/utils/var.directive';

@Component({
  selector: 'ds-themed-metadata-representation-list',
  // templateUrl: './metadata-representation-list.component.html'
  templateUrl: '../../../../../../app/item-page/simple/metadata-representation-list/metadata-representation-list.component.html',
  standalone: true,
  imports: [
    AsyncPipe,
    MetadataFieldWrapperComponent,
    MetadataRepresentationLoaderComponent,
    ThemedLoadingComponent,
    TranslateModule,
    VarDirective,
  ],
})
export class MetadataRepresentationListComponent extends BaseComponent {
}
