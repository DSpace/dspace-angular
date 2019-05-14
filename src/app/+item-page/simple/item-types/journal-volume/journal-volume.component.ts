import { Component, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ItemDataService } from '../../../../core/data/item-data.service';
import { Item } from '../../../../core/shared/item.model';
import { ItemViewMode, rendersItemType } from '../../../../shared/items/item-type-decorator';
import { ITEM } from '../../../../shared/items/switcher/item-type-switcher.component';
import { isNotEmpty } from '../../../../shared/empty.util';
import { ItemComponent } from '../shared/item.component';
import { filterRelationsByTypeLabel, relationsToItems } from '../shared/item-relationships-utils';

@rendersItemType('JournalVolume', ItemViewMode.Full)
@Component({
  selector: 'ds-journal-volume',
  styleUrls: ['./themes/journal-volume.component.mantis.scss'],
  templateUrl: './themes/journal-volume.component.mantis.html'
})
/**
 * The component for displaying metadata and relations of an item of the type Journal Volume
 */
export class JournalVolumeComponent extends ItemComponent {
  /**
   * The journals related to this journal volume
   */
  journals$: Observable<Item[]>;

  /**
   * The journal issues related to this journal volume
   */
  issues$: Observable<Item[]>;

  constructor(
    @Inject(ITEM) public item: Item,
    private ids: ItemDataService
  ) {
    super(item);
  }
  ngOnInit(): void {
    super.ngOnInit();

    if (isNotEmpty(this.resolvedRelsAndTypes$)) {
      this.journals$ = this.resolvedRelsAndTypes$.pipe(
        filterRelationsByTypeLabel('isJournalOfVolume'),
        relationsToItems(this.item.id, this.ids)
      );
      this.issues$ = this.resolvedRelsAndTypes$.pipe(
        filterRelationsByTypeLabel('isIssueOfJournalVolume'),
        relationsToItems(this.item.id, this.ids)
      );
    }
  }
}
