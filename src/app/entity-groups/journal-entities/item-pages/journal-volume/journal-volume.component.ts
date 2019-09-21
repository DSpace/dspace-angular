import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Item } from '../../../../core/shared/item.model';
import { ItemViewMode, rendersItemType } from '../../../../shared/items/item-type-decorator';
import { isNotEmpty } from '../../../../shared/empty.util';
import { ItemComponent } from '../../../../+item-page/simple/item-types/shared/item.component';
import { getRelatedItemsByTypeLabel } from '../../../../+item-page/simple/item-types/shared/item-relationships-utils';

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
  journals$: Observable<Item[]>;

  /**
   * The journal issues related to this journal volume
   */
  issues$: Observable<Item[]>;

  ngOnInit(): void {
    super.ngOnInit();

    if (isNotEmpty(this.resolvedRelsAndTypes$)) {
      this.journals$ = this.resolvedRelsAndTypes$.pipe(
        getRelatedItemsByTypeLabel(this.item.id, 'isJournalOfVolume')
      );
      this.issues$ = this.resolvedRelsAndTypes$.pipe(
        getRelatedItemsByTypeLabel(this.item.id, 'isIssueOfJournalVolume')
      );
    }
  }
}
