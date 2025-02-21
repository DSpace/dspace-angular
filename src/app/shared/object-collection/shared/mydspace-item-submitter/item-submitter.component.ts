import { AsyncPipe } from '@angular/common';
import {
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { isNotEmpty } from '@dspace/shared/utils';
import { TranslateModule } from '@ngx-translate/core';
import {
  EMPTY,
  Observable,
} from 'rxjs';
import {
  map,
  mergeMap,
} from 'rxjs/operators';

import { DSONameService } from '@dspace/core';
import { LinkService } from '@dspace/core';
import { followLink } from '@dspace/core';
import { RemoteData } from '@dspace/core';
import { EPerson } from '@dspace/core';
import { getFirstCompletedRemoteData } from '@dspace/core';
import { WorkflowItem } from '@dspace/core';

/**
 * This component represents a badge with submitter information.
 */
@Component({
  selector: 'ds-item-submitter',
  styleUrls: ['./item-submitter.component.scss'],
  templateUrl: './item-submitter.component.html',
  standalone: true,
  imports: [AsyncPipe, TranslateModule],
})
export class ItemSubmitterComponent implements OnInit {

  /**
   * The target object
   */
  @Input() object: any;

  /**
   * The submitter object
   */
  submitter$: Observable<EPerson>;

  public constructor(
    public dsoNameService: DSONameService,
    protected linkService: LinkService,
  ) {
  }

  /**
   * Initialize submitter object
   */
  ngOnInit() {
    this.linkService.resolveLinks(this.object, followLink('workflowitem', {},
      followLink('submitter',{}),
    ));
    this.submitter$ = (this.object.workflowitem as Observable<RemoteData<WorkflowItem>>).pipe(
      getFirstCompletedRemoteData(),
      mergeMap((rd: RemoteData<WorkflowItem>) => {
        if (rd.hasSucceeded && isNotEmpty(rd.payload)) {
          return (rd.payload.submitter as Observable<RemoteData<EPerson>>).pipe(
            getFirstCompletedRemoteData(),
            map((rds: RemoteData<EPerson>) => {
              if (rds.hasSucceeded && isNotEmpty(rds.payload)) {
                return rds.payload;
              } else {
                return null;
              }
            }),
          );
        } else {
          return EMPTY;
        }
      }));
  }
}
