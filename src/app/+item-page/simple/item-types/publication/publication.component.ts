import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ItemDataService } from '../../../../core/data/item-data.service';
import { Item } from '../../../../core/shared/item.model';
import {
  DEFAULT_ITEM_TYPE,
  rendersItemType
} from '../../../../shared/items/item-type-decorator';
import { ITEM } from '../../../../shared/items/switcher/item-type-switcher.component';
import { ElementViewMode } from '../../../../shared/view-mode';
import { ItemComponent, filterRelationsByTypeLabel, relationsToItems } from '../shared/item.component';

@rendersItemType('Publication', ElementViewMode.Full)
@rendersItemType(DEFAULT_ITEM_TYPE, ElementViewMode.Full)
@Component({
  selector: 'ds-publication',
  styleUrls: ['./publication.component.scss'],
  templateUrl: './publication.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicationComponent extends ItemComponent implements OnInit {
  /**
   * The authors related to this publication
   */
  authors$: Observable<Item[]>;

  /**
   * The projects related to this publication
   */
  projects$: Observable<Item[]>;

  /**
   * The organisation units related to this publication
   */
  orgUnits$: Observable<Item[]>;

  /**
   * The journal issues related to this publication
   */
  journalIssues$: Observable<Item[]>;

  constructor(
    @Inject(ITEM) public item: Item,
    private ids: ItemDataService
  ) {
    super(item);
  }

  ngOnInit(): void {
    super.ngOnInit();

    if (this.resolvedRelsAndTypes$) {

      this.authors$ = this.resolvedRelsAndTypes$.pipe(
        filterRelationsByTypeLabel('isAuthorOfPublication'),
        relationsToItems(this.item.id, this.ids)
      );

      this.projects$ = this.resolvedRelsAndTypes$.pipe(
        filterRelationsByTypeLabel('isProjectOfPublication'),
        relationsToItems(this.item.id, this.ids)
      );

      this.orgUnits$ = this.resolvedRelsAndTypes$.pipe(
        filterRelationsByTypeLabel('isOrgUnitOfPublication'),
        relationsToItems(this.item.id, this.ids)
      );

      this.journalIssues$ = this.resolvedRelsAndTypes$.pipe(
        filterRelationsByTypeLabel('isJournalIssueOfPublication'),
        relationsToItems(this.item.id, this.ids)
      );

    }
  }
}
