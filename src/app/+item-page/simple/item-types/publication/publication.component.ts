import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import {
  DEFAULT_ITEM_TYPE, ItemViewMode,
  rendersItemType
} from '../../../../shared/items/item-type-decorator';
import { ItemComponent } from '../shared/item.component';
import { MetadataRepresentation } from '../../../../core/shared/metadata-representation/metadata-representation.model';
import { RemoteData } from '../../../../core/data/remote-data';
import { PaginatedList } from '../../../../core/data/paginated-list';

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
  authors$: Observable<RemoteData<PaginatedList<MetadataRepresentation>>>;

  ngOnInit(): void {
    this.authors$ = this.buildRepresentations('Person', 'dc.contributor.author', 'isAuthorOfPublication');
  }
}
