import {Component, Inject} from '@angular/core';

import {renderElementsFor} from '../../../object-collection/shared/dso-element-decorator';
import {MyDSpaceResultListElementComponent,} from '../my-dspace-result-list-element.component';
import {ViewMode} from '../../../../+search-page/search-options.model';
import {Workspaceitem} from '../../../../core/submission/models/workspaceitem.model';
import {WorkspaceitemMyDSpaceResult} from '../../../object-collection/shared/workspaceitem-my-dspace-result.model';
import {Item} from '../../../../core/shared/item.model';
import {RemoteData} from '../../../../core/data/remote-data';
import {Observable} from 'rxjs/Observable';
import {hasNoUndefinedValue, hasNoValue, isEmpty} from '../../../empty.util';
import {Metadatum} from '../../../../core/shared/metadatum.model';

import * as data from '../../../../../backend/data/bitstream-messages.json';
import {Bitstream} from '../../../../core/shared/bitstream.model';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {ListableObject} from '../../../object-collection/shared/listable-object.model';
import { ItemStatus } from '../../../../core/shared/item-status';
import {Eperson} from '../../../../core/eperson/models/eperson.model';

@Component({
  selector: 'ds-workspaceitem-my-dspace-result-list-element',
  styleUrls: ['../my-dspace-result-list-element.component.scss', './wsi-my-dspace-result-list-element.component.scss'],
  templateUrl: './wsi-my-dspace-result-list-element.component.html',
})

@renderElementsFor(WorkspaceitemMyDSpaceResult, ViewMode.List)
@renderElementsFor(Workspaceitem, ViewMode.List)
export class WorkspaceitemMyDSpaceResultListElementComponent extends MyDSpaceResultListElementComponent<WorkspaceitemMyDSpaceResult, Workspaceitem> {
  public item: Item;
  public submitter: Eperson;
  public messages: Bitstream[] = [];
  public unRead = 0;
  public modalRef: NgbModalRef;
  public status: string;
  public statusString: string;
  public ALL_STATUS = [];

  constructor(private modalService: NgbModal, @Inject('objectElementProvider') public listable: ListableObject) {
    super(listable);
  }

  ngOnInit() {
    (this.dso.item as Observable<RemoteData<Item[]>>)
      .filter((rd: RemoteData<any>) => ((!rd.isRequestPending) && hasNoUndefinedValue(rd.payload)))
      .first()
      .subscribe((rd: RemoteData<any>) => {
        this.item = rd.payload[0];
      });

    (this.dso.submitter as Observable<RemoteData<Eperson[]>>)
      .filter((rd: RemoteData<any>) => ((!rd.isRequestPending) && hasNoUndefinedValue(rd.payload)))
      .first()
      .subscribe((rd: RemoteData<any>) => {
        this.submitter = rd.payload[0];
      });

    Object.keys(ItemStatus).forEach((s) => {
      this.ALL_STATUS.push(ItemStatus[s]);
    });

    // TODO REMOVE WHEN BACK-END WILL MANAGE MESSAGE
    // const bitstreams = 'bitstreams';
    // const messages: Bitstream[] = data[bitstreams];
    // this.item.bitstreams = Observable.of(new RemoteData(
    //   false,
    //   false,
    //   true,
    //   undefined,
    //   messages));

    let i = Math.random() * 10 % Object.keys(ItemStatus).length;
    // console.log(i);
    i = Math.round(i);
    // console.log('Rounded' + i);
    switch (i) {
      case 0: { this.status = ItemStatus.ACCEPTED; break;}
      case 1: { this.status = ItemStatus.REJECTED; break;}
      case 2: { this.status = ItemStatus.WAITING_CONTROLLER; break;}
      case 3: { this.status = ItemStatus.VALIDATION; break;}
      default: { this.status = ItemStatus.IN_PROGRESS; break;}
    }

    // TODO END REMOVE

    switch (this.status) {  // TODO switch on item.status or .getStatus()
      case ItemStatus.ACCEPTED: {
        this.statusString = 'Accepted';
        break;
      }
      case ItemStatus.REJECTED: {
        this.statusString = 'Rejected';
        break;
      }
      case ItemStatus.WAITING_CONTROLLER: {
        this.statusString = 'Waiting for controller';
        break;
      }
      case ItemStatus.VALIDATION: {
        this.statusString = 'Validation';
        break;
      }
      case ItemStatus.IN_PROGRESS: {
        this.statusString = 'In progress';
        break;
      }
    }

    const messagesObs = this.item.getBitstreamsByBundleName('MESSAGE');
    // TODO Test.... later I must to create this.messages here
    messagesObs
    // .filter()
      .take(1)
      .subscribe((bitStreams) => {
        console.log(bitStreams);
        this.messages = bitStreams;
      });

    this.messages.forEach((m) => {
      const b = Object.assign(new Bitstream(), m);
      this.messages.push(b);
      const accessioned = b.findMetadata('dc.date.accessioned');
      if (!accessioned || accessioned.length === 0) {
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

  openMessageBoard(content) {
    // this.modalService.open(content, {windowClass: 'dark-modal'});
    this.modalRef = this.modalService.open(content);
    // modalRef.componentInstance.name = 'test';
  }

}
