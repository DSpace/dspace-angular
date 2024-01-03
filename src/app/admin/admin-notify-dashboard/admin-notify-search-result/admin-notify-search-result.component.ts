import { Component, OnInit } from '@angular/core';
import {
  listableObjectComponent
} from '../../../shared/object-collection/shared/listable-object/listable-object.decorator';
import { AdminNotifySearchResult } from '../models/admin-notify-message-search-result.model';
import { ViewMode } from '../../../core/shared/view-mode.model';
import { Context } from '../../../core/shared/context.model';
import {
  SearchResultListElementComponent
} from '../../../shared/object-list/search-result-list-element/search-result-list-element.component';
import { AdminNotifyMessage } from '../models/admin-notify-message.model';

@listableObjectComponent(AdminNotifySearchResult, ViewMode.ListElement, Context.CoarNotify)
@Component({
  selector: 'ds-admin-notify-search-result',
  templateUrl: './admin-notify-search-result.component.html',
  styleUrls: ['./admin-notify-search-result.component.scss']
})
export class AdminNotifySearchResultComponent  extends SearchResultListElementComponent<AdminNotifySearchResult, AdminNotifyMessage> implements OnInit{
    indexableObject: AdminNotifyMessage;
    ngOnInit() {
      this.indexableObject  = this.object.indexableObject;
    }
}
