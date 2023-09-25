import { Component } from '@angular/core';
import { CommunityPageSubCollectionListComponent as BaseComponent }
  from '../../../../../app/community-page/sub-collection-list/community-page-sub-collection-list.component';
import { ObjectCollectionComponent } from '../../../../../app/shared/object-collection/object-collection.component';
import { ErrorComponent } from '../../../../../app/shared/error/error.component';
import { ThemedLoadingComponent } from '../../../../../app/shared/loading/themed-loading.component';
import { AsyncPipe, NgIf } from '@angular/common';
import { VarDirective } from '../../../../../app/shared/utils/var.directive';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'ds-community-page-sub-collection-list',
  // styleUrls: ['./community-page-sub-collection-list.component.scss'],
  styleUrls: ['../../../../../app/community-page/sub-collection-list/community-page-sub-collection-list.component.scss'],
  // templateUrl: './community-page-sub-collection-list.component.html',
  templateUrl: '../../../../../app/community-page/sub-collection-list/community-page-sub-collection-list.component.html',
  imports: [
    ObjectCollectionComponent,
    ErrorComponent,
    ThemedLoadingComponent,
    NgIf,
    VarDirective,
    AsyncPipe,
    TranslateModule
  ],
  standalone: true
})
export class CommunityPageSubCollectionListComponent extends BaseComponent {}
