import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/internal/Observable';
import { map, switchMap } from 'rxjs/operators';
import { AuthService } from '../../core/auth/auth.service';
import {
  METADATA_IMPORT_SCRIPT_NAME,
  ScriptDataService
} from '../../core/data/processes/script-data.service';
import { EPerson } from '../../core/eperson/models/eperson.model';
import { ProcessParameter } from '../../process-page/processes/process-parameter.model';
import { isNotEmpty } from '../../shared/empty.util';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { RemoteData } from '../../core/data/remote-data';
import { Process } from '../../process-page/processes/process.model';
import { getFirstCompletedRemoteData } from '../../core/shared/operators';
import { getProcessDetailRoute } from '../../process-page/process-page-routing.paths';

@Component({
  selector: 'ds-metadata-import-page',
  templateUrl: './metadata-import-page.component.html'
})

/**
 * Component that represents a metadata import page for administrators
 */
export class MetadataImportPageComponent implements OnInit {

  /**
   * The current value of the file
   */
  fileObject: File;

  /**
   * The authenticated user's email
   */
  private currentUserEmail$: Observable<string>;

  public constructor(protected authService: AuthService,
                     private location: Location,
                     protected translate: TranslateService,
                     protected notificationsService: NotificationsService,
                     private scriptDataService: ScriptDataService,
                     private router: Router) {
  }

  /**
   * Set file
   * @param file
   */
  setFile(file) {
    this.fileObject = file;
  }

  /**
   * Method provided by Angular. Invoked after the constructor.
   */
  ngOnInit() {
    this.currentUserEmail$ = this.authService.getAuthenticatedUserFromStore().pipe(
      map((user: EPerson) => user.email)
    );
  }

  /**
   * When return button is pressed go to previous location
   */
  public onReturn() {
    this.location.back();
  }

  /**
   * Starts import-metadata script with -e currentUserEmail -f fileName (and the selected file)
   */
  public importMetadata() {
    if (this.fileObject == null) {
      this.notificationsService.error(this.translate.get('admin.metadata-import.page.error.addFile'));
    } else {
      this.currentUserEmail$.pipe(
        switchMap((email: string) => {
          if (isNotEmpty(email)) {
            const parameterValues: ProcessParameter[] = [
              Object.assign(new ProcessParameter(), { name: '-e', value: email }),
              Object.assign(new ProcessParameter(), { name: '-f', value: this.fileObject.name }),
            ];
            return this.scriptDataService.invoke(METADATA_IMPORT_SCRIPT_NAME, parameterValues, [this.fileObject])
          }
        }),
        getFirstCompletedRemoteData(),
      ).subscribe((rd: RemoteData<Process>) => {
        if (rd.hasSucceeded) {
          const title = this.translate.get('process.new.notification.success.title');
          const content = this.translate.get('process.new.notification.success.content');
          this.notificationsService.success(title, content);
          if (isNotEmpty(rd.payload)) {
            this.router.navigateByUrl(getProcessDetailRoute(rd.payload.processId));
          }
        } else {
          const title = this.translate.get('process.new.notification.error.title');
          const content = this.translate.get('process.new.notification.error.content');
          this.notificationsService.error(title, content);
        }
      });
    }
  }
}
