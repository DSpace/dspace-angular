import { Component, Inject, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ItemDataService } from '../../../../core/data/item-data.service';
import { Item } from '../../../../core/shared/item.model';
import { ItemViewMode, rendersItemType } from '../../../../shared/items/item-type-decorator';
import { ITEM } from '../../../../shared/items/switcher/item-type-switcher.component';
import { isNotEmpty } from '../../../../shared/empty.util';
import { ItemComponent } from '../shared/item.component';
import { filterRelationsByTypeLabel, relationsToItems } from '../shared/item-relationships-utils';

@rendersItemType('OrgUnit', ItemViewMode.Full)
@Component({
  selector: 'ds-orgunit',
  styleUrls: ['./themes/orgunit.component.mantis.scss'],
  templateUrl: './themes/orgunit.component.mantis.html'
})
/**
 * The component for displaying metadata and relations of an item of the type Organisation Unit
 */
export class OrgunitComponent extends ItemComponent implements OnInit {
  /**
   * The people related to this organisation unit
   */
  people$: Observable<Item[]>;

  /**
   * The projects related to this organisation unit
   */
  projects$: Observable<Item[]>;

  /**
   * The publications related to this organisation unit
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
      this.people$ = this.resolvedRelsAndTypes$.pipe(
        filterRelationsByTypeLabel('isPersonOfOrgUnit'),
        relationsToItems(this.item.id, this.ids)
      );

      this.projects$ = this.resolvedRelsAndTypes$.pipe(
        filterRelationsByTypeLabel('isProjectOfOrgUnit'),
        relationsToItems(this.item.id, this.ids)
      );

      this.publications$ = this.resolvedRelsAndTypes$.pipe(
        filterRelationsByTypeLabel('isPublicationOfOrgUnit'),
        relationsToItems(this.item.id, this.ids)
      );
    }
  }}
