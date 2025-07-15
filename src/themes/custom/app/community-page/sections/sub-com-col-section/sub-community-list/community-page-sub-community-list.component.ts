import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { CommunityPageSubCommunityListComponent as BaseComponent } from '../../../../../../../app/community-page/sections/sub-com-col-section/sub-community-list/community-page-sub-community-list.component';
import { ErrorComponent } from '../../../../../../../app/shared/error/error.component';
import { ThemedLoadingComponent } from '../../../../../../../app/shared/loading/themed-loading.component';
import { ObjectCollectionComponent } from '../../../../../../../app/shared/object-collection/object-collection.component';
import { VarDirective } from '../../../../../../../app/shared/utils/var.directive';

@Component({
  selector: 'ds-themed-community-page-sub-community-list',
  // styleUrls: ['./community-page-sub-community-list.component.scss'],
  styleUrls: ['../../../../../../../app/community-page/sections/sub-com-col-section/sub-community-list/community-page-sub-community-list.component.scss'],
  // templateUrl: './community-page-sub-community-list.component.html',
  templateUrl: '../../../../../../../app/community-page/sections/sub-com-col-section/sub-community-list/community-page-sub-community-list.component.html',
  standalone: true,
  imports: [
    AsyncPipe,
    ErrorComponent,
    ObjectCollectionComponent,
    ThemedLoadingComponent,
    TranslateModule,
    VarDirective,
  ],
})
export class CommunityPageSubCommunityListComponent extends BaseComponent {
}
