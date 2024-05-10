import {
  AsyncPipe,
  NgIf,
} from '@angular/common';
import {
  Component,
  Input,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import {
  combineLatest,
  map,
  Observable,
} from 'rxjs';
import { getFirstCompletedRemoteData } from 'src/app/core/shared/operators';

import { AuthorizationDataService } from '../../core/data/feature-authorization/authorization-data.service';
import { FeatureID } from '../../core/data/feature-authorization/feature-id';
import { PaginatedList } from '../../core/data/paginated-list.model';
import { RemoteData } from '../../core/data/remote-data';
import { Item } from '../../core/shared/item.model';
import { CorrectionTypeDataService } from '../../core/submission/correctiontype-data.service';
import { CorrectionType } from '../../core/submission/models/correctiontype.model';
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
    NgIf,
    TranslateModule,
    RouterLink,
    AsyncPipe,
  ],
  standalone: true,
})
/**
 * Component displaying alerts for an item
 */
export class ItemAlertsComponent {
  /**
   * The Item to display alerts for
   */
  @Input() item: Item;

  /**
   * The AlertType enumeration
   * @type {AlertType}
   */
  public AlertTypeEnum = AlertType;

  constructor(
    private authService: AuthorizationDataService,
    private dsoWithdrawnReinstateModalService: DsoWithdrawnReinstateModalService,
    private correctionTypeDataService: CorrectionTypeDataService,
  ) {
  }

  /**
   * Determines whether to show the reinstate button.
   * The button is shown if the user is not an admin and the item has a reinstate request.
   * @returns An Observable that emits a boolean value indicating whether to show the reinstate button.
   */
  showReinstateButton$(): Observable<boolean>  {
    const correction$ = this.correctionTypeDataService.findByItem(this.item.uuid, true).pipe(
      getFirstCompletedRemoteData(),
      map((correctionTypeRD: RemoteData<PaginatedList<CorrectionType>>) => correctionTypeRD.hasSucceeded ? correctionTypeRD.payload.page : []),
    );
    const isAdmin$ = this.authService.isAuthorized(FeatureID.AdministratorOf);
    return combineLatest([isAdmin$, correction$]).pipe(
      map(([isAdmin, correction]) => {
        return !isAdmin && correction.some((correctionType) => correctionType.topic === REQUEST_REINSTATE);
      },
      ));
  }

  /**
   * Opens the reinstate modal for the item.
   */
  openReinstateModal() {
    this.dsoWithdrawnReinstateModalService.openCreateWithdrawnReinstateModal(this.item, 'request-reinstate', this.item.isArchived);
  }
}
