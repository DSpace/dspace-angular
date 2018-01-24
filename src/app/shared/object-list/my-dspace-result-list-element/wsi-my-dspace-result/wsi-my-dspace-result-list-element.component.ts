import { Component } from '@angular/core';

import { renderElementsFor } from '../../../object-collection/shared/dso-element-decorator';
import { MyDSpaceResultListElementComponent, } from '../my-dspace-result-list-element.component';
import { ViewMode } from '../../../../+search-page/search-options.model';
import { Workspaceitem } from '../../../../core/submission/models/workspaceitem.model';
import { WorkspaceitemMyDSpaceResult } from '../../../object-collection/shared/workspaceitem-my-dspace-result.model';
import { Item } from '../../../../core/shared/item.model';
import { RemoteData } from '../../../../core/data/remote-data';
import { Observable } from 'rxjs/Observable';
import { hasNoUndefinedValue, hasNoValue, isEmpty, isNotEmpty, isNotUndefined } from '../../../empty.util';
import { Metadatum } from '../../../../core/shared/metadatum.model';

@Component({
  selector: 'ds-workspaceitem-my-dspace-result-list-element',
  styleUrls: ['../my-dspace-result-list-element.component.scss', './wsi-my-dspace-result-list-element.component.scss'],
  templateUrl: './wsi-my-dspace-result-list-element.component.html'
})

@renderElementsFor(WorkspaceitemMyDSpaceResult, ViewMode.List)
@renderElementsFor(Workspaceitem, ViewMode.List)
export class WorkspaceitemMyDSpaceResultListElementComponent extends MyDSpaceResultListElementComponent<WorkspaceitemMyDSpaceResult, Workspaceitem> {
  public item: Item;

  ngOnInit() {
    (this.dso.item as Observable<RemoteData<Item[]>>)
      .filter((rd: RemoteData<any>) => ((!rd.isRequestPending) && hasNoUndefinedValue(rd.payload)))
      .first()
      .subscribe((rd: RemoteData<any>) => {
      this.item = rd.payload[0];
    })
  }

  getTitle():string {
    return this.item.findMetadata('dc.title');
  }

  getDate(): string {
    return this.item.findMetadata('dc.date.issued');
  }

  getValues(keys: string[]): string[] {
    const results: string[] = new Array<string>();
    this.object.hitHighlights.forEach(
      (md: Metadatum) => {
        if (keys.indexOf(md.key) > -1) {
          results.push(md.value);
        }
      }
    );
    if (isEmpty(results)) {
      this.item.filterMetadata(keys).forEach(
        (md: Metadatum) => {
          results.push(md.value);
        }
      );
    }
    return results;
  }

  getFirstValue(key: string): string {
    let result: string;
    this.object.hitHighlights.some(
      (md: Metadatum) => {
        if (key === md.key) {
          result =  md.value;
          return true;
        }
      }
    );
    if (hasNoValue(result)) {
      result = this.item.findMetadata(key);
    }
    return result;
  }
}
