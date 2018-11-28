import { Component, Inject, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ItemDataService } from '../../../../core/data/item-data.service';
import { Item } from '../../../../core/shared/item.model';
import { rendersEntityType } from '../../../../shared/entities/entity-type-decorator';
import { ElementViewMode } from '../../../../shared/view-mode';
import { ITEM } from '../../../../shared/entities/switcher/entity-type-switcher.component';
import { isNotEmpty } from '../../../../shared/empty.util';
import { EntityComponent, filterRelationsByTypeLabel, relationsToItems } from '../shared/entity.component';

@rendersEntityType('OrgUnit', ElementViewMode.Full)
@Component({
  selector: 'ds-orgunit',
  styleUrls: ['./orgunit.component.scss'],
  templateUrl: './orgunit.component.html'
})
/**
 * The component for displaying metadata and relations of an item with entity type Organisation Unit
 */
export class OrgunitComponent extends EntityComponent implements OnInit {
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
