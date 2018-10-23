import { Component, Inject, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ItemDataService } from '../../../../core/data/item-data.service';
import { Item } from '../../../../core/shared/item.model';
import { rendersEntityType } from '../../../../shared/entities/entity-type-decorator';
import { ElementViewMode } from '../../../../shared/view-mode';
import { ITEM } from '../../../../shared/entities/switcher/entity-type-switcher.component';
import {
  EntityPageFieldsComponent, filterRelationsByTypeLabel,
  relationsToItems
} from '../shared/entity-page-fields.component';
import { isNotEmpty } from '../../../../shared/empty.util';

@rendersEntityType('Project', ElementViewMode.Full)
@Component({
  selector: 'ds-project-page-fields',
  styleUrls: ['./project-page-fields.component.scss'],
  templateUrl: './project-page-fields.component.html'
})
/**
 * The component for displaying metadata and relations of an item with entity type Project
 */
export class ProjectPageFieldsComponent extends EntityPageFieldsComponent implements OnInit {
  people$: Observable<Item[]>;
  publications$: Observable<Item[]>;
  orgUnits$: Observable<Item[]>;

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
        filterRelationsByTypeLabel('isPersonOfProject'),
        relationsToItems(this.item.id, this.ids)
      );

      this.publications$ = this.resolvedRelsAndTypes$.pipe(
        filterRelationsByTypeLabel('isPublicationOfProject'),
        relationsToItems(this.item.id, this.ids)
      );

      this.orgUnits$ = this.resolvedRelsAndTypes$.pipe(
        filterRelationsByTypeLabel('isOrgUnitOfProject'),
        relationsToItems(this.item.id, this.ids)
      );
    }
  }
}
