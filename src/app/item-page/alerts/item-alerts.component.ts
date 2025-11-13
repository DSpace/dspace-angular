import { AsyncPipe } from '@angular/common';
import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthorizationDataService } from '@dspace/core/data/feature-authorization/authorization-data.service';
import { FeatureID } from '@dspace/core/data/feature-authorization/feature-id';
import { PaginatedList } from '@dspace/core/data/paginated-list.model';
import { RemoteData } from '@dspace/core/data/remote-data';
import { Item } from '@dspace/core/shared/item.model';
import { getFirstCompletedRemoteData } from '@dspace/core/shared/operators';
import { CorrectionTypeDataService } from '@dspace/core/submission/correctiontype-data.service';
import { CorrectionType } from '@dspace/core/submission/models/correctiontype.model';
import { TranslateModule } from '@ngx-translate/core';
import {
  combineLatest,
  map,
  Observable,
} from 'rxjs';

import { AlertComponent } from '../../shared/alert/alert.component';
import { AlertType } from '../../shared/alert/alert-type';
import {
  DsoWithdrawnReinstateModalService,
  REQUEST_REINSTATE,
} from '../../shared/dso-page/dso-withdrawn-reinstate-service/dso-withdrawn-reinstate-modal.service';

@Component({
  selector: 'ds-base-item-alerts',
  templateUrl: './item-alerts.component.html',
  styleUrls: ['./item-alerts.component.scss'],
  imports: [
    AlertComponent,
    AsyncPipe,
    RouterLink,
    TranslateModule,
  ],
  standalone: true,
})
/**
 * Component displaying alerts for an item
 */
export class ItemAlertsComponent implements OnChanges {
  /**
   * The Item to display alerts for
   */
  @Input() item: Item;

  /**
   * Whether the reinstate button should be shown
   */
  showReinstateButton$: Observable<boolean>;

  /**
   * The AlertType enumeration
   * @type {AlertType}
   */
  public AlertTypeEnum = AlertType;

  constructor(
    protected authService: AuthorizationDataService,
    protected dsoWithdrawnReinstateModalService: DsoWithdrawnReinstateModalService,
    protected correctionTypeDataService: CorrectionTypeDataService,
  ) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.item?.currentValue.withdrawn && this.showReinstateButton$) {
      this.showReinstateButton$ = this.shouldShowReinstateButton();
    }
  }

  /**
   * Determines whether to show the reinstate button.
   * The button is shown if the user is not an admin and the item has a reinstate request.
   * @returns An Observable that emits a boolean value indicating whether to show the reinstate button.
   */
  shouldShowReinstateButton(): Observable<boolean>  {
    const correction$ = this.correctionTypeDataService.findByItem(this.item.uuid, true).pipe(
      getFirstCompletedRemoteData(),
      map((correctionTypeRD: RemoteData<PaginatedList<CorrectionType>>) => correctionTypeRD.hasSucceeded ? correctionTypeRD.payload.page : []),
    );
    const isAdmin$ = this.authService.isAuthorized(FeatureID.AdministratorOf);
    return combineLatest([isAdmin$, correction$]).pipe(
      map(([isAdmin, correction]) => {
        return !isAdmin && correction.some((correctionType) => correctionType.topic === REQUEST_REINSTATE);
      }),
    );
  }

  /**
   * Opens the reinstate modal for the item.
   */
  openReinstateModal() {
    this.dsoWithdrawnReinstateModalService.openCreateWithdrawnReinstateModal(this.item, 'request-reinstate', this.item.isArchived);
  }
}
