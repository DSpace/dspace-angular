import { Component, OnInit } from '@angular/core';
import { FileDownloadLinkComponent } from '../file-download-link/file-download-link.component';

@Component({
  selector: 'ds-file-download-button',
  templateUrl: './file-download-button.component.html',
  styleUrls: ['./file-download-button.component.scss']
})
/**
 * Component displaying a download button or the request a coppy button depending on authorization
 */
export class FileDownloadButtonComponent extends FileDownloadLinkComponent implements OnInit {

}
