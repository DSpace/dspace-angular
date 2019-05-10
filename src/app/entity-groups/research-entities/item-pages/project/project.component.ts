import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Item } from '../../../../core/shared/item.model';
import { ItemViewMode, rendersItemType } from '../../../../shared/items/item-type-decorator';
import { isNotEmpty } from '../../../../shared/empty.util';
import { ItemComponent } from '../../../../+item-page/simple/item-types/shared/item.component';
import {
  filterRelationsByTypeLabel,
  relationsToItems
} from '../../../../+item-page/simple/item-types/shared/item-relationships-utils';

@rendersItemType('Project', ItemViewMode.Full)
@Component({
  selector: 'ds-project',
  styleUrls: ['./project.component.scss'],
  templateUrl: './project.component.html'
})
/**
 * The component for displaying metadata and relations of an item of the type Project
 */
export class ProjectComponent extends ItemComponent implements OnInit {
  /**
   * The people related to this project
   */
  people$: Observable<Item[]>;

  /**
   * The publications related to this project
   */
  publications$: Observable<Item[]>;

  /**
   * The organisation units related to this project
   */
  orgUnits$: Observable<Item[]>;

  ngOnInit(): void {
    super.ngOnInit();

    if (isNotEmpty(this.resolvedRelsAndTypes$)) {
      this.people$ = this.resolvedRelsAndTypes$.pipe(
        filterRelationsByTypeLabel('isPersonOfProject'),
        relationsToItems(this.item.id)
      );

      this.publications$ = this.resolvedRelsAndTypes$.pipe(
        filterRelationsByTypeLabel('isPublicationOfProject'),
        relationsToItems(this.item.id)
      );

      this.orgUnits$ = this.resolvedRelsAndTypes$.pipe(
        filterRelationsByTypeLabel('isOrgUnitOfProject'),
        relationsToItems(this.item.id)
      );
    }
  }
}
