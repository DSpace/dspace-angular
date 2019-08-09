import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Item } from '../../../../core/shared/item.model';
import { ItemViewMode, rendersItemType } from '../../../../shared/items/item-type-decorator';
import { ItemComponent } from '../../../../+item-page/simple/item-types/shared/item.component';

@rendersItemType('Journal', ItemViewMode.Detail)
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
  volumes$: Observable<Item[]>;

  ngOnInit(): void {
    super.ngOnInit();
    this.volumes$ = this.relationshipService.getRelatedItemsByLabel(this.item, 'isVolumeOfJournal');
  }
}
