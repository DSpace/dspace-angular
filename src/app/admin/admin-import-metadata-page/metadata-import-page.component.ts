import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  METADATA_IMPORT_SCRIPT_NAME,
  ScriptDataService,
} from '@dspace/core/data/processes/script-data.service';
import { RemoteData } from '@dspace/core/data/remote-data';
import { NotificationsService } from '@dspace/core/notification-system/notifications.service';
import { Process } from '@dspace/core/processes/process.model';
import { ProcessParameter } from '@dspace/core/processes/process-parameter.model';
import { getFirstCompletedRemoteData } from '@dspace/core/shared/operators';
import { isNotEmpty } from '@dspace/shared/utils/empty.util';
import {
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';

import { getProcessDetailRoute } from '../../process-page/process-page-routing.paths';
import { FileDropzoneNoUploaderComponent } from '../../shared/upload/file-dropzone-no-uploader/file-dropzone-no-uploader.component';

@Component({
  selector: 'ds-base-metadata-import-page',
  templateUrl: './metadata-import-page.component.html',
  imports: [
    FileDropzoneNoUploaderComponent,
    FormsModule,
    TranslateModule,
  ],
  standalone: true,
})

/**
 * Component that represents a metadata import page for administrators
 */
export class MetadataImportPageComponent {

  /**
   * The current value of the file
   */
  fileObject: File;

  /**
   * The validate only flag
   */
  validateOnly = true;

  public constructor(private location: Location,
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
   * When return button is pressed go to previous location
   */
  public onReturn() {
    this.location.back();
  }

  /**
   * Starts import-metadata script with -f fileName (and the selected file)
   */
  public importMetadata() {
    if (this.fileObject == null) {
      this.notificationsService.error(this.translate.get('admin.metadata-import.page.error.addFile'));
    } else {
      const parameterValues: ProcessParameter[] = [
        Object.assign(new ProcessParameter(), { name: '-f', value: this.fileObject.name }),
      ];
      if (this.validateOnly) {
        parameterValues.push(Object.assign(new ProcessParameter(), { name: '-v', value: true }));
      }

      this.scriptDataService.invoke(METADATA_IMPORT_SCRIPT_NAME, parameterValues, [this.fileObject]).pipe(
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
