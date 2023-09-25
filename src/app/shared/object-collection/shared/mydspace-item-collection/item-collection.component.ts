import { Component, Input, OnInit } from '@angular/core';

import { EMPTY, Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { RemoteData } from '../../../../core/data/remote-data';
import { isNotEmpty } from '../../../empty.util';
import { WorkflowItem } from '../../../../core/submission/models/workflowitem.model';
import { Collection } from '../../../../core/shared/collection.model';
import { getFirstCompletedRemoteData } from '../../../../core/shared/operators';
import { LinkService } from '../../../../core/cache/builders/link.service';
import { followLink } from '../../../utils/follow-link-config.model';
import { DSONameService } from '../../../../core/breadcrumbs/dso-name.service';
import { TranslateModule } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';
import { NgIf, AsyncPipe } from '@angular/common';

/**
 * This component represents a badge with collection information.
 */
@Component({
    selector: 'ds-item-collection',
    styleUrls: ['./item-collection.component.scss'],
    templateUrl: './item-collection.component.html',
    standalone: true,
    imports: [NgIf, RouterLink, AsyncPipe, TranslateModule]
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
      isOptional: true
    },
      followLink('collection',{})
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
            })
          );
        } else {
          return EMPTY;
        }
      }));
  }
}
