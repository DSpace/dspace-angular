import { Component, Input, OnInit } from '@angular/core';
import { WorkspaceitemSectionUploadFileObject } from '../../../../../core/submission/models/workspaceitem-section-upload-file.model';
import { Metadatum } from '../../../../../core/shared/metadatum.model';
import { isNotEmpty } from '../../../../../shared/empty.util';

@Component({
  selector: 'ds-submission-upload-section-file-view',
  templateUrl: './file-view.component.html',
})
export class UploadSectionFileViewComponent implements OnInit {
  @Input() fileData: WorkspaceitemSectionUploadFileObject;

  public metadata: Metadatum[] = [];

  ngOnInit() {
    if (isNotEmpty(this.fileData.metadata)) {
      this.metadata.push({
        key: 'Title',
        language: (this.fileData.metadata.hasOwnProperty('dc.title') ? this.fileData.metadata['dc.title'][0].language : ''),
        value: (this.fileData.metadata.hasOwnProperty('dc.title') ? this.fileData.metadata['dc.title'][0].value : '')
      });
      this.metadata.push({
        key: 'Description',
        language: (this.fileData.metadata.hasOwnProperty('dc.description') ? this.fileData.metadata['dc.description'][0].language : ''),
        value: (this.fileData.metadata.hasOwnProperty('dc.description') ? this.fileData.metadata['dc.description'][0].value : '')
      });
    }
  }
}
