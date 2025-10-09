import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  type OnInit,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { TruncatableComponent } from '../../../../shared/truncatable/truncatable.component';
import { TruncatablePartComponent } from '../../../../shared/truncatable/truncatable-part/truncatable-part.component';
import { NotifyStatuses } from '../notify-requests-status.model';
import { RequestStatusEnum } from '../notify-status.enum';

@Component({
  selector: 'ds-request-status-alert-box',
  templateUrl: './request-status-alert-box.component.html',
  styleUrls: ['./request-status-alert-box.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgClass,
    TranslateModule,
    TruncatableComponent,
    TruncatablePartComponent,
  ],
})
/**
 * Represents a component that displays the status of a request.
 */
export class RequestStatusAlertBoxComponent implements OnInit {
  /**
   * The status of the request.
   */
  @Input() status: RequestStatusEnum;

  /**
   * The input data for the request status alert box component.
   * @type {NotifyStatuses[]}
   */
  @Input() data: NotifyStatuses[] = [];

  /**
   * The display options for the request status alert box.
   */
  displayOptions: NotifyRequestDisplayOptions;

  ngOnInit(): void {
    this.prepareDataToDisplay();
  }

  /**
   * Prepares the data to be displayed based on the current status.
   */
  private prepareDataToDisplay() {
    switch (this.status) {
      case RequestStatusEnum.ACCEPTED:
        this.displayOptions = {
          alertType: 'alert-info',
          text: 'request-status-alert-box.accepted',
        };
        break;

      case RequestStatusEnum.REJECTED:
        this.displayOptions = {
          alertType: 'alert-danger',
          text: 'request-status-alert-box.rejected',
        };
        break;

      case RequestStatusEnum.TENTATIVE_REJECT:
        this.displayOptions = {
          alertType: 'alert-warning',
          text: 'request-status-alert-box.tentative_rejected',
        };
        break;

      case RequestStatusEnum.REQUESTED:
        this.displayOptions = {
          alertType: 'alert-warning',
          text: 'request-status-alert-box.requested',
        };
        break;
    }
  }
}

/**
 * Represents the display options for a notification request.
 */
export interface NotifyRequestDisplayOptions {
  /**
   * The type of alert to display.
   * Possible values are 'alert-danger', 'alert-warning', or 'alert-info'.
   */
  alertType: 'alert-danger' | 'alert-warning' | 'alert-info';
  /**
   * The text to display in the notification.
   */
  text: string;
}
