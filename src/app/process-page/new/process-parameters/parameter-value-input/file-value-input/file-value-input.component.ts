import { Component, OnInit } from '@angular/core';
import { FileUploaderOptions } from 'ng2-file-upload';
import { UploaderOptions } from '../../../../../shared/uploader/uploader-options.model';

@Component({
  selector: 'ds-file-value-input',
  templateUrl: './file-value-input.component.html',
  styleUrls: ['./file-value-input.component.scss']
})
export class FileValueInputComponent implements OnInit {
  uploadFilesOptions: FileUploaderOptions;

  constructor() {
  }

  ngOnInit() {
    this.uploadFilesOptions = new UploaderOptions();
    this.uploadFilesOptions.autoUpload = false;
    this.uploadFilesOptions.url = 'bladibla';
    this.uploadFilesOptions.authToken = 'bladibla';
    this.uploadFilesOptions.disableMultipart = true;
    this.uploadFilesOptions.formatDataFunctionIsAsync = false;
    this.uploadFilesOptions.formatDataFunction((t) => console.log(t));
  }

  onCompleteItem() {

  }

  onUploadError() {

  }
}
