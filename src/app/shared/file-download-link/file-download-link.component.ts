import { Component, Input, OnInit } from '@angular/core';
import { Bitstream } from '../../core/shared/bitstream.model';
import { getBitstreamDownloadRoute } from '../../app-routing-paths';

@Component({
  selector: 'ds-file-download-link',
  templateUrl: './file-download-link.component.html',
  styleUrls: ['./file-download-link.component.scss']
})
/**
 * Component displaying a download link
 * When the user is authenticated, a short-lived token retrieved from the REST API is added to the download link,
 * ensuring the user is authorized to download the file.
 */
export class FileDownloadLinkComponent implements OnInit {

  /**
   * Optional bitstream instead of href and file name
   */
  @Input() bitstream: Bitstream;
  bitstreamPath: string;

  ngOnInit() {
    this.bitstreamPath = this.getBitstreamPath();
  }

  getBitstreamPath() {
    return getBitstreamDownloadRoute(this.bitstream);
  }
}
