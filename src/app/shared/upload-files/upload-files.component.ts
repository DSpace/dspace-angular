import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core'

import { FileUploader } from 'ng2-file-upload';
import { Observable } from 'rxjs/Observable';
import { uniqueId } from 'lodash';
import { ScrollToConfigOptions, ScrollToService } from '@nicky-lenaers/ngx-scroll-to';

import { UploadFilesComponentOptions } from './upload-files-component-options.model';
import { isUndefined } from '../empty.util';

@Component({
  selector: 'ds-upload-files',
  templateUrl: 'upload-files.component.html',
  styleUrls: ['upload-files.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
  encapsulation: ViewEncapsulation.Emulated
})

export class UploadFilesComponent {

  /**
   * The message to show when drag files on the drop zone
   */
  @Input() dropMsg: string;

  /**
   * The message to show when drag files on the window document
   */
  @Input() dropOverDocumentMsg: string;

  /**
   * The message to show when drag files on the window document
   */
  @Input() enableDragOverDocument: boolean;

  /**
   * The function to call before an upload
   */
  @Input() onBeforeUpload: () => void;

  /**
   * Configuration for the ng2-file-upload component.
   */
  @Input() uploadFilesOptions: UploadFilesComponentOptions;

  /**
   * The function to call when upload is completed
   */
  @Output() onCompleteItem: EventEmitter<any> = new EventEmitter<any>();

  public uploader: FileUploader;
  public uploaderId: string;
  public hasBaseDropZoneOver = false;
  public dragOverDocument = Observable.of(false);

  @HostListener('window:dragenter', ['$event'])
  @HostListener('window:dragover', ['$event'])
  onDragOver(event: any) {
    if (this.enableDragOverDocument) {
      // Show drop area on the page
      event.preventDefault();
      this.dragOverDocument = Observable.of(true);
    }
  }

  @HostListener('window:dragleave', ['$event'])
  onDragLeave(event: any) {
    if (this.enableDragOverDocument) {
      console.log('leave', event);
      // onDragleave event is fired by many elements,
      // so intercept only those are fired by window document or drop zones
      if ((event.target as any).tagName === 'HTML'
        || (event.target as any).id === 'ds-body-drop-zone-content'
        || (event.target as any).id === 'ds-body-drop-zone') {
        // Hide drop area
        this.dragOverDocument = Observable.of(false);
      }
    }
  }

  constructor(private cdr: ChangeDetectorRef, private scrollToService: ScrollToService,) {
  }

  /**
   * Method provided by Angular. Invoked after the constructor.
   */
  ngOnInit() {
    this.uploaderId = 'ds-drag-and-drop-uploader' + uniqueId();
    this.checkConfig(this.uploadFilesOptions);
    this.uploader = new FileUploader({
      url: this.uploadFilesOptions.url,
      authToken: this.uploadFilesOptions.authToken,
      disableMultipart: this.uploadFilesOptions.disableMultipart,
      itemAlias: this.uploadFilesOptions.itemAlias,
      removeAfterUpload: true,
      autoUpload: true
    });

    if (isUndefined(this.enableDragOverDocument)) {
      this.enableDragOverDocument = false;
    }
    if (isUndefined(this.dropMsg)) {
      this.dropMsg = 'uploader.drag-message';
    }
    if (isUndefined(this.dropOverDocumentMsg)) {
      this.dropOverDocumentMsg = 'uploader.drag-message';
    }
  }

  ngAfterViewInit() {
    // Maybe to remove: needed to avoid CORS issue with our temp upload server
    this.uploader.onAfterAddingFile = ((item) => {
      item.withCredentials = false;
    });
    this.uploader.onBeforeUploadItem = () => {
      this.onBeforeUpload();
      this.dragOverDocument = Observable.of(false);

      const config: ScrollToConfigOptions = {
        target: this.uploaderId
      };
      this.scrollToService.scrollTo(config);
    };
    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
      const responsePath = JSON.parse(response);
      this.onCompleteItem.emit(responsePath);
    };
    this.uploader.onProgressAll = () => this.onProgress();
    this.uploader.onProgressItem = () => this.onProgress();
  }

  /**
   * Called when files are dragged on the drop area.
   */
  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
    this.dragOverDocument = Observable.of(false);
  }

  private onProgress() {
    this.cdr.detectChanges();
  }

  /**
   * Ensure options passed contains the required properties.
   *
   * @param fileUploadOptions
   *    The upload-files options object.
   */
  private checkConfig(fileUploadOptions: any) {
    const required = ['url', 'authToken', 'disableMultipart', 'itemAlias'];
    const missing = required.filter((prop) => {
      return !((prop in fileUploadOptions) && fileUploadOptions[prop] !== '');
    });
    if (0 < missing.length) {
      throw new Error('UploadFiles: Argument is missing the following required properties: ' + missing.join(', '));
    }
  }

  // @HostListener('window:drop', ['$event'])
  onDrop(ev: any) {
    console.log(`Drop end`, ev);
    this.dragOverDocument = Observable.of(false);
  }
}
