import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Item } from '../../../../core/shared/item.model';
import { MetadataRepresentation } from '../../../../core/shared/metadata-representation/metadata-representation.model';
import { ItemViewMode, rendersItemType } from '../../../../shared/items/item-type-decorator';
import { ItemComponent } from '../../../../+item-page/simple/item-types/shared/item.component';
import { RemoteData } from '../../../../core/data/remote-data';
import { PaginatedList } from '../../../../core/data/paginated-list';

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
  contributors$: Observable<RemoteData<PaginatedList<MetadataRepresentation>>>;

  /**
   * The people related to this project
   */
  people$: Observable<RemoteData<PaginatedList<Item>>>;

  /**
   * The publications related to this project
   */
  publications$: Observable<RemoteData<PaginatedList<Item>>>;

  /**
   * The organisation units related to this project
   */
  orgUnits$: Observable<RemoteData<PaginatedList<Item>>>;

  ngOnInit(): void {
    this.contributors$ = this.buildRepresentations('OrgUnit', 'project.contributor.other', 'isOrgUnitOfProject');

    this.people$ = this.relationshipService.getRelatedItemsByLabel(this.item, 'isPersonOfProject');
    this.publications$ = this.relationshipService.getRelatedItemsByLabel(this.item, 'isPublicationOfProject');
    this.orgUnits$ = this.relationshipService.getRelatedItemsByLabel(this.item, 'isOrgUnitOfProject');
  }
}
