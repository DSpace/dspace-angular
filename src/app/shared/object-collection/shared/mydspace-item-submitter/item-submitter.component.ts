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

import { DSONameService } from '../../../../../../modules/core/src/lib/core/breadcrumbs/dso-name.service';
import { LinkService } from '../../../../../../modules/core/src/lib/core/cache/builders/link.service';
import { followLink } from '../../../../../../modules/core/src/lib/core/data/follow-link-config.model';
import { RemoteData } from '../../../../../../modules/core/src/lib/core/data/remote-data';
import { EPerson } from '../../../../../../modules/core/src/lib/core/eperson/models/eperson.model';
import { getFirstCompletedRemoteData } from '../../../../../../modules/core/src/lib/core/shared/operators';
import { WorkflowItem } from '../../../../../../modules/core/src/lib/core/submission/models/workflowitem.model';

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
