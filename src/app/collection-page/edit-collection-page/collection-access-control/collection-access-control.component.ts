import { Component, OnInit, ViewChild } from '@angular/core';
import { shareReplay } from 'rxjs';
import {
  AccessControlArrayFormComponent
} from '../../../shared/access-control-array-form/access-control-array-form.component';
import { CollectionAccessControlService } from './collection-access-control.service';

@Component({
  selector: 'ds-collection-access-control',
  templateUrl: './collection-access-control.component.html',
  styleUrls: ['./collection-access-control.component.scss'],
  providers: [CollectionAccessControlService]
})
export class CollectionAccessControlComponent  implements OnInit {

  @ViewChild('bitstreamAccessCmp', { static: true }) bitstreamAccessCmp: AccessControlArrayFormComponent;
  @ViewChild('itemAccessCmp', { static: true }) itemAccessCmp: AccessControlArrayFormComponent;

  constructor(private collectionAccessControlService: CollectionAccessControlService) {}

  state = initialState;

  dropdownData$ = this.collectionAccessControlService.dropdownData$.pipe(
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

    console.log('bitstreamAccess', bitstreamAccess);
    console.log('itemAccess', itemAccess);
  }

  handleStatusChange(type: 'item' | 'bitstream', active: boolean) {
    if (type === 'bitstream') {
      active ? this.bitstreamAccessCmp.enable() : this.bitstreamAccessCmp.disable();
    } else if (type === 'item') {
      active ? this.itemAccessCmp.enable() : this.itemAccessCmp.disable();
    }
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
  },
};
