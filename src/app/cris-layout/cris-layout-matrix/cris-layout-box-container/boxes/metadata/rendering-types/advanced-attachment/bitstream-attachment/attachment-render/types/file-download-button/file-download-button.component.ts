import { Component, OnInit } from '@angular/core';
import {
  FileDownloadLinkComponent
} from '../../../../../../../../../../../shared/file-download-link/file-download-link.component';
import { AttachmentRenderingType, AttachmentTypeRendering } from '../../../attachment-type.decorator';

@Component({
  selector: 'ds-file-download-button',
  templateUrl: './file-download-button.component.html',
  styleUrls: ['./file-download-button.component.scss']
})
/**
 * Component displaying a download button or the request a copy button depending on authorization
 */
@AttachmentTypeRendering(AttachmentRenderingType.DOWNLOAD, true)
export class FileDownloadButtonComponent extends FileDownloadLinkComponent implements OnInit {

  hasNoDownload = true;

  ngOnInit() {
    super.ngOnInit();
    this.hasNoDownload = this.bitstream?.allMetadataValues('bitstream.viewer.provider').includes('nodownload');
  }

}
