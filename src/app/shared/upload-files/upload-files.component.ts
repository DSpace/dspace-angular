import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
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
  @Input() uploadFilesOptions: UploadFilesComponentOptions;

  public uploader:FileUploader = new FileUploader({url: 'https://evening-anchorage-3159.herokuapp.com/api/',
                                                   removeAfterUpload: true,
                                                   autoUpload: true});
  public hasBaseDropZoneOver = false;

  /**
   * Method provided by Angular. Invoked after the constructor.
   */
  ngOnInit() {
    // this.checkConfig(this.uploadFilesOptions);
    // this.uploader = new FileUploader({url: this.uploadFilesOptions.url});
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
  private checkConfig(fileUploadOptions: any) {
    const required = ['url'];
    const missing = required.filter((prop) => {
      return !(prop in fileUploadOptions);
    });
    if (0 < missing.length) {
      throw new Error('UploadFiles: Argument is missing the following required properties: ' + missing.join(', '));
    }
  }

}
