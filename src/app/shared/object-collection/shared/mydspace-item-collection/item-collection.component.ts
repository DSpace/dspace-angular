import { AsyncPipe } from '@angular/common';
import {
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { DSONameService } from '@dspace/core/breadcrumbs/dso-name.service';
import { LinkService } from '@dspace/core/cache/builders/link.service';
import { RemoteData } from '@dspace/core/data/remote-data';
import { Collection } from '@dspace/core/shared/collection.model';
import { followLink } from '@dspace/core/shared/follow-link-config.model';
import { getFirstCompletedRemoteData } from '@dspace/core/shared/operators';
import { WorkflowItem } from '@dspace/core/submission/models/workflowitem.model';
import { isNotEmpty } from '@dspace/shared/utils/empty.util';
import { TranslateModule } from '@ngx-translate/core';
import {
  EMPTY,
  Observable,
} from 'rxjs';
import {
  map,
  mergeMap,
} from 'rxjs/operators';

/**
 * This component represents a badge with collection information.
 */
@Component({
  selector: 'ds-item-collection',
  styleUrls: ['./item-collection.component.scss'],
  templateUrl: './item-collection.component.html',
  standalone: true,
  imports: [
    AsyncPipe,
    RouterLink,
    TranslateModule,
  ],
})
export class ItemCollectionComponent implements OnInit {

  /**
   * The target object
   */
  @Input() object: any;

  /**
   * The collection object
   */
  collection$: Observable<Collection>;

  public constructor(
    protected linkService: LinkService,
    public dsoNameService: DSONameService,
  ) {
  }

  /**
   * Initialize collection object
   */
  ngOnInit() {

    this.linkService.resolveLinks(this.object, followLink('workflowitem', {
      isOptional: true,
    },
    followLink('collection',{}),
    ));
    this.collection$ = (this.object.workflowitem as Observable<RemoteData<WorkflowItem>>).pipe(
      getFirstCompletedRemoteData(),
      mergeMap((rd: RemoteData<WorkflowItem>) => {
        if (rd.hasSucceeded && isNotEmpty(rd.payload)) {
          return (rd.payload.collection as Observable<RemoteData<Collection>>).pipe(
            getFirstCompletedRemoteData(),
            map((rds: RemoteData<Collection>) => {
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
