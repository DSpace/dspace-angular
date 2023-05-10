import { ChangeDetectorRef, Component, Input, NgModule, ViewChild } from '@angular/core';
import { concatMap, shareReplay } from 'rxjs';
import { RemoteData } from '../../core/data/remote-data';
import { Item } from '../../core/shared/item.model';
import {
  AccessControlArrayFormComponent,
  AccessControlArrayFormModule
} from '../access-control-array-form/access-control-array-form.component';
import {
  ItemAccessControlService
} from '../../item-page/edit-item-page/item-access-control/item-access-control.service';
import { SelectableListService } from '../object-list/selectable-list/selectable-list.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { take } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { ListableObject } from '../object-collection/shared/listable-object.model';
import { SharedModule } from '../shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { UiSwitchModule } from 'ngx-ui-switch';
import { DSpaceObject } from '../../core/shared/dspace-object.model';
import {
  ITEM_ACCESS_CONTROL_SELECT_BITSTREAMS_LIST_ID,
  ItemAccessControlSelectBitstreamsModalComponent
} from './item-access-control-select-bitstreams-modal/item-access-control-select-bitstreams-modal.component';

@Component({
  selector: 'ds-access-control-form-container',
  templateUrl: './access-control-form-container.component.html',
  styleUrls: ['./access-control-form-container.component.scss']
})
export class AccessControlFormContainerComponent<T extends DSpaceObject> {

  @Input() showLimitToSpecificBitstreams = false;
  @Input() itemRD: RemoteData<T>;

  @ViewChild('bitstreamAccessCmp', { static: true }) bitstreamAccessCmp: AccessControlArrayFormComponent;
  @ViewChild('itemAccessCmp', { static: true }) itemAccessCmp: AccessControlArrayFormComponent;

  constructor(
    private itemAccessControlService: ItemAccessControlService,
    private selectableListService: SelectableListService,
    protected modalService: NgbModal,
    private cdr: ChangeDetectorRef
  ) {}

  state = initialState;

  dropdownData$ = this.itemAccessControlService.dropdownData$.pipe(
    shareReplay(1)
  );

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

  // eslint-disable-next-line @angular-eslint/use-lifecycle-interface
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


@NgModule({
  imports: [ CommonModule, AccessControlArrayFormModule, SharedModule, TranslateModule, UiSwitchModule ],
  exports: [AccessControlFormContainerComponent],
  declarations: [ AccessControlFormContainerComponent, ItemAccessControlSelectBitstreamsModalComponent ],
})
export class AccessControlFormContainerModule {}


