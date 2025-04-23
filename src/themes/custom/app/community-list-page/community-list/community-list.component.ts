import { CdkTreeModule } from '@angular/cdk/tree';
import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { CommunityListComponent as BaseComponent } from '../../../../../app/community-list-page/community-list/community-list.component';
import { ThemedLoadingComponent } from '../../../../../app/shared/loading/themed-loading.component';
import { TruncatableComponent } from '../../../../../app/shared/truncatable/truncatable.component';
import { TruncatablePartComponent } from '../../../../../app/shared/truncatable/truncatable-part/truncatable-part.component';

@Component({
  selector: 'ds-themed-community-list',
  // styleUrls: ['./community-list.component.scss'],
  // templateUrl: './community-list.component.html'
  templateUrl: '../../../../../app/community-list-page/community-list/community-list.component.html',
  standalone: true,
  imports: [
    AsyncPipe,
    CdkTreeModule,
    RouterLink,
    ThemedLoadingComponent,
    TranslateModule,
    TruncatableComponent,
    TruncatablePartComponent,
  ],
})
export class CommunityListComponent extends BaseComponent {
}
