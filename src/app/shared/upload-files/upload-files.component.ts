import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewEncapsulation
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

export class UploadFilesComponent implements OnInit {

  /**
   * Configuration for the ng2-file-upload component.
   */
  @Input()  uploadFilesOptions: UploadFilesComponentOptions;

  @Output() onCompleteItem: EventEmitter<any> = new EventEmitter<any>();

  public uploader:FileUploader;
  public hasBaseDropZoneOver = false;

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
    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
      const responsePath = JSON.parse(response);
      this.onCompleteItem.emit(responsePath);
    };
  }

  /**
   * Called when files are dragged on the drop area.
   */
  public fileOverBase(e:any):void {
    this.hasBaseDropZoneOver = e;
  }

  /**
   * Ensure options passed contains the required properties.
   *
   * @param fileUploadOptions
   *    The upload-files options object.
   */
  private checkConfig(fileUploadOptions:any) {
    const required = ['url', 'authToken', 'disableMultipart', 'itemAlias'];
    const missing = required.filter((prop) => {
      return !(prop in fileUploadOptions);
    });
    if (0 < missing.length) {
      throw new Error('UploadFiles: Argument is missing the following required properties: ' + missing.join(', '));
    }
  }

}
