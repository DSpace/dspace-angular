import { Component, Input, OnInit } from '@angular/core';

import { WorkspaceitemSectionUploadFileObject } from '../../../../../core/submission/models/workspaceitem-section-upload-file.model';
import { isNotEmpty } from '../../../../../shared/empty.util';
import { Metadata } from '../../../../../core/shared/metadata.utils';
import { MetadataMap, MetadataValue } from '../../../../../core/shared/metadata.models';

@Component({
  selector: 'ds-submission-upload-section-file-view',
  templateUrl: './file-view.component.html',
})
export class UploadSectionFileViewComponent implements OnInit {
  @Input() fileData: WorkspaceitemSectionUploadFileObject;

  public metadata: MetadataMap = Object.create({});
  public fileTitleKey = 'Title';
  public fileDescrKey = 'Description';

  ngOnInit() {
    if (isNotEmpty(this.fileData.metadata)) {
      this.metadata[this.fileTitleKey] = Metadata.all(this.fileData.metadata, 'dc.title');
      this.metadata[this.fileDescrKey] = Metadata.all(this.fileData.metadata, 'dc.description');
    }
  }

  getAllMetadataValue(metadataKey): MetadataValue[] {
    return Metadata.all(this.metadata, metadataKey);
  }
}
