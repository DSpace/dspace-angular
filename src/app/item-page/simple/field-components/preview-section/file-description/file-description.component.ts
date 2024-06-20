import { Component, Input } from '@angular/core';
import { MetadataBitstream } from 'src/app/core/metadata/metadata-bitstream.model';
import { HALEndpointService } from '../../../../../core/shared/hal-endpoint.service';
import {Router} from '@angular/router';

const allowedPreviewFormats = ['text/plain', 'text/html', 'application/zip'];
@Component({
  selector: 'ds-file-description',
  templateUrl: './file-description.component.html',
  styleUrls: ['./file-description.component.scss'],
})
export class FileDescriptionComponent {
  MIME_TYPE_IMAGES_PATH = '/assets/images/mime/';
  MIME_TYPE_DEFAULT_IMAGE_NAME = 'application-octet-stream.png';

  @Input()
  fileInput: MetadataBitstream;

  constructor(protected halService: HALEndpointService, private router: Router) { }

  public downloadFile() {
    void this.router.navigateByUrl('bitstreams/' + this.fileInput.id + '/download');
  }

  public isTxt() {
    return this.fileInput?.format === 'text/plain';
  }

  public isHtml() {
    return this.fileInput?.format === 'text/html';
  }

  /**
   * Show scrollbar in the `.txt` preview, but it should be hidden in the other formats.
   */
  public dynamicOverflow() {
    return (this.isTxt() || this.isHtml()) ? 'overflow: scroll' : 'overflow: hidden';
  }

  /**
   * Supported Preview formats are: `text/plain`, `text/html`, `application/zip`
   */
  public couldPreview() {
    if (this.fileInput.canPreview === false) {
      return false;
    }

    return allowedPreviewFormats.includes(this.fileInput.format);
  }

  handleImageError(event) {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = this.MIME_TYPE_IMAGES_PATH + this.MIME_TYPE_DEFAULT_IMAGE_NAME;
  }
}
