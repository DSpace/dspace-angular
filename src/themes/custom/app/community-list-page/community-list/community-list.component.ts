import { CdkTreeModule } from '@angular/cdk/tree';
import {
  AsyncPipe,
  NgClass,
  NgIf,
} from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { CommunityListComponent as BaseComponent } from '../../../../../app/community-list-page/community-list/community-list.component';
import { ThemedLoadingComponent } from '../../../../../app/shared/loading/themed-loading.component';
import { TruncatableComponent } from '../../../../../app/shared/truncatable/truncatable.component';
import { TruncatablePartComponent } from '../../../../../app/shared/truncatable/truncatable-part/truncatable-part.component';

/**
 * A tree-structured list of nodes representing the communities, their subCommunities and collections.
 * Initially only the page-restricted top communities are shown.
 * Each node can be expanded to show its children and all children are also page-limited.
 * More pages of a page-limited result can be shown by pressing a show more node/link.
 * Which nodes were expanded is kept in the store, so this persists across pages.
 */
@Component({
  selector: 'ds-themed-community-list',
  // styleUrls: ['./community-list.component.scss'],
  // templateUrl: './community-list.component.html'
  templateUrl: '../../../../../app/community-list-page/community-list/community-list.component.html',
  standalone: true,
  imports: [NgIf, ThemedLoadingComponent, CdkTreeModule, NgClass, RouterLink, TruncatableComponent, TruncatablePartComponent, AsyncPipe, TranslateModule],
})
export class CommunityListComponent extends BaseComponent {}

