import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { Eperson } from '../../../../core/eperson/models/eperson.model';
import { RemoteData } from '../../../../core/data/remote-data';
import { hasNoUndefinedValue, isNotEmpty } from '../../../empty.util';
import { Workflowitem } from '../../../../core/submission/models/workflowitem.model';

@Component({
  selector: 'ds-item-submitter',
  styleUrls: ['./item-submitter.component.scss'],
  templateUrl: './item-submitter.component.html'
})

export class ItemSubmitterComponent implements OnInit {
  @Input() object: any;

  submitter: Observable<Eperson>;

  ngOnInit() {
    this.submitter = (this.object.workflowitem as Observable<RemoteData<Workflowitem[]>>)
      .filter((rd: RemoteData<Workflowitem[]>) => ((!rd.isRequestPending) && hasNoUndefinedValue(rd.payload)))
      .map((rd: RemoteData<Workflowitem[]>) => (rd.payload[0] as Workflowitem))
      .map((workflowitem: Workflowitem) => workflowitem.submitter as Observable<RemoteData<Eperson[]>>)
      .flatMap((rd: Observable<RemoteData<Eperson[]>>) => rd)
      .filter((rd: RemoteData<Eperson[]>) => rd.hasSucceeded && isNotEmpty(rd.payload))
      .take(1)
      .map((rd: RemoteData<Eperson[]>) => rd.payload[0]);
  }
}
