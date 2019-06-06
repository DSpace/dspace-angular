import { ChangeDetectorRef, Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';

import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';

import { SubmissionState } from '../../submission/submission.reducers';
import { AuthService } from '../../core/auth/auth.service';
import { MyDSpaceResult } from '../my-dspace-result.model';
import { DSpaceObject } from '../../core/shared/dspace-object.model';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { NotificationOptions } from '../../shared/notifications/models/notification-options.model';
import { UploaderOptions } from '../../shared/uploader/uploader-options.model';
import { HALEndpointService } from '../../core/shared/hal-endpoint.service';
import { NotificationType } from '../../shared/notifications/models/notification-type';
import { hasValue } from '../../shared/empty.util';

/**
 * This component represents the whole mydspace page header
 */
@Component({
  selector: 'ds-my-dspace-new-submission',
  styleUrls: ['./my-dspace-new-submission.component.scss'],
  templateUrl: './my-dspace-new-submission.component.html'
})
export class MyDSpaceNewSubmissionComponent implements OnDestroy, OnInit {
  @Output() uploadEnd = new EventEmitter<Array<MyDSpaceResult<DSpaceObject>>>();

  /**
   * The UploaderOptions object
   */
  public uploadFilesOptions: UploaderOptions = {
    url: '',
    authToken: null,
    disableMultipart: false,
    itemAlias: null
  };

  /**
   * Subscription to unsubscribe from
   */
  private sub: Subscription;

  /**
   * Initialize instance variables
   *
   * @param {AuthService} authService
   * @param {ChangeDetectorRef} changeDetectorRef
   * @param {HALEndpointService} halService
   * @param {NotificationsService} notificationsService
   * @param {Store<SubmissionState>} store
   * @param {TranslateService} translate
   */
  constructor(private authService: AuthService,
              private changeDetectorRef: ChangeDetectorRef,
              private halService: HALEndpointService,
              private notificationsService: NotificationsService,
              private store: Store<SubmissionState>,
              private translate: TranslateService) {
  }

  /**
   * Initialize url and Bearer token
   */
  ngOnInit() {
    this.sub = this.halService.getEndpoint('workspaceitems').pipe(first()).subscribe((url) => {
        this.uploadFilesOptions.url = url;
        this.uploadFilesOptions.authToken = this.authService.buildAuthHeader();
        this.changeDetectorRef.detectChanges();
      }
    );
  }

  /**
   * Method called when file upload is completed to notify upload status
   */
  public onCompleteItem(res) {
    if (res && res._embedded && res._embedded.workspaceitems && res._embedded.workspaceitems.length > 0) {
      const workspaceitems = res._embedded.workspaceitems;
      this.uploadEnd.emit(workspaceitems);

      if (workspaceitems.length === 1) {
        const options = new NotificationOptions();
        options.timeOut = 0;
        const link = '/workspaceitems/' + workspaceitems[0].id + '/edit';
        this.notificationsService.notificationWithAnchor(
          NotificationType.Success,
          options,
          link,
          'mydspace.general.text-here',
          'mydspace.upload.upload-successful',
          'here');
      } else if (workspaceitems.length > 1) {
        this.notificationsService.success(null, this.translate.get('mydspace.upload.upload-multiple-successful', {qty: workspaceitems.length}));
      }

    } else {
      this.notificationsService.error(null, this.translate.get('mydspace.upload.upload-failed'));
    }
  }

  /**
   * Method called on file upload error
   */
  public onUploadError() {
    this.notificationsService.error(null, this.translate.get('mydspace.upload.upload-failed'));
  }

  /**
   * Unsubscribe from the subscription
   */
  ngOnDestroy(): void {
    if (hasValue(this.sub)) {
      this.sub.unsubscribe();
    }
  }
}
