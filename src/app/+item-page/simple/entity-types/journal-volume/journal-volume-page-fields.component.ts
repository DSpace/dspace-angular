import { Component, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ItemDataService } from '../../../../core/data/item-data.service';
import { Item } from '../../../../core/shared/item.model';
import { rendersEntityType } from '../../../../shared/entities/entity-type-decorator';
import { ITEM } from '../../../../shared/entities/switcher/entity-type-switcher.component';
import { ElementViewMode } from '../../../../shared/view-mode';
import {
  EntityPageFieldsComponent, filterRelationsByTypeLabel,
  relationsToItems
} from '../shared/entity-page-fields.component';
import { isNotEmpty } from '../../../../shared/empty.util';

@rendersEntityType('JournalVolume', ElementViewMode.Full)
@Component({
  selector: 'ds-journal-volume-page-fields',
  styleUrls: ['./journal-volume-page-fields.component.scss'],
  templateUrl: './journal-volume-page-fields.component.html'
})
/**
 * The component for displaying metadata and relations of an item with entity type Journal Volume
 */
export class JournalVolumePageFieldsComponent extends EntityPageFieldsComponent {
  journals$: Observable<Item[]>;
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
