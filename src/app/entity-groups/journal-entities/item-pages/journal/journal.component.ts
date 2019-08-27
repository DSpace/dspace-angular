import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Item } from '../../../../core/shared/item.model';
import { ItemViewMode, rendersItemType } from '../../../../shared/items/item-type-decorator';
import { ItemComponent } from '../../../../+item-page/simple/item-types/shared/item.component';
import { RemoteData } from '../../../../core/data/remote-data';
import { PaginatedList } from '../../../../core/data/paginated-list';

@rendersItemType('Journal', ItemViewMode.Full)
@Component({
  selector: 'ds-journal',
  styleUrls: ['./journal.component.scss'],
  templateUrl: './journal.component.html'
})
/**
 * The component for displaying metadata and relations of an item of the type Journal
 */
export class JournalComponent extends ItemComponent {
  /**
   * The volumes related to this journal
   */
  volumes$: Observable<RemoteData<PaginatedList<Item>>>;

  ngOnInit(): void {
    this.volumes$ = this.relationshipService.getRelatedItemsByLabel(this.item, 'isVolumeOfJournal');
  }
}
