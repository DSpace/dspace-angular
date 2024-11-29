import {
  AsyncPipe,
  NgIf,
} from '@angular/common';
import {
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import {
  EMPTY,
  Observable,
} from 'rxjs';
import {
  map,
  mergeMap,
} from 'rxjs/operators';

import { DSONameService } from '../../../../core/breadcrumbs/dso-name.service';
import { LinkService } from '../../../../core/cache/builders/link.service';
import { RemoteData } from '../../../../core/data/remote-data';
import { EPerson } from '../../../../core/eperson/models/eperson.model';
import { getFirstCompletedRemoteData } from '../../../../core/shared/operators';
import { WorkflowItem } from '../../../../core/submission/models/workflowitem.model';
import { isNotEmpty } from '../../../empty.util';
import { followLink } from '../../../utils/follow-link-config.model';

/**
 * This component represents a badge with submitter information.
 */
@Component({
  selector: 'ds-item-submitter',
  styleUrls: ['./item-submitter.component.scss'],
  templateUrl: './item-submitter.component.html',
  standalone: true,
  imports: [NgIf, AsyncPipe, TranslateModule],
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
