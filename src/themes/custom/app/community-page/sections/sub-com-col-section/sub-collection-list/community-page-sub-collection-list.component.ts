import {
  AsyncPipe,
  NgIf,
} from '@angular/common';
import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { CommunityPageSubCollectionListComponent as BaseComponent } from '../../../../../../../app/community-page/sections/sub-com-col-section/sub-collection-list/community-page-sub-collection-list.component';
import { ErrorComponent } from '../../../../../../../app/shared/error/error.component';
import { ThemedLoadingComponent } from '../../../../../../../app/shared/loading/themed-loading.component';
import { ObjectCollectionComponent } from '../../../../../../../app/shared/object-collection/object-collection.component';
import { VarDirective } from '../../../../../../../app/shared/utils/var.directive';

@Component({
  selector: 'ds-themed-community-page-sub-collection-list',
  // styleUrls: ['./community-page-sub-collection-list.component.scss'],
  styleUrls: ['../../../../../../../app/community-page/sections/sub-com-col-section/sub-collection-list/community-page-sub-collection-list.component.scss'],
  // templateUrl: './community-page-sub-collection-list.component.html',
  templateUrl: '../../../../../../../app/community-page/sections/sub-com-col-section/sub-collection-list/community-page-sub-collection-list.component.html',
  imports: [
    ObjectCollectionComponent,
    ErrorComponent,
    ThemedLoadingComponent,
    NgIf,
    TranslateModule,
    AsyncPipe,
    VarDirective,
  ],
  standalone: true,
})
export class CommunityPageSubCollectionListComponent extends BaseComponent {
}
