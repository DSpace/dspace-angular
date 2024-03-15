import { Component, Input, OnInit } from '@angular/core';
import { Item } from '../../core/shared/item.model';
import { getAllSucceededRemoteListPayload } from '../../core/shared/operators';
import { getItemPageRoute } from '../item-page-routing-paths';
import { MetadataBitstream } from '../../core/metadata/metadata-bitstream.model';
import { RegistryService } from '../../core/registry/registry.service';
import { Router } from '@angular/router';
import { HALEndpointService } from '../../core/shared/hal-endpoint.service';

@Component({
  selector: 'ds-clarin-files-section',
  templateUrl: './clarin-files-section.component.html',
  styleUrls: ['./clarin-files-section.component.scss']
})
export class ClarinFilesSectionComponent implements OnInit {

  /**
   * The item to display files for
   */
  @Input() item: Item;

  /**
   * handle of the current item
   */
  @Input() itemHandle: string;

  canShowCurlDownload = false;

  /**
   * If download by command button is click, the command line will be shown
   */
  isCommandLineVisible = false;

  /**
   * command for the download command feature
   */
  command: string;

  /**
   * determine to show download all zip button or not
   */
  canDownloadAllFiles = false;

  /**
   * total size of list of files uploaded by users to this item
   */
  totalFileSizes: number;

  /**
   * list of files uploaded by users to this item
   */
  listOfFiles: MetadataBitstream[];


  constructor(protected registryService: RegistryService,
              protected router: Router,
              protected halService: HALEndpointService) {
  }

  ngOnInit(): void {
    this.registryService
      .getMetadataBitstream(this.itemHandle, 'ORIGINAL,TEXT,THUMBNAIL')
      .pipe(getAllSucceededRemoteListPayload())
      .subscribe((data: MetadataBitstream[]) => {
        this.listOfFiles = data;
        this.generateCurlCommand();
        this.sumFileSizes();
      });
  }

  setCommandline() {
    this.isCommandLineVisible = !this.isCommandLineVisible;
  }

  downloadFiles() {
    void this.router.navigate([getItemPageRoute(this.item), 'download']);
  }

  generateCurlCommand() {
    const fileNames = this.listOfFiles.map((file: MetadataBitstream) => {
      // Show `Download All Files` only if there are more files.
      if (this.listOfFiles.length > 1) {
        this.canDownloadAllFiles = true;
      }

      if (file.canPreview) {
        this.canShowCurlDownload = true;
      }

      return file.name;
    });

    this.command = `curl --remote-name-all ` + this.halService.getRootHref() + `/core/bitstreams/handle/${
      this.itemHandle
    }/{${fileNames.join(',')}}`;
  }

  sumFileSizes() {
    let totalBytes = 0;
    this.listOfFiles.forEach((file) => {
      totalBytes += file.fileSize;
    });
    this.totalFileSizes = totalBytes;
  }
}
