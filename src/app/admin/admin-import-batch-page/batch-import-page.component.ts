import {
  AsyncPipe,
  Location,
} from '@angular/common';
import {
  Component,
  OnDestroy,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DSONameService } from '@dspace/core/breadcrumbs/dso-name.service';
import {
  BATCH_IMPORT_SCRIPT_NAME,
  ScriptDataService,
} from '@dspace/core/data/processes/script-data.service';
import {
  StagedUpload,
  StagedUploadService,
} from '@dspace/core/data/staged-upload.service';
import { RemoteData } from '@dspace/core/data/remote-data';
import { NotificationsService } from '@dspace/core/notification-system/notifications.service';
import { Process } from '@dspace/core/processes/process.model';
import { ProcessParameter } from '@dspace/core/processes/process-parameter.model';
import { DSpaceObject } from '@dspace/core/shared/dspace-object.model';
import { getFirstCompletedRemoteData } from '@dspace/core/shared/operators';
import {
  isEmpty,
  isNotEmpty,
} from '@dspace/shared/utils/empty.util';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import { UiSwitchModule } from 'ngx-ui-switch';
import { Subscription } from 'rxjs';
import {
  finalize,
  map,
  take,
} from 'rxjs/operators';

import { getProcessDetailRoute } from '../../process-page/process-page-routing.paths';
import { BtnDisabledDirective } from '../../shared/btn-disabled.directive';
import { ImportBatchSelectorComponent } from '../../shared/dso-selector/modal-wrappers/import-batch-selector/import-batch-selector.component';
import { FileDropzoneNoUploaderComponent } from '../../shared/upload/file-dropzone-no-uploader/file-dropzone-no-uploader.component';
import { FileSizePipe } from '../../shared/utils/file-size-pipe';

/** What the batch-import page keeps with a staged file, so a resumed upload reuses the original settings. */
interface RetainedImport {
  parameters: ProcessParameter[];
  collectionName?: string;
}

@Component({
  selector: 'ds-batch-import-page',
  templateUrl: './batch-import-page.component.html',
  imports: [
    AsyncPipe,
    BtnDisabledDirective,
    FileDropzoneNoUploaderComponent,
    FileSizePipe,
    FormsModule,
    TranslateModule,
    UiSwitchModule,
  ],
})
export class BatchImportPageComponent implements OnDestroy {
  /** Prevent duplicate submission while uploading or handing off to the process page. */
  uploading = false;
  private uploadSubscription?: Subscription;
  /**
   * The current value of the file
   */
  fileObject: File;

  /**
   * The validate only flag
   */
  validateOnly = true;

  /**
   * dso object for community or collection
   */
  dso: DSpaceObject = null;

  /**
   * The flag between upload and url
   */
  isUpload = true;

  /**
   * File URL when flag is for url
   */
  fileURL: string;

  public constructor(private location: Location,
                     protected translate: TranslateService,
                     protected notificationsService: NotificationsService,
                     private scriptDataService: ScriptDataService,
                     private router: Router,
                     private modalService: NgbModal,
                     private dsoNameService: DSONameService,
                     public stagedUploads: StagedUploadService) {
    this.fileObject = stagedUploads.retained?.file;
  }

  /**
   * Set file
   * @param file
   */
  setFile(file) {
    this.fileObject = file;
  }

  /** The collection this upload targets, also after returning to the page with a retained file. */
  get collectionName(): string {
    return this.dso ? this.getDspaceObjectName() : this.retainedImport?.collectionName;
  }

  /** The settings kept with a staged file that is waiting to be resumed. */
  private get retainedImport(): RetainedImport | undefined {
    return this.stagedUploads.retained?.context as RetainedImport | undefined;
  }

  /**
   * When return button is pressed go to previous location
   */
  public onReturn() {
    if (!this.uploading) {
      this.location.back();
    }
  }

  public selectCollection() {
    const modalRef = this.modalService.open(ImportBatchSelectorComponent);
    modalRef.componentInstance.response.pipe(take(1)).subscribe((dso) => {
      this.dso = dso || null;
    });
  }

