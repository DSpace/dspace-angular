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

@rendersEntityType('OrgUnit', ElementViewMode.Full)
@Component({
  selector: 'ds-orgunit-page-fields',
  styleUrls: ['./orgunit-page-fields.component.scss'],
  templateUrl: './orgunit-page-fields.component.html'
})
export class OrgUnitPageFieldsComponent extends EntityPageFieldsComponent implements OnInit {

  people$: Observable<Item[]>;
  projects$: Observable<Item[]>;
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
