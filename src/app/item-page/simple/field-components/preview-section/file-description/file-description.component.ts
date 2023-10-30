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
  @Input()
  fileInput: MetadataBitstream;

  constructor(protected halService: HALEndpointService, private router: Router) { }

  public downloadFiles() {
    console.log('${this.fileInput.href}', `${this.fileInput.href}`);
    console.log('gile', this.fileInput);
    // console.log('this.halService.getRootHref()', );
    // const href$ = this.halService.getEndpoint('bitstreams');
    this.router.navigateByUrl('bitstreams/' + this.fileInput.id + '/download');
    // href$.pipe(
    //   find((href: string) => hasValue(href)),
    // ).subscribe((endpoint: string) => {
    //   console.log('endpoint', endpoint + '/' + this.fileInput.id + '/download');
    // });
    // window.location.href = this.halService.getRootHref()
  }

  public isTxt() {
    return this.fileInput?.format === 'text/plain';
  }

  /**
   * Show scrollbar in the `.txt` preview, but it should be hidden in the other formats.
   */
  public dynamicOverflow() {
    return this.isTxt() ? 'overflow: scroll' : 'overflow: hidden';
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
}
