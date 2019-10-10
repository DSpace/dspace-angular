import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Item } from '../../../../core/shared/item.model';
import {
  DEFAULT_ITEM_TYPE, ItemViewMode,
  rendersItemType
} from '../../../../shared/items/item-type-decorator';
import { ItemComponent } from '../shared/item.component';
import { MetadataRepresentation } from '../../../../core/shared/metadata-representation/metadata-representation.model';
import { getRelatedItemsByTypeLabel } from '../shared/item-relationships-utils';

@rendersItemType('Publication', ItemViewMode.Full)
@rendersItemType(DEFAULT_ITEM_TYPE, ItemViewMode.Full)
@Component({
  selector: 'ds-publication',
  styleUrls: ['./publication.component.scss'],
  templateUrl: './publication.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicationComponent extends ItemComponent implements OnInit {
  /**
   * The authors related to this publication
   */
  authors$: Observable<MetadataRepresentation[]>;

  /**
   * The projects related to this publication
   */
  projects$: Observable<Item[]>;

  /**
   * The organisation units related to this publication
   */
  orgUnits$: Observable<Item[]>;

  /**
   * The journal issues related to this publication
   */
  journalIssues$: Observable<Item[]>;

  ngOnInit(): void {
    super.ngOnInit();

    if (this.resolvedRelsAndTypes$) {

      this.authors$ = this.buildRepresentations('Person', 'dc.contributor.author');

      this.projects$ = this.resolvedRelsAndTypes$.pipe(
        getRelatedItemsByTypeLabel(this.item.id, 'isProjectOfPublication')
      );

      this.orgUnits$ = this.resolvedRelsAndTypes$.pipe(
        getRelatedItemsByTypeLabel(this.item.id, 'isOrgUnitOfPublication')
      );

      this.journalIssues$ = this.resolvedRelsAndTypes$.pipe(
        getRelatedItemsByTypeLabel(this.item.id, 'isJournalIssueOfPublication')
      );

    }
  }
}
