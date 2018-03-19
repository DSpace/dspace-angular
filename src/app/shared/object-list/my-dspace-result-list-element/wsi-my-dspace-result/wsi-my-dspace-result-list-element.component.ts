import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { renderElementsFor } from '../../../object-collection/shared/dso-element-decorator';
import { MyDSpaceResultListElementComponent, } from '../my-dspace-result-list-element.component';
import { ViewMode } from '../../../../+search-page/search-options.model';
import { Workspaceitem } from '../../../../core/submission/models/workspaceitem.model';
import { WorkspaceitemMyDSpaceResult } from '../../../object-collection/shared/workspaceitem-my-dspace-result.model';
import { Item } from '../../../../core/shared/item.model';
import { RemoteData } from '../../../../core/data/remote-data';
import { Observable } from 'rxjs/Observable';
import { hasNoUndefinedValue, isNotEmpty } from '../../../empty.util';
import { Bitstream } from '../../../../core/shared/bitstream.model';
import { ListableObject } from '../../../object-collection/shared/listable-object.model';
import { Eperson } from '../../../../core/eperson/models/eperson.model';
import { AppState } from '../../../../app.reducer';
import { Store } from '@ngrx/store';
import { getAuthenticatedUser } from '../../../../core/auth/selectors';
import { WorkspaceitemDataService } from '../../../../core/submission/workspaceitem-data.service';
import { ItemStatusType } from '../../item-list-status/item-status-type';

@Component({
  selector: 'ds-workspaceitem-my-dspace-result-list-element',
  styleUrls: ['../my-dspace-result-list-element.component.scss', './wsi-my-dspace-result-list-element.component.scss'],
  templateUrl: './wsi-my-dspace-result-list-element.component.html',
})

@renderElementsFor(WorkspaceitemMyDSpaceResult, ViewMode.List)
export class WorkspaceitemMyDSpaceResultListElementComponent extends MyDSpaceResultListElementComponent<WorkspaceitemMyDSpaceResult, Workspaceitem> {
  item: Item;
  submitter: Observable<Eperson>;
  user: Observable<Eperson>;
  itemUuid: Observable<string>;
  messages: Observable<Bitstream[]> = Observable.of([]);
  status = ItemStatusType.IN_PROGRESS;

  constructor(private cdr: ChangeDetectorRef,
              private store: Store<AppState>,
              private wsiDataService: WorkspaceitemDataService,
              @Inject('objectElementProvider') public listable: ListableObject) {
    super(listable);
    this.status = ItemStatusType.IN_PROGRESS;
  }

  ngOnInit() {
    this.initItem(this.dso.item as Observable<RemoteData<Item[]>>);

    (this.dso.submitter as Observable<RemoteData<Eperson[]>>)
      .filter((rd: RemoteData<any>) => ((!rd.isRequestPending) && hasNoUndefinedValue(rd.payload)))
      .take(1)
      .subscribe((rd: RemoteData<any>) => {
        // console.log(rd);
        this.submitter = rd.payload[0];
      });

    this.store.select(getAuthenticatedUser)
      .filter((user: Eperson) => isNotEmpty(user))
      .take(1)
      .subscribe((user: Eperson) => {
        this.user = Observable.of(user);
      });

    this.populateMessages();
  }

  initItem(itemObs: Observable<RemoteData<Item[]>>) {
    itemObs
      .filter((rd: RemoteData<any>) => ((!rd.isRequestPending) && hasNoUndefinedValue(rd.payload)))
      .take(1)
      .subscribe((rd: RemoteData<any>) => {
        this.item = rd.payload[0];
        this.itemUuid = Observable.of(this.item.uuid);
      });
  }

  populateMessages() {
    this.item.getBitstreamsByBundleName('MESSAGE')
      .filter((bitStreams) => bitStreams !== null && bitStreams.length > 0)
      .take(1)
      .subscribe((bitStreams: Bitstream[]) => {
        this.messages = Observable.of(bitStreams);
      });
  }

  refresh() {
    // TODO Call a rest api to refresh the item
    // Wait some ms before, so previous call can be served
    this.wsiDataService.findById(this.dso.id)
      .filter((wsi: RemoteData<Workspaceitem>) => wsi.hasSucceeded)
      .take(1)
      .subscribe((wsi) => {
        // console.log('Refresh wsi...');
        this.dso = wsi.payload;
        this.initItem(this.dso.item as Observable<RemoteData<Item[]>>);
        this.populateMessages();
      });
  }

}
