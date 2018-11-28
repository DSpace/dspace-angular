import { Component, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ItemDataService } from '../../../../core/data/item-data.service';
import { Item } from '../../../../core/shared/item.model';
import { rendersEntityType } from '../../../../shared/entities/entity-type-decorator';
import { ITEM } from '../../../../shared/entities/switcher/entity-type-switcher.component';
import { ElementViewMode } from '../../../../shared/view-mode';
import { isNotEmpty } from '../../../../shared/empty.util';
import { EntityComponent, filterRelationsByTypeLabel, relationsToItems } from '../shared/entity.component';

@rendersEntityType('JournalIssue', ElementViewMode.Full)
@Component({
  selector: 'ds-journal-issue',
  styleUrls: ['./journal-issue.component.scss'],
  templateUrl: './journal-issue.component.html'
})
/**
 * The component for displaying metadata and relations of an item with entity type Journal Issue
 */
export class JournalIssueComponent extends EntityComponent {
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
