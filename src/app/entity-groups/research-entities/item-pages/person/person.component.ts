import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Item } from '../../../../core/shared/item.model';
import { ItemViewMode, rendersItemType } from '../../../../shared/items/item-type-decorator';
import { ItemComponent } from '../../../../+item-page/simple/item-types/shared/item.component';
import { RemoteData } from '../../../../core/data/remote-data';
import { PaginatedList } from '../../../../core/data/paginated-list';

@rendersItemType('Person', ItemViewMode.Full)
@Component({
  selector: 'ds-person',
  styleUrls: ['./person.component.scss'],
  templateUrl: './person.component.html'
})
/**
 * The component for displaying metadata and relations of an item of the type Person
 */
export class PersonComponent extends ItemComponent {
  /**
   * The publications related to this person
   */
  publications$: Observable<RemoteData<PaginatedList<Item>>>;

  /**
   * The projects related to this person
   */
  projects$: Observable<RemoteData<PaginatedList<Item>>>;

  /**
   * The organisation units related to this person
   */
  orgUnits$: Observable<RemoteData<PaginatedList<Item>>>;

  ngOnInit(): void {
    this.publications$ = this.relationshipService.getRelatedItemsByLabel(this.item, 'isPublicationOfAuthor');
    this.projects$ = this.relationshipService.getRelatedItemsByLabel(this.item, 'isProjectOfPerson');
    this.orgUnits$ = this.relationshipService.getRelatedItemsByLabel(this.item, 'isOrgUnitOfPerson');
  }
}
