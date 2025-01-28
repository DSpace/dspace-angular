import {
  AsyncPipe,
  NgIf,
} from '@angular/common';
import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { TopLevelCommunityListComponent as BaseComponent } from '../../../../../app/home-page/top-level-community-list/top-level-community-list.component';
import { ErrorComponent } from '../../../../../app/shared/error/error.component';
import { ThemedLoadingComponent } from '../../../../../app/shared/loading/themed-loading.component';
import { ObjectCollectionComponent } from '../../../../../app/shared/object-collection/object-collection.component';
import { VarDirective } from '../../../../../app/shared/utils/var.directive';

@Component({
  selector: 'ds-themed-top-level-community-list',
  // styleUrls: ['./top-level-community-list.component.scss'],
  styleUrls: ['../../../../../app/home-page/top-level-community-list/top-level-community-list.component.scss'],
  // templateUrl: './top-level-community-list.component.html'
  templateUrl: '../../../../../app/home-page/top-level-community-list/top-level-community-list.component.html',
  standalone: true,
  imports: [VarDirective, NgIf, ObjectCollectionComponent, ErrorComponent, ThemedLoadingComponent, AsyncPipe, TranslateModule],
})

export class TopLevelCommunityListComponent extends BaseComponent {}

