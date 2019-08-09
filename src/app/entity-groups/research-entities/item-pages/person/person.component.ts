import { Component, Inject } from '@angular/core';
import { Observable, of as observableOf } from 'rxjs';
import { Item } from '../../../../core/shared/item.model';
import { ItemViewMode, rendersItemType } from '../../../../shared/items/item-type-decorator';
import { ITEM } from '../../../../shared/items/switcher/item-type-switcher.component';
import { ItemComponent } from '../../../../+item-page/simple/item-types/shared/item.component';
import { getQueryByRelations } from '../../../../shared/utils/relation-query.utils';
import { RelationshipService } from '../../../../core/data/relationship.service';

@rendersItemType('Person', ItemViewMode.Detail)
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
  publications$: Observable<Item[]>;

  /**
   * The projects related to this person
   */
  projects$: Observable<Item[]>;

  /**
   * The organisation units related to this person
   */
  orgUnits$: Observable<Item[]>;

  /**
   * The applied fixed filter
   */
  fixedFilter$: Observable<string>;

  /**
   * The query used for applying the fixed filter
   */
  fixedFilterQuery: string;

  constructor(
    @Inject(ITEM) public item: Item,
    protected relationshipService: RelationshipService
  ) {
    super(item, relationshipService);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.publications$ = this.relationshipService.getRelatedItemsByLabel(this.item, 'isPublicationOfAuthor');
    this.projects$ = this.relationshipService.getRelatedItemsByLabel(this.item, 'isProjectOfPerson');
    this.orgUnits$ = this.relationshipService.getRelatedItemsByLabel(this.item, 'isOrgUnitOfPerson');

    this.fixedFilterQuery = getQueryByRelations('isAuthorOfPublication', this.item.id);
    this.fixedFilter$ = observableOf('publication');
  }
}
