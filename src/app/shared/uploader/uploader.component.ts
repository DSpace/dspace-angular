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

import { of as observableOf } from 'rxjs';
import { FileUploader } from 'ng2-file-upload';
import { uniqueId } from 'lodash';
import { ScrollToConfigOptions, ScrollToService } from '@nicky-lenaers/ngx-scroll-to';

import { UploaderOptions } from './uploader-options.model';
import { hasValue, isNotEmpty, isUndefined } from '../empty.util';
import { UploaderService } from './uploader.service';
import { UploaderProperties } from './uploader-properties.model';

@Component({
  selector: 'ds-uploader',
  templateUrl: 'uploader.component.html',
  styleUrls: ['uploader.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
  encapsulation: ViewEncapsulation.Emulated
})

export class UploaderComponent {

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
  @Input() uploadFilesOptions: UploaderOptions;

  /**
   * Extra properties to be passed with the form-data of the upload
   */
  @Input() uploadProperties: UploaderProperties;

  /**
   * The function to call when upload is completed
   */
  @Output() onCompleteItem: EventEmitter<any> = new EventEmitter<any>();

  /**
   * The function to call on error occurred
   */
  @Output() onUploadError: EventEmitter<any> = new EventEmitter<any>();

  public uploader: FileUploader;
  public uploaderId: string;
  public isOverBaseDropZone = observableOf(false);
  public isOverDocumentDropZone = observableOf(false);

  @HostListener('window:dragover', ['$event'])
  onDragOver(event: any) {

    if (this.enableDragOverDocument && this.uploaderService.isAllowedDragOverPage()) {
      // Show drop area on the page
      event.preventDefault();
      if ((event.target as any).tagName !== 'HTML') {
        this.isOverDocumentDropZone = observableOf(true);
      }
    }
  }

  constructor(private cdr: ChangeDetectorRef, private scrollToService: ScrollToService, private uploaderService: UploaderService) {
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
      autoUpload: this.uploadFilesOptions.autoUpload,
      method: this.uploadFilesOptions.method
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
    if (isUndefined(this.onBeforeUpload)) {
      this.onBeforeUpload = () => {return};
    }
    this.uploader.onBeforeUploadItem = (item) => {
      if (item.url !== this.uploader.options.url) {
        item.url = this.uploader.options.url;
      }
      this.onBeforeUpload();
      this.isOverDocumentDropZone = observableOf(false);

      // Move page target to the uploader
      const config: ScrollToConfigOptions = {
        target: this.uploaderId
      };
      this.scrollToService.scrollTo(config);
    };
    if (hasValue(this.uploadProperties)) {
      this.uploader.onBuildItemForm = (item, form) => {
        form.append('properties', JSON.stringify(this.uploadProperties))
      };
    }
    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
      if (isNotEmpty(response)) {
        const responsePath = JSON.parse(response);
        this.onCompleteItem.emit(responsePath);
      }
    };
    this.uploader.onErrorItem = (item: any, response: any, status: any, headers: any) => {
      this.onUploadError.emit(null);
      this.uploader.cancelAll();
    };
    this.uploader.onProgressAll = () => this.onProgress();
    this.uploader.onProgressItem = () => this.onProgress();
  }

  /**
   * Called when files are dragged on the base drop area.
   */
  public fileOverBase(isOver: boolean): void {
    this.isOverBaseDropZone = observableOf(isOver);
  }

  /**
   * Called when files are dragged on the window document drop area.
   */
  public fileOverDocument(isOver: boolean) {
    if (!isOver) {
      this.isOverDocumentDropZone = observableOf(isOver);
    }
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

}
