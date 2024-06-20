import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MetadataBitstream } from 'src/app/core/metadata/metadata-bitstream.model';
import { RegistryService } from 'src/app/core/registry/registry.service';
import { Item } from 'src/app/core/shared/item.model';
import { getAllSucceededRemoteListPayload } from 'src/app/core/shared/operators';

@Component({
  selector: 'ds-preview-section',
  templateUrl: './preview-section.component.html',
  styleUrls: ['./preview-section.component.scss'],
})
export class PreviewSectionComponent implements OnInit {
  @Input() item: Item;

  listOfFiles: BehaviorSubject<MetadataBitstream[]> = new BehaviorSubject<MetadataBitstream[]>([] as any);

  constructor(protected registryService: RegistryService) {} // Modified

  ngOnInit(): void {
    this.registryService
      .getMetadataBitstream(this.item.handle, 'ORIGINAL,TEXT,THUMBNAIL')
      .pipe(getAllSucceededRemoteListPayload())
      .subscribe((data: MetadataBitstream[]) => {
        this.listOfFiles.next(data);
      });
  }
}
