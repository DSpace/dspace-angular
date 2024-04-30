import {
  AsyncPipe,
  NgClass,
  NgFor,
  NgIf,
} from '@angular/common';
import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { fadeInOut } from '../../../../../../../app/shared/animations/fade';
import { ThemedBadgesComponent } from '../../../../../../../app/shared/object-collection/shared/badges/themed-badges.component';
import { ItemCollectionComponent } from '../../../../../../../app/shared/object-collection/shared/mydspace-item-collection/item-collection.component';
import { ItemSubmitterComponent } from '../../../../../../../app/shared/object-collection/shared/mydspace-item-submitter/item-submitter.component';
import { ItemListPreviewComponent as BaseComponent } from '../../../../../../../app/shared/object-list/my-dspace-result-list-element/item-list-preview/item-list-preview.component';
import { TruncatableComponent } from '../../../../../../../app/shared/truncatable/truncatable.component';
import { TruncatablePartComponent } from '../../../../../../../app/shared/truncatable/truncatable-part/truncatable-part.component';
import { ThemedThumbnailComponent } from '../../../../../../../app/thumbnail/themed-thumbnail.component';

@Component({
  selector: 'ds-themed-item-list-preview',
  // styleUrls: ['./item-list-preview.component.scss'],
  styleUrls: ['../../../../../../../app/shared/object-list/my-dspace-result-list-element/item-list-preview/item-list-preview.component.scss'],
  // templateUrl: './item-list-preview.component.html',
  templateUrl: '../../../../../../../app/shared/object-list/my-dspace-result-list-element/item-list-preview/item-list-preview.component.html',
  animations: [fadeInOut],
  standalone: true,
  imports: [
    AsyncPipe,
    ItemCollectionComponent,
    ItemSubmitterComponent,
    NgClass,
    NgFor,
    NgIf,
    ThemedBadgesComponent,
    ThemedThumbnailComponent,
    TranslateModule,
    TruncatableComponent,
    TruncatablePartComponent,
  ],
})
export class ItemListPreviewComponent extends BaseComponent {
}
