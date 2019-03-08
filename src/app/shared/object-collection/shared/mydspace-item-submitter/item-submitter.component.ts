import { Component, Input, OnInit } from '@angular/core';

import { Observable } from 'rxjs';
import { filter, find, flatMap, map } from 'rxjs/operators';

import { EPerson } from '../../../../core/eperson/models/eperson.model';
import { RemoteData } from '../../../../core/data/remote-data';
import { isNotEmpty, isNotUndefined } from '../../../empty.util';
import { Workflowitem } from '../../../../core/submission/models/workflowitem.model';

@Component({
  selector: 'ds-item-submitter',
  styleUrls: ['./item-submitter.component.scss'],
  templateUrl: './item-submitter.component.html'
})

export class ItemSubmitterComponent implements OnInit {
  @Input() object: any;

  submitter: Observable<EPerson>;

  ngOnInit() {
    this.submitter = (this.object.workflowitem as Observable<RemoteData<Workflowitem>>).pipe(
      filter((rd: RemoteData<Workflowitem>) => (rd.hasSucceeded && isNotUndefined(rd.payload))),
      flatMap((rd: RemoteData<Workflowitem>) => rd.payload.submitter as Observable<RemoteData<EPerson>>),
      find((rd: RemoteData<EPerson>) => rd.hasSucceeded && isNotEmpty(rd.payload)),
      map((rd: RemoteData<EPerson>) => rd.payload));
  }
}
