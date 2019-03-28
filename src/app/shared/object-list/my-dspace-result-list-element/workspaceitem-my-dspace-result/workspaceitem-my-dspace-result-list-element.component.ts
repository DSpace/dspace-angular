import { Component } from '@angular/core';

import { Observable } from 'rxjs';
import { find } from 'rxjs/operators';

import { renderElementsFor } from '../../../object-collection/shared/dso-element-decorator';
import { MyDSpaceResultListElementComponent, } from '../my-dspace-result-list-element.component';
import { ViewMode } from '../../../../core/shared/view-mode.model';
import { Workspaceitem } from '../../../../core/submission/models/workspaceitem.model';
import { WorkspaceitemMyDSpaceResult } from '../../../object-collection/shared/workspaceitem-my-dspace-result.model';
import { RemoteData } from '../../../../core/data/remote-data';
import { isNotUndefined } from '../../../empty.util';
import { Item } from '../../../../core/shared/item.model';
import { MyDspaceItemStatusType } from '../../../object-collection/shared/mydspace-item-status/my-dspace-item-status-type';

@Component({
  selector: 'ds-workspaceitem-my-dspace-result-list-element',
  styleUrls: ['../my-dspace-result-list-element.component.scss', './workspaceitem-my-dspace-result-list-element.component.scss'],
  templateUrl: './workspaceitem-my-dspace-result-list-element.component.html',
})

@renderElementsFor(WorkspaceitemMyDSpaceResult, ViewMode.List)
export class WorkspaceitemMyDSpaceResultListElementComponent extends MyDSpaceResultListElementComponent<WorkspaceitemMyDSpaceResult, Workspaceitem> {

  item: Item;
  status = MyDspaceItemStatusType.IN_PROGRESS;

  ngOnInit() {
    this.initItem(this.dso.item as Observable<RemoteData<Item>>);
  }

  initItem(item$: Observable<RemoteData<Item>>) {
    item$.pipe(
      find((rd: RemoteData<Item>) => rd.hasSucceeded && isNotUndefined(rd.payload))
    ).subscribe((rd: RemoteData<Item>) => {
      this.item = rd.payload;
    });
  }
}
