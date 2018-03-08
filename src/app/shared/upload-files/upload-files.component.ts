import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core'
import { FileUploader } from 'ng2-file-upload';
import { UploadFilesComponentOptions } from './upload-files-component-options.model';

@Component({
  selector: 'ds-upload-files',
  templateUrl: 'upload-files.component.html',
  styleUrls: ['upload-files.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
  encapsulation: ViewEncapsulation.Emulated
})

export class UploadFilesComponent {

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
  public hasBaseDropZoneOver = false;

  constructor(private cdr: ChangeDetectorRef) {
  }

  /**
   * Method provided by Angular. Invoked after the constructor.
   */
  ngOnInit() {
    this.checkConfig(this.uploadFilesOptions);
    this.uploader = new FileUploader({
      url: this.uploadFilesOptions.url,
      authToken: this.uploadFilesOptions.authToken,
      disableMultipart: this.uploadFilesOptions.disableMultipart,
      itemAlias: this.uploadFilesOptions.itemAlias,
      removeAfterUpload: true,
      autoUpload: true
    });
  }

  ngAfterViewInit() {
    // Maybe to remove: needed to avoid CORS issue with our temp upload server
    this.uploader.onAfterAddingFile = ((item) => {
      item.withCredentials = false;
    });
    this.uploader.onBeforeUploadItem = this.onBeforeUpload;
    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
      const responsePath = JSON.parse(response);
      this.onCompleteItem.emit(responsePath);
    };
    this.uploader.onProgressAll = () => this.cdr.detectChanges();
    this.uploader.onProgressItem = () => this.cdr.detectChanges();
  }

  /**
   * Called when files are dragged on the drop area.
   */
  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
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
