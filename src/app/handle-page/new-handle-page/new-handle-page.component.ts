import { Component, OnInit } from '@angular/core';
import { CreateRequest } from '../../core/data/request.models';
import { RequestService } from '../../core/data/request.service';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { TranslateService } from '@ngx-translate/core';
import { take } from 'rxjs/operators';
import { redirectBackWithPaginationOption } from '../handle-table/handle-table-pagination';
import { PaginationService } from '../../core/pagination/pagination.service';
import { ActivatedRoute } from '@angular/router';
import { SUCCESSFUL_RESPONSE_START_CHAR } from '../../core/handle/handle.resource-type';

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
    private notificationsService: NotificationsService,
    private route: ActivatedRoute,
    private requestService: RequestService,
    private paginationService: PaginationService,
    private translateService: TranslateService
  ) { }

  ngOnInit(): void {
    this.currentPage = this.route.snapshot.queryParams.currentPage;
  }

  /**
   * Send the request with the new external handle object.
   * @param value from the inputs form
   */
  onClickSubmit(value) {
    // prepare request
    const requestId = this.requestService.generateRequestId();
    const createRequest = new CreateRequest(requestId,'http://localhost:8080/server/api/core/handles', value);

    // call createRequest request
    this.requestService.send(createRequest);

    // check response
    this.requestService.getByUUID(requestId)
      .subscribe(info => {
        if (info?.response?.statusCode?.toString().startsWith(SUCCESSFUL_RESPONSE_START_CHAR)) {
          this.notificationsService.success(null, this.translateService.get('handle-table.new-handle.notify.successful'));
          redirectBackWithPaginationOption(this.paginationService, this.currentPage);
        } else {
          // write error in the notification
          // compose error message with message definition and server error
          let errorMessage = '';
          this.translateService.get('handle-table.new-handle.notify.error').pipe(
            take(1)
          ).subscribe( message => {
            errorMessage = message + ': ' + info?.response?.errorMessage;
          });

          this.notificationsService.error(null, errorMessage);
        }
    });
  }
}
