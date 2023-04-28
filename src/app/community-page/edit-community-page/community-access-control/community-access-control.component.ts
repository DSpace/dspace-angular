import { Component, OnInit, ViewChild } from '@angular/core';
import { CommunityAccessControlService } from './community-access-control.service';
import { shareReplay } from 'rxjs';
import {
  AccessControlArrayFormComponent
} from '../../../shared/access-control-array-form/access-control-array-form.component';

@Component({
  selector: 'ds-community-access-control',
  templateUrl: './community-access-control.component.html',
  styleUrls: ['./community-access-control.component.scss'],
  providers: [CommunityAccessControlService]
})
export class CommunityAccessControlComponent implements OnInit {

  @ViewChild('bitstreamAccessCmp', { static: true }) bitstreamAccessCmp: AccessControlArrayFormComponent;
  @ViewChild('itemAccessCmp', { static: true }) itemAccessCmp: AccessControlArrayFormComponent;

  constructor(private communityAccessControlService: CommunityAccessControlService) {}

  state = initialState;

  dropdownData$ = this.communityAccessControlService.dropdownData$.pipe(
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
