import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Item } from '../../../../core/shared/item.model';
import { MetadataRepresentation } from '../../../../core/shared/metadata-representation/metadata-representation.model';
import { ItemViewMode, rendersItemType } from '../../../../shared/items/item-type-decorator';
import { isNotEmpty } from '../../../../shared/empty.util';
import { ItemComponent } from '../../../../+item-page/simple/item-types/shared/item.component';
import { getRelatedItemsByTypeLabel } from '../../../../+item-page/simple/item-types/shared/item-relationships-utils';

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
   * The contributors related to this project
   */
  contributors$: Observable<MetadataRepresentation[]>;

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
      this.contributors$ = this.buildRepresentations('OrgUnit', 'project.contributor.other');

      this.people$ = this.resolvedRelsAndTypes$.pipe(
        getRelatedItemsByTypeLabel(this.item.id, 'isPersonOfProject')
      );

      this.publications$ = this.resolvedRelsAndTypes$.pipe(
        getRelatedItemsByTypeLabel(this.item.id, 'isPublicationOfProject')
      );

      this.orgUnits$ = this.resolvedRelsAndTypes$.pipe(
        getRelatedItemsByTypeLabel(this.item.id, 'isOrgUnitOfProject')
      );
    }
  }
}
