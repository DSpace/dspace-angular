import { Component, OnInit } from '@angular/core';
import { AdminNotifySearchResult } from '../models/admin-notify-message-search-result.model';
import { ViewMode } from '../../../core/shared/view-mode.model';
import { Context } from '../../../core/shared/context.model';
import { AdminNotifyMessage } from '../models/admin-notify-message.model';
import {
  tabulatableObjectsComponent
} from "../../../shared/object-collection/shared/tabulatable-objects/tabulatable-objects.decorator";
import {
  TabulatableResultListElementsComponent
} from "../../../shared/object-list/search-result-list-element/tabulatable-search-result/tabulatable-result-list-elements.component";
import { PaginatedList } from "../../../core/data/paginated-list.model";

@tabulatableObjectsComponent(AdminNotifySearchResult, ViewMode.Table, Context.CoarNotify)
@Component({
  selector: 'ds-admin-notify-search-result',
  templateUrl: './admin-notify-search-result.component.html',
  styleUrls: ['./admin-notify-search-result.component.scss']
})
export class AdminNotifySearchResultComponent  extends TabulatableResultListElementsComponent<PaginatedList<AdminNotifyMessage>, AdminNotifyMessage> implements OnInit{
    public indexableObjects: AdminNotifyMessage[];
    ngOnInit() {
      this.indexableObjects = this.objects.page.map(object => object.indexableObject);
      console.log(this.objects.page)
    }
}
