import { Component, Input, OnInit } from '@angular/core';
import { FileService } from '../../core/shared/file.service';
import { Observable } from 'rxjs/internal/Observable';
import { AuthService } from '../../core/auth/auth.service';

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
   * Href to link to
   */
  @Input() href: string;

  /**
   * Optional file name for the download
   */
  @Input() download: string;

  /**
   * Whether or not the current user is authenticated
   */
  isAuthenticated$: Observable<boolean>;

  constructor(private fileService: FileService,
              private authService: AuthService) { }

  ngOnInit() {
    this.isAuthenticated$ = this.authService.isAuthenticated();
  }

  /**
   * Start a download of the file
   * Return false to ensure the original href is displayed when the user hovers over the link
   */
  downloadFile(): boolean {
    this.fileService.downloadFile(this.href);
    return false;
  }

}
