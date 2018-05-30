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

@rendersEntityType('Person', ElementViewMode.Full)
@Component({
  selector: 'ds-person-page-fields',
  styleUrls: ['./person-page-fields.component.scss'],
  templateUrl: './person-page-fields.component.html'
})
export class PersonPageFieldsComponent extends EntityPageFieldsComponent {
  publications$: Observable<Item[]>;
  projects$: Observable<Item[]>;
  orgUnits$: Observable<Item[]>;

  constructor(
    @Inject(ITEM) public item: Item,
    private ids: ItemDataService
  ) {
    super(item);
  }
  ngOnInit(): void {
    super.ngOnInit();

    this.publications$ = this.resolvedRelsAndTypes$.pipe(
      filterRelationsByTypeLabel('isPublicationOfAuthor'),
      relationsToItems(this.item.id, this.ids)
    );

    this.projects$ = this.resolvedRelsAndTypes$.pipe(
      filterRelationsByTypeLabel('isProjectOfPerson'),
      relationsToItems(this.item.id, this.ids)
    );

    this.orgUnits$ = this.resolvedRelsAndTypes$.pipe(
      filterRelationsByTypeLabel('isOrgUnitOfPerson'),
      relationsToItems(this.item.id, this.ids)
    );
  }
}
