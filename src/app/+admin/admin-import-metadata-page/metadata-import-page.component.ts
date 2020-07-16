import { Location } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { uniqueId } from 'lodash';
import { FileUploader } from 'ng2-file-upload';
import { Observable } from 'rxjs/internal/Observable';
import { map, switchMap, take } from 'rxjs/operators';
import { AuthService } from '../../core/auth/auth.service';
import { METADATA_IMPORT_SCRIPT_NAME, ScriptDataService } from '../../core/data/processes/script-data.service';
import { RequestEntry } from '../../core/data/request.reducer';
import { EPerson } from '../../core/eperson/models/eperson.model';
import { ProcessParameter } from '../../process-page/processes/process-parameter.model';
import { isNotEmpty } from '../../shared/empty.util';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { of as observableOf } from 'rxjs';
import { UploaderOptions } from '../../shared/uploader/uploader-options.model';

@Component({
  selector: 'ds-metadata-import-page',
  templateUrl: './metadata-import-page.component.html',
  styleUrls: ['./metadata-import-page.component.scss']
})

/**
 * Component that represents a metadata import page for administrators
 */
export class MetadataImportPageComponent implements OnInit {

  public isOverDocumentDropZone: Observable<boolean>;
  public uploader: FileUploader;
  public uploaderId: string;

  /**
   * The uploader configuration options
   * @type {UploaderOptions}
   */
  uploadFilesOptions: UploaderOptions = Object.assign(new UploaderOptions(), {
    // URL needs to contain something to not produce any errors. We are using onFileDrop; not the uploader
    url: 'placeholder',
  });

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
   * Method provided by Angular. Invoked after the constructor.
   */
  ngOnInit() {
    this.currentUserEmail$ = this.authService.getAuthenticatedUserFromStore().pipe(
      map((user: EPerson) => user.email)
    );
    this.uploaderId = 'ds-drag-and-drop-uploader' + uniqueId();
    this.isOverDocumentDropZone = observableOf(false);
    window.addEventListener('drop', (e: DragEvent) => {
      return e && e.preventDefault();
    }, false);
    this.uploader = new FileUploader({
      // required, but using onFileDrop, not uploader
      url: 'placeholder',
    });
  }

  @HostListener('window:dragover', ['$event'])
  onDragOver(event: any) {
    // Show drop area on the page
    event.preventDefault();
    if ((event.target as any).tagName !== 'HTML') {
      this.isOverDocumentDropZone = observableOf(true);
    }
  }

  /**
   * Called when files are dragged on the window document drop area.
   */
  public fileOverDocument(isOver: boolean) {
    if (!isOver) {
      this.isOverDocumentDropZone = observableOf(isOver);
    }
  }

  /**
   * Set (CSV) file
   * @param files
   */
  setFile(files) {
    this.fileObject = files.length > 0 ? files[0] : undefined;
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
              .pipe(
                take(1),
                map((requestEntry: RequestEntry) => {
                  if (requestEntry.response.isSuccessful) {
                    const title = this.translate.get('process.new.notification.success.title');
                    const content = this.translate.get('process.new.notification.success.content');
                    this.notificationsService.success(title, content);
                    const response: any = requestEntry.response;
                    if (isNotEmpty(response.resourceSelfLinks)) {
                      const processNumber = response.resourceSelfLinks[0].split('/').pop();
                      this.router.navigateByUrl('/processes/' + processNumber);
                    }
                  } else {
                    const title = this.translate.get('process.new.notification.error.title');
                    const content = this.translate.get('process.new.notification.error.content');
                    this.notificationsService.error(title, content);
                  }
                }));
          }
        }),
        take(1)
      ).subscribe();
    }
  }
}
