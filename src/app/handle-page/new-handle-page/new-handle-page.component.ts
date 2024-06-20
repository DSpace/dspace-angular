import { Component, OnInit } from '@angular/core';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { TranslateService } from '@ngx-translate/core';
import { redirectBackWithPaginationOption } from '../handle-table/handle-table-pagination';
import { PaginationService } from '../../core/pagination/pagination.service';
import { ActivatedRoute } from '@angular/router';
import {HandleDataService} from '../../core/data/handle-data.service';
import {getFirstCompletedRemoteData} from '../../core/shared/operators';
import {Handle} from '../../core/handle/handle.model';
import {RemoteData} from '../../core/data/remote-data';
import {isNull} from '../../shared/empty.util';

/**
 * The component where is creating the new external handle.
 */
@Component({
  selector: 'ds-new-handle-page',
  templateUrl: './new-handle-page.component.html',
  styleUrls: ['./new-handle-page.component.scss']
})
export class NewHandlePageComponent implements OnInit {

  /**
   * The handle input value from the form.
   */
  handle: string;

  /**
   * The url input value from the form.
   */
  url: string;

  /**
   * The current page pagination option to redirect back with the same pagination.
   */
  currentPage: number;

  constructor(
    private notificationService: NotificationsService,
    private route: ActivatedRoute,
    private translateService: TranslateService,
    private handleService: HandleDataService,
    private paginationService: PaginationService
  ) { }

  ngOnInit(): void {
    this.currentPage = this.route.snapshot.queryParams.currentPage;
  }

  /**
   * Send the request with the new external handle object.
   * @param value from the inputs form
   */
  onClickSubmit(value) {
    this.handleService.create(value)
      .pipe(getFirstCompletedRemoteData())
      .subscribe( (handleResponse: RemoteData<Handle>) => {
        const errContent = 'handle-table.new-handle.notify.error';
        const sucContent = 'handle-table.new-handle.notify.successful';
        if (isNull(handleResponse)) {
          this.notificationService.error('', this.translateService.get(errContent));
          return;
        }

        if (handleResponse.hasSucceeded) {
          this.notificationService.success('',
            this.translateService.get(sucContent));
        } else if (handleResponse.isError) {
          this.notificationService.error('',
            this.translateService.get(errContent));
        }
      });
    redirectBackWithPaginationOption(this.paginationService, this.currentPage);
  }
}
