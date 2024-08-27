import {
  AsyncPipe,
  NgIf,
} from '@angular/common';
import {
  Component,
  OnInit,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { FileDownloadLinkComponent } from '../../../../../../../../../../../shared/file-download-link/file-download-link.component';

@Component({
  selector: 'ds-file-download-button',
  templateUrl: './file-download-button.component.html',
  styleUrls: ['./file-download-button.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    RouterLink,
    AsyncPipe,
    TranslateModule,
  ],
})
/**
 * Component displaying a download button or the request a copy button depending on authorization
 */
export class FileDownloadButtonComponent extends FileDownloadLinkComponent implements OnInit {

  hasNoDownload = true;

  ngOnInit() {
    super.ngOnInit();
    this.hasNoDownload = this.bitstream?.allMetadataValues('bitstream.viewer.provider').includes('nodownload');
  }

}
