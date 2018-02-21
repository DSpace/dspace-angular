import { Component, Inject } from '@angular/core';

import { renderElementsFor } from '../../../object-collection/shared/dso-element-decorator';
import { MyDSpaceResultListElementComponent, } from '../my-dspace-result-list-element.component';
import { ViewMode } from '../../../../+search-page/search-options.model';
import { Workspaceitem } from '../../../../core/submission/models/workspaceitem.model';
import { WorkspaceitemMyDSpaceResult } from '../../../object-collection/shared/workspaceitem-my-dspace-result.model';
import { Item } from '../../../../core/shared/item.model';
import { RemoteData } from '../../../../core/data/remote-data';
import { Observable } from 'rxjs/Observable';
import { hasNoUndefinedValue, hasNoValue, isEmpty, isNotEmpty } from '../../../empty.util';
import { Metadatum } from '../../../../core/shared/metadatum.model';
import { Bitstream } from '../../../../core/shared/bitstream.model';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ListableObject } from '../../../object-collection/shared/listable-object.model';
import { ItemStatus } from '../../../../core/shared/item-status';
import { Eperson } from '../../../../core/eperson/models/eperson.model';
import { AppState } from '../../../../app.reducer';
import { Store } from '@ngrx/store';
import { getAuthenticatedUser } from '../../../../core/auth/selectors';
import { WorkspaceitemDataService } from '../../../../core/submission/workspaceitem-data.service';
import { WorkitemMyDSpaceResultListElementComponent } from '../work-my-dspace-result/wi-my-dspace-result-list-element.component';

@Component({
  selector: 'ds-workspaceitem-my-dspace-result-list-element',
  styleUrls: ['../my-dspace-result-list-element.component.scss', './wsi-my-dspace-result-list-element.component.scss'],
  templateUrl: './wsi-my-dspace-result-list-element.component.html',
})

@renderElementsFor(WorkspaceitemMyDSpaceResult, ViewMode.List)
@renderElementsFor(Workspaceitem, ViewMode.List)
export class WorkspaceitemMyDSpaceResultListElementComponent
  extends WorkitemMyDSpaceResultListElementComponent {
  public item: Item;
  public submitter: Eperson;
  public user: Eperson;
  public messages: Bitstream[] = [];
  public unRead = [];
  public modalRef: NgbModalRef;
  public status: string;
  public statusString: string;
  public ALL_STATUS = [];

  constructor(private modalService: NgbModal,
              public store: Store<AppState>,
              public wsiDataService: WorkspaceitemDataService,
              @Inject('objectElementProvider') public listable: ListableObject) {
    super(store, wsiDataService, listable);
  }

  ngOnInit() {
    super.ngOnInit();
    this.populateMessages();
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
        console.log('Now unRead has', this.unRead.length, ' messages');
      });
  }

  refresh() {
    this.wsiDataService.findById(this.dso.id)
      .filter((wsi: RemoteData<Workspaceitem>) => wsi.hasSucceeded)
      .first()
      .subscribe((wsi) => {
        console.log('Refresh wsi...');
        this.dso = wsi.payload;
        this.initItem(this.dso.item as Observable<RemoteData<Item[]>>);
        this.populateMessages();
      });
  }

}
