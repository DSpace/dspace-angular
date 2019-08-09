import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Item } from '../../../../core/shared/item.model';
import { ItemViewMode, rendersItemType } from '../../../../shared/items/item-type-decorator';
import { ItemComponent } from '../../../../+item-page/simple/item-types/shared/item.component';

@rendersItemType('OrgUnit', ItemViewMode.Detail)
@Component({
  selector: 'ds-orgunit',
  styleUrls: ['./orgunit.component.scss'],
  templateUrl: './orgunit.component.html'
})
/**
 * The component for displaying metadata and relations of an item of the type Organisation Unit
 */
export class OrgunitComponent extends ItemComponent implements OnInit {
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

  ngOnInit(): void {
    super.ngOnInit();
    this.people$ = this.relationshipService.getRelatedItemsByLabel(this.item, 'isPersonOfOrgUnit');
    this.projects$ = this.relationshipService.getRelatedItemsByLabel(this.item, 'isProjectOfOrgUnit');
    this.publications$ = this.relationshipService.getRelatedItemsByLabel(this.item, 'isPublicationOfOrgUnit');
  }
}
