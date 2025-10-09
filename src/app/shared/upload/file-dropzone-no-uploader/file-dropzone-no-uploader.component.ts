import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import uniqueId from 'lodash/uniqueId';
import {
  FileUploader,
  FileUploadModule,
} from 'ng2-file-upload';
import {
  Observable,
  of,
} from 'rxjs';

import { FileValidator } from '../../utils/require-file.validator';
import { UploaderOptions } from '../uploader/uploader-options.model';

/**
 * Component to have a file dropzone without that dropping/choosing a file in browse automatically triggers
 * the uploader, instead an event is emitted with the file that was added.
 *
 * Here only one file is allowed to be selected, so if one is selected/dropped the message changes to a
 * replace message.
 */
@Component({
  selector: 'ds-file-dropzone-no-uploader',
  templateUrl: './file-dropzone-no-uploader.component.html',
  styleUrls: ['./file-dropzone-no-uploader.scss'],
  imports: [
    CommonModule,
    FileUploadModule,
    FileValidator,
    FormsModule,
    TranslateModule,
  ],
  standalone: true,
})
export class FileDropzoneNoUploaderComponent implements OnInit {

  public isOverDocumentDropZone: Observable<boolean>;
  public uploader: FileUploader;
  public uploaderId: string;

  @Input() dropMessageLabel: string;
  @Input() dropMessageLabelReplacement: string;

  /**
   * The function to call when file is added
   */
  @Output() onFileAdded: EventEmitter<File> = new EventEmitter<File>();

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
   * Method provided by Angular. Invoked after the constructor.
   */
  ngOnInit() {
    this.uploaderId = 'ds-drag-and-drop-uploader' + uniqueId();
    this.isOverDocumentDropZone = of(false);
    this.uploader = new FileUploader({
      // required, but using onFileDrop, not uploader
      url: 'placeholder',
    });
  }

  @HostListener('window:drop', ['$event'])
  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  @HostListener('window:dragover', ['$event'])
  onDragOver(event: DragEvent) {
    // Show drop area on the page
    event.preventDefault();
    event.stopPropagation();
    if ((event.target as HTMLElement).tagName !== 'HTML') {
      this.isOverDocumentDropZone = of(true);
    }
  }

  /**
   * Called when files are dragged on the window document drop area.
   */
  public fileOverDocument(isOver: boolean) {
    if (!isOver) {
      this.isOverDocumentDropZone = of(isOver);
    }
  }

  public handleFileInput(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.setFile(input.files);
    }
  }

  /**
   * Set file
   * @param files
   */
  public setFile(files: FileList) {
    this.fileObject = files.length > 0 ? files[0] : undefined;
    this.onFileAdded.emit(this.fileObject);
  }

}
