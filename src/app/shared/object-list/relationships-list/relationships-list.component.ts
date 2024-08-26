import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';

import { Context } from '../../../core/shared/context.model';
import { Item } from '../../../core/shared/item.model';
import { ViewMode } from '../../../core/shared/view-mode.model';
import { ItemSearchResult } from '../../object-collection/shared/item-search-result.model';
import { listableObjectComponent } from '../../object-collection/shared/listable-object/listable-object.decorator';
import { SearchResultListElementComponent } from '../search-result-list-element/search-result-list-element.component';
import { RelationshipsItemsActionsComponent } from './relationships-items-actions/relationships-items-actions.component';
import { RelationshipsItemsListPreviewComponent } from './relationships-items-list-preview/relationships-items-list-preview.component';

@Component({
  selector: 'ds-relationships-list',
  templateUrl: './relationships-list.component.html',
  styleUrls: ['./relationships-list.component.scss'],
  imports: [
    RelationshipsItemsListPreviewComponent,
    RelationshipsItemsActionsComponent,
  ],
  standalone: true,
})

@listableObjectComponent(ItemSearchResult, ViewMode.ListElement, Context.RelationshipItem)
export class RelationshipsListComponent extends SearchResultListElementComponent<ItemSearchResult, Item> implements OnInit {


  /**
   * Emit custom event for listable object custom actions.
   */
  @Output() customEvent = new EventEmitter<any>();

  /**
   * Pass custom data to the component for custom utilization
   */
  @Input() customData: any;

  ngOnInit() {
    super.ngOnInit();
  }

}

