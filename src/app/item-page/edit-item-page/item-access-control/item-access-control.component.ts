import { Component, OnInit, ViewChild } from '@angular/core';
import {
  AccessControlArrayFormComponent
} from '../../../shared/access-control-array-form/access-control-array-form.component';
import {
  CollectionAccessControlService
} from '../../../collection-page/edit-collection-page/collection-access-control/collection-access-control.service';
import { shareReplay } from 'rxjs';
import { ItemAccessControlService } from './item-access-control.service';

@Component({
  selector: 'ds-item-access-control',
  templateUrl: './item-access-control.component.html',
  styleUrls: ['./item-access-control.component.scss'],
  providers: [ItemAccessControlService]
})
export class ItemAccessControlComponent implements OnInit {

  @ViewChild('bitstreamAccessCmp', { static: true }) bitstreamAccessCmp: AccessControlArrayFormComponent;
  @ViewChild('itemAccessCmp', { static: true }) itemAccessCmp: AccessControlArrayFormComponent;

  constructor(private itemAccessControlService: ItemAccessControlService) {}

  state = initialState;

  dropdownData$ = this.itemAccessControlService.dropdownData$.pipe(
    shareReplay(1)
  );

  ngOnInit(): void {

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
    selectedBitstreams: []
  },
};
