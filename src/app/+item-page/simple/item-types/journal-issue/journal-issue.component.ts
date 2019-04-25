import { Component, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ItemDataService } from '../../../../core/data/item-data.service';
import { Item } from '../../../../core/shared/item.model';
import { ItemViewMode, rendersItemType } from '../../../../shared/items/item-type-decorator';
import { ITEM } from '../../../../shared/items/switcher/item-type-switcher.component';
import { isNotEmpty } from '../../../../shared/empty.util';
import { ItemComponent } from '../shared/item.component';
import { filterRelationsByTypeLabel, relationsToItems } from '../shared/item-relationships-utils';

@rendersItemType('JournalIssue', ItemViewMode.Full)
@Component({
  selector: 'ds-journal-issue',
  styleUrls: ['./themes/journal-issue.component.mantis.scss'],
  templateUrl: './themes/journal-issue.component.mantis.html'
})
/**
 * The component for displaying metadata and relations of an item of the type Journal Issue
 */
export class JournalIssueComponent extends ItemComponent {
  /**
   * The volumes related to this journal issue
   */
  volumes$: Observable<Item[]>;

  /**
   * The publications related to this journal issue
   */
  publications$: Observable<Item[]>;

  constructor(
    @Inject(ITEM) public item: Item,
    private ids: ItemDataService
  ) {
    super(item);
  }
  ngOnInit(): void {
    super.ngOnInit();

    if (isNotEmpty(this.resolvedRelsAndTypes$)) {
      this.volumes$ = this.resolvedRelsAndTypes$.pipe(
        filterRelationsByTypeLabel('isJournalVolumeOfIssue'),
        relationsToItems(this.item.id, this.ids)
      );
      this.publications$ = this.resolvedRelsAndTypes$.pipe(
        filterRelationsByTypeLabel('isPublicationOfJournalIssue'),
        relationsToItems(this.item.id, this.ids)
      );
    }
  }
}
