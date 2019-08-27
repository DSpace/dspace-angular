import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Item } from '../../../../core/shared/item.model';
import { ItemViewMode, rendersItemType } from '../../../../shared/items/item-type-decorator';
import { ItemComponent } from '../../../../+item-page/simple/item-types/shared/item.component';
import { RemoteData } from '../../../../core/data/remote-data';
import { PaginatedList } from '../../../../core/data/paginated-list';

@rendersItemType('JournalVolume', ItemViewMode.Full)
@Component({
  selector: 'ds-journal-volume',
  styleUrls: ['./journal-volume.component.scss'],
  templateUrl: './journal-volume.component.html'
})
/**
 * The component for displaying metadata and relations of an item of the type Journal Volume
 */
export class JournalVolumeComponent extends ItemComponent {
  /**
   * The journals related to this journal volume
   */
  journals$: Observable<RemoteData<PaginatedList<Item>>>;

  /**
   * The journal issues related to this journal volume
   */
  issues$: Observable<RemoteData<PaginatedList<Item>>>;

  ngOnInit(): void {
    this.journals$ = this.relationshipService.getRelatedItemsByLabel(this.item, 'isJournalOfVolume');
    this.issues$ = this.relationshipService.getRelatedItemsByLabel(this.item, 'isIssueOfJournalVolume');
  }
}
