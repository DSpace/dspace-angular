import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  AccessControlArrayFormComponent
} from '../../../shared/access-control-array-form/access-control-array-form.component';
import { concatMap, Observable, shareReplay } from 'rxjs';
import { ItemAccessControlService } from './item-access-control.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  ITEM_ACCESS_CONTROL_SELECT_BITSTREAMS_LIST_ID,
  ItemAccessControlSelectBitstreamsModalComponent
} from './item-access-control-select-bitstreams-modal/item-access-control-select-bitstreams-modal.component';
import { map, take } from 'rxjs/operators';
import { getFirstSucceededRemoteData } from '../../../core/shared/operators';
import { RemoteData } from '../../../core/data/remote-data';
import { Item } from '../../../core/shared/item.model';
import { ActivatedRoute } from '@angular/router';
import { SelectableListService } from '../../../shared/object-list/selectable-list/selectable-list.service';
import { ListableObject } from '../../../shared/object-collection/shared/listable-object.model';

@Component({
  selector: 'ds-item-access-control',
  templateUrl: './item-access-control.component.html',
  styleUrls: [ './item-access-control.component.scss' ],
  providers: [ ItemAccessControlService ]
})
export class ItemAccessControlComponent implements OnInit, OnDestroy {

  itemRD$: Observable<RemoteData<Item>>;

  @ViewChild('bitstreamAccessCmp', { static: true }) bitstreamAccessCmp: AccessControlArrayFormComponent;
  @ViewChild('itemAccessCmp', { static: true }) itemAccessCmp: AccessControlArrayFormComponent;

  constructor(
    private itemAccessControlService: ItemAccessControlService,
    private selectableListService: SelectableListService,
    protected modalService: NgbModal,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  state = initialState;

  dropdownData$ = this.itemAccessControlService.dropdownData$.pipe(
    shareReplay(1)
  );

  ngOnInit(): void {
    this.itemRD$ = this.route.parent.parent.data.pipe(
      map((data) => data.dso)
    ).pipe(getFirstSucceededRemoteData()) as Observable<RemoteData<Item>>;
  }

  reset() {
    this.bitstreamAccessCmp.reset();
    this.itemAccessCmp.reset();
    this.state = initialState;
  }

  submit() {
    const bitstreamAccess = this.bitstreamAccessCmp.getValue();
    const itemAccess = this.itemAccessCmp.getValue();

    this.itemAccessControlService.execute({
      bitstreamAccess,
      itemAccess,
      state: this.state
    });
  }

  handleStatusChange(type: 'item' | 'bitstream', active: boolean) {
    if (type === 'bitstream') {
      active ? this.bitstreamAccessCmp.enable() : this.bitstreamAccessCmp.disable();
    } else if (type === 'item') {
      active ? this.itemAccessCmp.enable() : this.itemAccessCmp.disable();
    }
  }

  openSelectBitstreamsModal(item: Item) {
    const ref = this.modalService.open(ItemAccessControlSelectBitstreamsModalComponent);
    ref.componentInstance.selectedBitstreams = this.state.bitstream.selectedBitstreams;
    ref.componentInstance.item = item;

    ref.closed.pipe(
      concatMap(() => this.selectableListService.getSelectableList(ITEM_ACCESS_CONTROL_SELECT_BITSTREAMS_LIST_ID)),
      take(1)
    ).subscribe((list) => {
        this.state.bitstream.selectedBitstreams = list.selection;
        this.cdr.detectChanges();
    });
  }

  ngOnDestroy(): void {
    this.selectableListService.deselectAll(ITEM_ACCESS_CONTROL_SELECT_BITSTREAMS_LIST_ID);
  }
}

const initialState = {
  item: {
    toggleStatus: false,
    accessMode: '',
  },
  bitstream: {
    toggleStatus: false,
    accessMode: '',
    changesLimit: '', // 'all' | 'selected'
    selectedBitstreams: [] as ListableObject[],
  },
};