  /**
   * Upload the SAF before creating an import process, or use the existing URL import path.
   */
  public importMetadata() {
    if (this.uploading) {
      return;
    }
    if (this.fileObject == null && isEmpty(this.fileURL)) {
      if (this.isUpload) {
        this.notificationsService.error(this.translate.get('admin.metadata-import.page.error.addFile'));
      } else {
        this.notificationsService.error(this.translate.get('admin.metadata-import.page.error.addFileUrl'));
      }
    } else {
      const parameterValues: ProcessParameter[] = [
        Object.assign(new ProcessParameter(), { name: '--add' }),
      ];
      if (this.isUpload) {
        parameterValues.push(Object.assign(new ProcessParameter(), { name: '--zip', value: this.fileObject.name }));
      } else {
        this.fileObject = null;
        parameterValues.push(Object.assign(new ProcessParameter(), { name: '--url', value: this.fileURL }));
      }
      if (this.dso) {
        parameterValues.push(Object.assign(new ProcessParameter(), { name: '--collection', value: this.dso.uuid }));
      }
      if (this.validateOnly) {
        parameterValues.push(Object.assign(new ProcessParameter(), { name: '-v', value: true }));
      }

      if (this.isUpload) {
        this.uploading = true;
        // A retained file resumes with the settings it was started with, not with the hidden form's defaults
        const resuming = this.stagedUploads.retained?.file === this.fileObject ? this.retainedImport : undefined;
        const context: RetainedImport = resuming ?? { parameters: parameterValues, collectionName: this.getDspaceObjectName() ?? undefined };
        this.uploadSubscription = this.stagedUploads.start(this.fileObject, (upload: StagedUpload) =>
          this.scriptDataService.invokeWithUploads(BATCH_IMPORT_SCRIPT_NAME, context.parameters, [upload.id]).pipe(
            getFirstCompletedRemoteData(),
            map((rd: RemoteData<Process>) => {
              if (!rd.hasSucceeded) {
                throw rd;
              }
              return rd.payload.processId;
            }),
          ), context).pipe(
          finalize(() => this.uploading = false),
        ).subscribe({
          next: (processId) => {
            this.notificationsService.success(this.translate.get('process.new.notification.success.title'),
              this.translate.get('process.new.notification.success.content'));
            void this.router.navigateByUrl(getProcessDetailRoute(String(processId)));
          },
          error: (error: unknown) => {
            const status = (error as { status?: number; statusCode?: number })?.status
              ?? (error as { statusCode?: number })?.statusCode;
            const key = status === 401 ? 'admin.batch-import.upload.expired'
              : status === 413 ? 'process.new.notification.error.max-upload.content' : 'admin.batch-import.upload.error';
            this.notificationsService.error(this.translate.get('process.new.notification.error.title'), this.translate.get(key));
          },
        });
        return;
      }

      this.scriptDataService.invoke(BATCH_IMPORT_SCRIPT_NAME, parameterValues, [this.fileObject]).pipe(
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
          if (rd.statusCode === 413) {
            const title = this.translate.get('process.new.notification.error.title');
            const content = this.translate.get('process.new.notification.error.max-upload.content');
            this.notificationsService.error(title, content);
          } else {
            const title = this.translate.get('process.new.notification.error.title');
            const content = this.translate.get('process.new.notification.error.content');
            this.notificationsService.error(title, content);
          }
        }
      });
    }
  }

  /** Stop transfer and discard staging; a process already being created is not cancelled. */
  public cancelUpload(): void {
    this.uploadSubscription?.unsubscribe();
    this.stagedUploads.cancel().subscribe({
      next: () => this.fileObject = undefined,
      error: () => this.notificationsService.error(this.translate.get('admin.batch-import.upload.error')),
    });
  }

  /** Stop network transfer when leaving the page; committed chunks remain available for retry. */
  public ngOnDestroy(): void {
    this.uploadSubscription?.unsubscribe();
  }

  /** Show 100% only after the final chunk has been acknowledged. */
  public uploadPercentage(loaded: number, total: number): number {
    return total > 0 ? Math.floor(loaded * 100 / total) : 0;
  }

  /**
   * return selected dspace object name
  */
  getDspaceObjectName(): string {
    if (this.dso) {
      return this.dsoNameService.getName(this.dso);
    }
    return null;
  }

  /**
   * remove selected dso object
   */
  removeDspaceObject(): void {
    this.dso = null;
  }

  /**
   * toggle the flag between upload and url
   */
  toggleUpload() {
    this.isUpload = !this.isUpload;
  }
}
