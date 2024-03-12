import { Component } from '@angular/core';

import {
  TopLevelCommunityListComponent as BaseComponent
} from '../../../../../app/home-page/top-level-community-list/top-level-community-list.component';
import { VarDirective } from '../../../../../app/shared/utils/var.directive';
import { AsyncPipe, NgIf } from '@angular/common';
import { ObjectCollectionComponent } from '../../../../../app/shared/object-collection/object-collection.component';
import { ErrorComponent } from '../../../../../app/shared/error/error.component';
import { ThemedLoadingComponent } from '../../../../../app/shared/loading/themed-loading.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'ds-top-level-community-list',
  // styleUrls: ['./top-level-community-list.component.scss'],
  styleUrls: ['../../../../../app/home-page/top-level-community-list/top-level-community-list.component.scss'],
  // templateUrl: './top-level-community-list.component.html'
  templateUrl: '../../../../../app/home-page/top-level-community-list/top-level-community-list.component.html',
  standalone: true,
  imports: [VarDirective, NgIf, ObjectCollectionComponent, ErrorComponent, ThemedLoadingComponent, AsyncPipe, TranslateModule]
})

export class TopLevelCommunityListComponent extends BaseComponent {}

