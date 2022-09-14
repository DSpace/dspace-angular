import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Operation } from 'fast-json-patch';
import { RequestService } from '../../core/data/request.service';
import { PatchRequest } from '../../core/data/request.models';
import { PaginationService } from '../../core/pagination/pagination.service';
import { redirectBackWithPaginationOption } from '../handle-table/handle-table-pagination';
import { isNotEmpty } from '../../shared/empty.util';
import { take } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { SUCCESSFUL_RESPONSE_START_CHAR } from '../../core/handle/handle.resource-type';

/**
 * The component for editing the Handle object.
 */
@Component({
  selector: 'ds-edit-handle-page',
  templateUrl: './edit-handle-page.component.html',
  styleUrls: ['./edit-handle-page.component.scss']
})
export class EditHandlePageComponent implements OnInit {

  /**
   * The id of the editing handle received from the URL.
   */
  id: number;

  /**
   * The handle of the editing handle received from the URL.
   */
  handle: string;

  /**
   * The url of the editing handle received from the URL.
   */
  url: string;

  /**
   * The _selflink of the editing handle received from the URL.
   */
  _selflink: string;

  /**
   * The resourceType of the editing handle received from the URL.
   */
  resourceType: string;

  /**
   * The resourceId of the editing handle received from the URL.
   */
  resourceId: string;

  /**
   * The archive checkbox value.
   */
  archive = false;

  /**
   * The currentPage of the editing handle received from the URL.
   */
  currentPage: number;

  constructor(private route: ActivatedRoute,
              public router: Router,
              private cdr: ChangeDetectorRef,
              private paginationService: PaginationService,
              private requestService: RequestService,
              private translateService: TranslateService,
              private notificationsService: NotificationsService) {
  }

  ngOnInit(): void {
    // load handle attributes from the url params
    this.handle = this.route.snapshot.queryParams.handle;
    this.url = this.route.snapshot.queryParams.url;
    this.id = this.route.snapshot.queryParams.id;
    this.resourceType = this.route.snapshot.queryParams.resourceType;
    this.resourceId = this.route.snapshot.queryParams.resourceId;
    this._selflink = this.route.snapshot.queryParams._selflink;
    this.currentPage = this.route.snapshot.queryParams.currentPage;
  }

  /**
   * Send the updated handle values to the server and redirect to the Handle table with actual pagination option.
   * @param value from the inputs form.
   */
  onClickSubmit(value) {
    // edit handle
    // create a Handle object with updated body
    const handleObj = {
      handle: this.handle,
      url: value.url,
      archive: value.archive,
      _links: {
        self: {href: this._selflink}
      }
    };

    // create request with the updated Handle
    const patchOperation = {
      op: 'replace', path: '/updateHandle', value: handleObj
    } as Operation;

    const requestId = this.requestService.generateRequestId();
    const patchRequest = new PatchRequest(requestId, this._selflink, [patchOperation]);
    // call patch request
    this.requestService.send(patchRequest);

    // check response
    this.requestService.getByUUID(requestId)
      .subscribe(info => {
        // if is empty
        if (!isNotEmpty(info) || !isNotEmpty(info.response) || !isNotEmpty(info.response.statusCode)) {
          // do nothing - in another subscription should be data
          return;
        }

        // If the response doesn't start with `2**` it will throw error notification.
        if (info.response.statusCode.toString().startsWith(SUCCESSFUL_RESPONSE_START_CHAR)) {
          this.notificationsService.success(null, this.translateService.get('handle-table.edit-handle.notify.successful'));
          // for redirection use the paginationService because it redirects with pagination options
          redirectBackWithPaginationOption(this.paginationService, this.currentPage);
        } else {
          // write error in the notification
          // compose error message with message definition and server error
          let errorMessage = '';
          this.translateService.get('handle-table.edit-handle.notify.error').pipe(
            take(1)
          ).subscribe( message => {
            errorMessage = message + ': ' + info.response.errorMessage;
          });
          this.notificationsService.error(null, errorMessage);
        }
      });
  }
}
