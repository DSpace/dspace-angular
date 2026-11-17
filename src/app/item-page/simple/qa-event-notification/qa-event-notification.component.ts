import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '@dspace/core/auth/auth.service';
import { RequestParam } from '@dspace/core/cache/models/request-param.model';
import { AuthorizationDataService } from '@dspace/core/data/feature-authorization/authorization-data.service';
import { FeatureID } from '@dspace/core/data/feature-authorization/feature-id';
import { FindListOptions } from '@dspace/core/data/find-list-options.model';
import { PaginatedList } from '@dspace/core/data/paginated-list.model';
import { RemoteData } from '@dspace/core/data/remote-data';
import { QualityAssuranceSourceObject } from '@dspace/core/notifications/qa/models/quality-assurance-source.model';
import { QualityAssuranceSourceDataService } from '@dspace/core/notifications/qa/source/quality-assurance-source-data.service';
import { Item } from '@dspace/core/shared/item.model';
import { getFirstCompletedRemoteData } from '@dspace/core/shared/operators';
import { TranslateModule } from '@ngx-translate/core';
import {
  Observable,
  of,
} from 'rxjs';
import {
  catchError,
  map,
  switchMap,
} from 'rxjs/operators';

import { getNotificatioQualityAssuranceRoute } from '../../../admin/admin-routing-paths';
import { SplitPipe } from '../../../shared/utils/split.pipe';

@Component({
  selector: 'ds-qa-event-notification',
  templateUrl: './qa-event-notification.component.html',
  styleUrls: ['./qa-event-notification.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [QualityAssuranceSourceDataService],
  imports: [
    AsyncPipe,
    RouterLink,
    SplitPipe,
    TranslateModule,
  ],
})
/**
 * Component for displaying quality assurance event notifications for an item.
 */
export class QaEventNotificationComponent implements OnChanges {
  /**
   * The item to display quality assurance event notifications for.
   */
  @Input() item: Item;

  /**
   * An observable that emits an array of QualityAssuranceSourceObject.
   */
  sources$: Observable<QualityAssuranceSourceObject[]>;

  constructor(
    private qualityAssuranceSourceDataService: QualityAssuranceSourceDataService,
    private authorizationService: AuthorizationDataService,
    private authService: AuthService,
  ) {}

  /**
    * Detect changes to the item input and update the sources$ observable.
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.item && changes.item.currentValue.uuid !== changes.item.previousValue?.uuid) {
      this.sources$ = this.getQualityAssuranceSources$();
    }
  }
  /**
   * Returns an Observable of QualityAssuranceSourceObject[] for the current item.
   * @returns An Observable of QualityAssuranceSourceObject[] for the current item.
   * Note: sourceId is composed as: id: "sourceName:<target>"
   *
   * The sources endpoint requires an authenticated user, and the {@link FeatureID.CanSeeQA} feature only tells
   * whether QA is enabled on the server. So both are checked before sending the request, to avoid a
   * 401 response for anonymous users and a useless request when QA is disabled.
   */
  getQualityAssuranceSources$(): Observable<QualityAssuranceSourceObject[]> {
    return this.authService.isAuthenticated().pipe(
      switchMap((isAuthenticated: boolean) => isAuthenticated ? this.authorizationService.isAuthorized(FeatureID.CanSeeQA) : of(false)),
      switchMap((canSeeQA: boolean) => {
        if (!canSeeQA) {
          return of([]);
        }
        const findListTopicOptions: FindListOptions = {
          searchParams: [new RequestParam('target', this.item.uuid)],
        };
        return this.qualityAssuranceSourceDataService.getSourcesByTarget(findListTopicOptions, false)
          .pipe(
            getFirstCompletedRemoteData(),
            map((data: RemoteData<PaginatedList<QualityAssuranceSourceObject>>) => {
              if (data.hasSucceeded) {
                return data.payload.page;
              }
              return [];
            }),
            catchError(() => of([])),
          );
      }),
    );
  }

  /**
   * Returns the quality assurance route.
   * @returns The quality assurance route.
   */
  getQualityAssuranceRoute(): string {
    return getNotificatioQualityAssuranceRoute();
  }
}
