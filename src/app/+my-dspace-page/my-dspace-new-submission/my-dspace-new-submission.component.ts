import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { UploadFilesComponentOptions } from '../../shared/upload-files/upload-files-component-options.model';
import { SubmissionState } from '../../submission/submission.reducers';
import { Store } from '@ngrx/store';
import { WorkspaceitemDataService } from '../../core/submission/workspaceitem-data.service';
import { AuthService } from '../../core/auth/auth.service';
import { MyDSpaceResult } from '../my-dspace-result.model';
import { DSpaceObject } from '../../core/shared/dspace-object.model';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { TranslateService } from '@ngx-translate/core';
import { NotificationOptions } from '../../shared/notifications/models/notification-options.model';

@Component({
  selector: 'ds-my-dspace-new-submission',
  styleUrls: ['./my-dspace-new-submission.component.scss'],
  templateUrl: './my-dspace-new-submission.component.html'
})

export class MyDSpaceNewSubmissionComponent implements OnInit {
  @Output()
  wsiUploaded = new EventEmitter<Array<MyDSpaceResult<DSpaceObject>>>();

  public uploadFilesOptions: UploadFilesComponentOptions = {
    url: '',
    authToken: null,
    disableMultipart: false,
    itemAlias: null
  };

  constructor(private authService: AuthService,
              private changeDetectorRef: ChangeDetectorRef,
              private notificationsService: NotificationsService,
              private store: Store<SubmissionState>,
              private wsiDataService: WorkspaceitemDataService,
              private translate: TranslateService) {
  }

  ngOnInit() {
    this.wsiDataService.getEndpoint().subscribe( (url) => {
        this.uploadFilesOptions.url = url;
        this.uploadFilesOptions.authToken = this.authService.buildAuthHeader();
        console.log('Url option is ', url);
        this.changeDetectorRef.detectChanges();
      }
    );
  }

  onBeforeUpload = () => {
    // Nothing
  };

  public onCompleteItem(res) {
    if (res && res._embedded && res._embedded.workspaceitems && res._embedded.workspaceitems.length > 0) {
      const workspaceitems = res._embedded.workspaceitems;
      this.wsiUploaded.emit(workspaceitems);

        if (workspaceitems.length === 1) {
          const options = new NotificationOptions();
          options.timeOut = 0;
          const link = '/workspaceitems/' + workspaceitems[0].id + '/edit';
          const here = `<button class="btn btn-link p-0 m-0 pb-1" routerLink="${link}" >HERE</button>`;
          const message = this.translate.get('submission.mydspace.upload_workspace_success', {here});
          message
            .take(1)
            .subscribe( (m) => {
              this.notificationsService.success(null, null, options, m);
          });
        } else if (workspaceitems.length > 1) {
          this.notificationsService.success(null, this.translate.get('submission.mydspace.upload_workspace_success_more', {qty: workspaceitems.length}))
        }

    } else {
      this.notificationsService.error(null, this.translate.get('submission.mydspace.upload_workspace_error'))
    }
  }

}
