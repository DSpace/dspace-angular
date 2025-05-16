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
  differenceInDays,
  differenceInMilliseconds,
  parseISO,
} from 'date-fns';
import {
  BehaviorSubject,
  Observable,
  switchMap,
} from 'rxjs';
import {
  map,
  take,
} from 'rxjs/operators';

import { AuthorizationDataService } from '../../../../core/data/feature-authorization/authorization-data.service';
import { FeatureID } from '../../../../core/data/feature-authorization/feature-id';
import { ItemDataService } from '../../../../core/data/item-data.service';
import { Item } from '../../../../core/shared/item.model';
import { getFirstCompletedRemoteData } from '../../../../core/shared/operators';
import { hasValue } from '../../../empty.util';

@Component({
  selector: 'ds-in-workflow-statistics',
  templateUrl: './in-workflow-statistics.component.html',
  standalone: true,
  styleUrls: ['./in-workflow-statistics.component.scss'],
  imports: [
    TranslateModule,
    AsyncPipe,
    NgIf,
  ],
})
export class InWorkflowStatisticsComponent implements OnInit {

  @Input() item: Item;

  canViewInWorkflowSinceStatistics$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  canViewInWorkflowForDate$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  canViewInWorkflowSinceDate$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  inWorkflowFor$: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  inWorkflowSince$: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  constructor(
    private authorizationService: AuthorizationDataService,
    private itemDataService: ItemDataService,
  ) {
  }

  ngOnInit(): void {
    this.canViewInWorkflowSinceStatistics().pipe(take(1))
      .subscribe((result: boolean) => {
        if (result) {
          this.initWorkflowDates();
        }
        this.canViewInWorkflowSinceStatistics$.next(result);
      });
  }

  public canViewInWorkflowSinceStatistics(): Observable<boolean> {
    if (hasValue(this.item?.self)) {
      return this.isUserAuthorizedToViewItemInWorkflow(this.item.self);
    } else {
      // If self link has no value we fetch again the item from the rest.
      // Since at this stage the item has most likely already been fetched we will get it from the cache
      return this.itemDataService.findById(this.item.id).pipe(
        getFirstCompletedRemoteData(),
        map(data => data.payload.self),
        switchMap(selfLink => this.isUserAuthorizedToViewItemInWorkflow(selfLink)),
      );
    }
  }

  public getDateForArchivedItem(itemStartDate: string, dateAccessioned: string) {
    const itemStartDateConverted: Date = parseISO(itemStartDate);
    const dateAccessionedConverted: Date = parseISO(dateAccessioned);
    const days: number = Math.max(0, Math.floor(differenceInDays(dateAccessionedConverted, itemStartDateConverted)));
    const remainingMilliseconds: number = differenceInMilliseconds(dateAccessionedConverted, itemStartDateConverted) - days * 24 * 60 * 60 * 1000;
    const hours: number = Math.max(0, Math.floor(remainingMilliseconds / (60 * 60 * 1000)));
    return `${days} d ${hours} h`;
  }

  public getDateForItem(itemStartDate: string) {
    const itemStartDateConverted: Date = parseISO(itemStartDate);
    const days: number = Math.max(0, Math.floor(differenceInDays(Date.now(), itemStartDateConverted)));
    const remainingMilliseconds: number = differenceInMilliseconds(Date.now(), itemStartDateConverted) - days * 24 * 60 * 60 * 1000;
    const hours: number = Math.max(0, Math.floor(remainingMilliseconds / (60 * 60 * 1000)));
    return `${days} d ${hours} h`;
  }

  initWorkflowDates(): void {
    if (this.item) {
      if (this.item.isArchived) {
        if (this.item.hasMetadata('dspace.workflow.startDateTime') && this.item.hasMetadata('dc.date.accessioned')) {
          this.canViewInWorkflowForDate$.next(true);
          this.inWorkflowFor$.next(
            this.getDateForArchivedItem(this.item.firstMetadataValue('dspace.workflow.startDateTime'), this.item.firstMetadataValue('dc.date.accessioned')),
          );
        }
      } else if (this.item.hasMetadata('dspace.workflow.startDateTime')) {
        this.canViewInWorkflowSinceDate$.next(true);
        this.inWorkflowSince$.next(
          this.getDateForItem(this.item.firstMetadataValue('dspace.workflow.startDateTime')),
        );
      }
    }
  }

  private isUserAuthorizedToViewItemInWorkflow(selfLink: string): Observable<boolean> {
    return this.authorizationService.isAuthorized(FeatureID.CanViewInWorkflowSinceStatistics, selfLink);
  }
}
