import { Component, Input, OnInit } from '@angular/core';
import { FileService } from '../../core/shared/file.service';
import { Observable } from 'rxjs';
import { AuthService } from '../../core/auth/auth.service';
import { Bitstream } from '../../core/shared/bitstream.model';
import { getBitstreamModuleRoute } from '../../app-routing-paths';
import { URLCombiner } from '../../core/url-combiner/url-combiner';

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

  /**
   * Whether or not the current user is authenticated
   */
  isAuthenticated$: Observable<boolean>;

  constructor(private fileService: FileService,
              private authService: AuthService,
  ) {
  }

  ngOnInit() {
    this.isAuthenticated$ = this.authService.isAuthenticated();
    this.bitstreamPath = this.getBitstreamPath();
  }

  getBitstreamPath() {
    return new URLCombiner(getBitstreamModuleRoute(), this.bitstream.uuid, 'download').toString();
  }
}
