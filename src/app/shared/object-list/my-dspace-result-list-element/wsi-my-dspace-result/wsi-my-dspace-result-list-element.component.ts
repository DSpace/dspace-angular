import { Component, Inject } from '@angular/core';

import { renderElementsFor } from '../../../object-collection/shared/dso-element-decorator';
import { MyDSpaceResultListElementComponent, } from '../my-dspace-result-list-element.component';
import { ViewMode } from '../../../../+search-page/search-options.model';
import { Workspaceitem } from '../../../../core/submission/models/workspaceitem.model';
import { WorkspaceitemMyDSpaceResult } from '../../../object-collection/shared/workspaceitem-my-dspace-result.model';
import { Item } from '../../../../core/shared/item.model';
import { RemoteData } from '../../../../core/data/remote-data';
import { Observable } from 'rxjs/Observable';
import { hasNoUndefinedValue, hasNoValue, isEmpty } from '../../../empty.util';
import { Metadatum } from '../../../../core/shared/metadatum.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ListableObject } from '../../../object-collection/shared/listable-object.model';

import * as data from '../../../../../backend/data/bitstream-messages.json';
import { Bitstream } from '../../../../core/shared/bitstream.model';
import { PageInfo } from '../../../../core/shared/page-info.model';
import { PaginatedList } from '../../../../core/data/paginated-list';

@Component({
  selector: 'ds-workspaceitem-my-dspace-result-list-element',
  styleUrls: ['../my-dspace-result-list-element.component.scss', './wsi-my-dspace-result-list-element.component.scss'],
  templateUrl: './wsi-my-dspace-result-list-element.component.html',
})

@renderElementsFor(WorkspaceitemMyDSpaceResult, ViewMode.List)
@renderElementsFor(Workspaceitem, ViewMode.List)
export class WorkspaceitemMyDSpaceResultListElementComponent extends MyDSpaceResultListElementComponent<WorkspaceitemMyDSpaceResult, Workspaceitem> {
  public item: Item;
  public messages: Bitstream[] = [];
  public showMessageBoard = false;
  public unRead = 0;

  // public constructor(private modalService: NgbModal, @Inject('objectElementProvider') public listable: ListableObject) {
  //   super(listable);
  // }

  ngOnInit() {
    (this.dso.item as Observable<RemoteData<Item[]>>)
      .filter((rd: RemoteData<any>) => ((!rd.isRequestPending) && hasNoUndefinedValue(rd.payload)))
      .first()
      .subscribe((rd: RemoteData<any>) => {
        this.item = rd.payload[0];
      });

    // TODO REMOVE WHEN BACK-END WILL MANAGE MESSAGE
    const bitstreams = 'bitstreams';
    const messages: Bitstream[] = data[bitstreams];
    this.item.bitstreams = Observable.of(new RemoteData(
      false,
      false,
      true,
      undefined,
      messages));
    // TODO END REMOVE

    const messagesObs = this.item.getBitstreamsByBundleName('MESSAGE');
    // TODO Test.... later here I must to create this.messages here
    messagesObs
    // .filter()
      .take(1)
      .subscribe((m) => {
        // console.log(m);
      });

    messages.forEach((m) => {
      const b = Object.assign(new Bitstream(), m);
      this.messages.push(b);
      const accepted = b.findMetadata('dc.date.accepted');
      if (!accepted || accepted.length === 0) {
        this.unRead++;
      }
    });

  }

  getTitle(): string {
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
          result = md.value;
          return true;
        }
      }
    );
    if (hasNoValue(result)) {
      result = this.item.findMetadata(key);
    }
    return result;
  }

  openMessageBoard() {
    // this.modalService.open('test');
    this.showMessageBoard = true;
  }

  hideMessageBoard() {
    this.showMessageBoard = false;
  }

// CREAZIONE messaggio
// - POST /api/messages
// argomenti
// - uuid item
// - subject
// - description
//
// PRESA visione
// - POST /api/messages/read
// argomenti
// - uuid bitsream
//
// CANCELLA visione
// - POST /api/messages/unread
// argomenti
// - uuid bitsream

}


