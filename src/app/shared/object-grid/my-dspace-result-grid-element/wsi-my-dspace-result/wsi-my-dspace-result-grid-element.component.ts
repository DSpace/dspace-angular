import { Component, Inject } from '@angular/core';
import { renderElementsFor } from '../../../object-collection/shared/dso-element-decorator';
import { ViewMode } from '../../../../+search-page/search-options.model';
import { Workspaceitem } from '../../../../core/submission/models/workspaceitem.model';
import { WorkspaceitemMyDSpaceResult } from '../../../object-collection/shared/workspaceitem-my-dspace-result.model';
import { Item } from '../../../../core/shared/item.model';
import { RemoteData } from '../../../../core/data/remote-data';
import { Observable } from 'rxjs/Observable';
import { hasNoUndefinedValue, isNotEmpty } from '../../../empty.util';
import { Bitstream } from '../../../../core/shared/bitstream.model';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ListableObject } from '../../../object-collection/shared/listable-object.model';
import { Eperson } from '../../../../core/eperson/models/eperson.model';
import { AppState } from '../../../../app.reducer';
import { Store } from '@ngrx/store';
import { getAuthenticatedUser } from '../../../../core/auth/selectors';
import { WorkspaceitemDataService } from '../../../../core/submission/workspaceitem-data.service';
import { MyDSpaceResultGridElementComponent } from '../my-dspace-result-grid-element.component';

@Component({
  selector: 'ds-workspaceitem-my-dspace-result-grid-element',
  styleUrls: ['../my-dspace-result-grid-element.component.scss', './wsi-my-dspace-result-grid-element.component.scss'],
  templateUrl: './wsi-my-dspace-result-grid-element.component.html',
})

@renderElementsFor(WorkspaceitemMyDSpaceResult, ViewMode.Grid)
@renderElementsFor(Workspaceitem, ViewMode.Grid)
export class WorkspaceitemMyDSpaceResultGridElementComponent extends MyDSpaceResultGridElementComponent<WorkspaceitemMyDSpaceResult, Workspaceitem> {
  public item: Item;
  public submitter: Eperson;
  public user: Eperson;
  public messages: Bitstream[] = [];
  public unRead = [];
  public modalRef: NgbModalRef;

  constructor(private modalService: NgbModal,
              private store: Store<AppState>,
              private wsiDataService: WorkspaceitemDataService,
              @Inject('objectElementProvider') public listable: ListableObject) {
    super(listable);
  }

  ngOnInit() {
    this.initItem(this.dso.item as Observable<RemoteData<Item[]>>);

    (this.dso.submitter as Observable<RemoteData<Eperson[]>>)
      .filter((rd: RemoteData<any>) => ((!rd.isRequestPending) && hasNoUndefinedValue(rd.payload)))
      .first()
      .subscribe((rd: RemoteData<any>) => {
        // console.log(rd);
        this.submitter = rd.payload[0];
      });

    this.store.select(getAuthenticatedUser)
      .filter((user: Eperson) => isNotEmpty(user))
      .take(1)
      .subscribe((user: Eperson) => {
        this.user = user;
      });

    this.populateMessages();
  }

  initItem(itemObs: Observable<RemoteData<Item[]>>) {
    itemObs
      .filter((rd: RemoteData<any>) => ((!rd.isRequestPending) && hasNoUndefinedValue(rd.payload)))
      .first()
      .subscribe((rd: RemoteData<any>) => {
        this.item = rd.payload[0];
      });
  }

  openMessageBoard(content) {
    this.modalRef = this.modalService.open(content);
  }

  isUnread(m: Bitstream): boolean {
    const accessioned = m.findMetadata('dc.date.accessioned');
    const type = m.findMetadata('dc.type');
    if (this.user.uuid === this.submitter.uuid
      && !accessioned
      && type === 'outbound') {
      return true;
    } else if (this.user.uuid !== this.submitter.uuid
      && !accessioned
      && type === 'inbound') {
      return true;
    }
    return false;
  }

  populateMessages() {
    this.item.getBitstreamsByBundleName('MESSAGE')
      .filter((bitStreams) => bitStreams !== null && bitStreams.length > 0)
      .first()
      .subscribe((bitStreams: Bitstream[]) => {
        this.messages = bitStreams;
        this.unRead = [];
        bitStreams.forEach((b: Bitstream) => {
          if (this.isUnread(b)) {
            this.unRead.push(b.uuid);
          }
        });
        // console.log('Now unRead has', this.unRead.length, ' messages');
      });
  }

  refresh() {
    // TODO Call a rest api to refresh the item
    // Wait some ms before, so previous call can be served
    this.wsiDataService.findById(this.dso.id)
      .filter((wsi: RemoteData<Workspaceitem>) => wsi.hasSucceeded)
      .first()
      .subscribe((wsi) => {
        // console.log('Refresh wsi...');
        this.dso = wsi.payload;
        this.initItem(this.dso.item as Observable<RemoteData<Item[]>>);
        this.populateMessages();
      });
  }

}
