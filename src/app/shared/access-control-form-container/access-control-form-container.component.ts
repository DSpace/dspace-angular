import {
  AsyncPipe,
  NgIf,
} from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { UiSwitchModule } from 'ngx-ui-switch';
import {
  concatMap,
  Observable,
  shareReplay,
} from 'rxjs';
import {
  map,
  take,
} from 'rxjs/operators';

import { BulkAccessConfigDataService } from '../../core/config/bulk-access-config-data.service';
import { BulkAccessConditionOptions } from '../../core/config/models/bulk-access-condition-options.model';
import { RemoteData } from '../../core/data/remote-data';
import { DSpaceObject } from '../../core/shared/dspace-object.model';
import { Item } from '../../core/shared/item.model';
import { getFirstCompletedRemoteData } from '../../core/shared/operators';
import { AlertComponent } from '../alert/alert.component';
import { AlertType } from '../alert/alert-type';
import { SelectableListService } from '../object-list/selectable-list/selectable-list.service';
import { AccessControlArrayFormComponent } from './access-control-array-form/access-control-array-form.component';
import { createAccessControlInitialFormState } from './access-control-form-container-intial-state';
import { BulkAccessControlService } from './bulk-access-control.service';
import {
  ITEM_ACCESS_CONTROL_SELECT_BITSTREAMS_LIST_ID,
  ItemAccessControlSelectBitstreamsModalComponent,
} from './item-access-control-select-bitstreams-modal/item-access-control-select-bitstreams-modal.component';

@Component({
  selector: 'ds-access-control-form-container',
  templateUrl: './access-control-form-container.component.html',
  styleUrls: ['./access-control-form-container.component.scss'],
  exportAs: 'dsAccessControlForm',
  standalone: true,
  imports: [NgIf, AlertComponent, UiSwitchModule, FormsModule, AccessControlArrayFormComponent, AsyncPipe, TranslateModule],
})
export class AccessControlFormContainerComponent<T extends DSpaceObject> implements OnDestroy {

  /**
   * Will be used to determine if we need to show the limit changes to specific bitstreams radio buttons
   */
  @Input() showLimitToSpecificBitstreams = false;

  /**
   * The title message of the access control form (translate key)
   */
  @Input() titleMessage = '';

  /**
   * The item to which the access control form applies
   */
  @Input() itemRD: RemoteData<T>;

  /**
   * Whether to show the submit and cancel button
   * We want to hide these buttons when the form is
   * used in an accordion, and we want to show buttons somewhere else
   */
  @Input() showSubmit = true;

  @ViewChild('bitstreamAccessCmp', { static: true }) bitstreamAccessCmp: AccessControlArrayFormComponent;
  @ViewChild('itemAccessCmp', { static: true }) itemAccessCmp: AccessControlArrayFormComponent;

  readonly AlertType = AlertType;

  constructor(
    private bulkAccessConfigService: BulkAccessConfigDataService,
    private bulkAccessControlService: BulkAccessControlService,
    public selectableListService: SelectableListService,
    protected modalService: NgbModal,
    private cdr: ChangeDetectorRef,
  ) {}

  state = createAccessControlInitialFormState();

  dropdownData$: Observable<BulkAccessConditionOptions> = this.bulkAccessConfigService.findByName('default').pipe(
    getFirstCompletedRemoteData(),
    map((configRD: RemoteData<BulkAccessConditionOptions>) => configRD.hasSucceeded ? configRD.payload : null),
    shareReplay({ refCount: false, bufferSize: 1 }),
  );

  /**
   * Will be used from a parent component to read the value of the form
   */
  getFormValue() {
    console.log({
      bitstream: this.bitstreamAccessCmp.getValue(),
      item: this.itemAccessCmp.getValue(),
      state: this.state,
    });
    return {
      bitstream: this.bitstreamAccessCmp.getValue(),
      item: this.itemAccessCmp.getValue(),
      state: this.state,
    };
  }

  /**
   * Reset the form to its initial state
   * This will also reset the state of the child components (bitstream and item access)
   */
  reset() {
    this.bitstreamAccessCmp.reset();
    this.itemAccessCmp.reset();
    this.state = createAccessControlInitialFormState();
  }

  /**
   * Submit the form
   * This will create a payload file and execute the script
   */
  submit() {
    const bitstreamAccess = this.bitstreamAccessCmp.getValue();
    const itemAccess = this.itemAccessCmp.getValue();

    const { file } = this.bulkAccessControlService.createPayloadFile({
      bitstreamAccess,
      itemAccess,
      state: this.state,
    });

    this.bulkAccessControlService.executeScript(
      [ this.itemRD.payload.uuid ],
      file,
    ).pipe(take(1)).subscribe((res) => {
      console.log('success', res);
    });
  }

  /**
   * Handle the status change of the access control form (item or bitstream)
   * This will enable/disable the access control form for the item or bitstream
   * @param type The type of the access control form (item or bitstream)
   * @param active boolean indicating whether the access control form should be enabled or disabled
   */
  handleStatusChange(type: 'item' | 'bitstream', active: boolean) {
    if (type === 'bitstream') {
      active ? this.bitstreamAccessCmp.enable() : this.bitstreamAccessCmp.disable();
    } else if (type === 'item') {
      active ? this.itemAccessCmp.enable() : this.itemAccessCmp.disable();
    }
  }

  /**
   * Open the modal to select bitstreams for which to change the access control
   * This will open the modal and pass the currently selected bitstreams
   * @param item The item for which to change the access control
   */
  openSelectBitstreamsModal(item: Item) {
    const ref = this.modalService.open(ItemAccessControlSelectBitstreamsModalComponent);
    ref.componentInstance.selectedBitstreams = this.state.bitstream.selectedBitstreams;
    ref.componentInstance.item = item;

    ref.closed.pipe(
      concatMap(() => this.selectableListService.getSelectableList(ITEM_ACCESS_CONTROL_SELECT_BITSTREAMS_LIST_ID)),
      take(1),
    ).subscribe((list) => {
      this.state.bitstream.selectedBitstreams = list?.selection || [];
      this.cdr.detectChanges();
    });
  }

  ngOnDestroy(): void {
    this.selectableListService.deselectAll(ITEM_ACCESS_CONTROL_SELECT_BITSTREAMS_LIST_ID);
  }

}

