import { Component, Inject } from '@angular/core';
import { Observable ,  of as observableOf } from 'rxjs';
import { Item } from '../../../../core/shared/item.model';
import { ItemViewMode, rendersItemType } from '../../../../shared/items/item-type-decorator';
import { ITEM } from '../../../../shared/items/switcher/item-type-switcher.component';
import { SearchFixedFilterService } from '../../../../+search-page/search-filters/search-filter/search-fixed-filter.service';
import { isNotEmpty } from '../../../../shared/empty.util';
import { ItemComponent } from '../../../../+item-page/simple/item-types/shared/item.component';
import { getRelatedItemsByTypeLabel } from '../../../../+item-page/simple/item-types/shared/item-relationships-utils';

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
    private fixedFilterService: SearchFixedFilterService
  ) {
    super(item);
  }
  ngOnInit(): void {
    super.ngOnInit();

    if (isNotEmpty(this.resolvedRelsAndTypes$)) {
      this.publications$ = this.resolvedRelsAndTypes$.pipe(
        getRelatedItemsByTypeLabel(this.item.id, 'isPublicationOfAuthor')
      );

      this.projects$ = this.resolvedRelsAndTypes$.pipe(
        getRelatedItemsByTypeLabel(this.item.id, 'isProjectOfPerson')
      );

      this.orgUnits$ = this.resolvedRelsAndTypes$.pipe(
        getRelatedItemsByTypeLabel(this.item.id, 'isOrgUnitOfPerson')
      );

      this.fixedFilterQuery = this.fixedFilterService.getQueryByRelations('isAuthorOfPublication', this.item.id);
      this.fixedFilter$ = observableOf('publication');
    }
  }
}
