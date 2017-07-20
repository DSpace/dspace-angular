import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { Bitstream } from '../../../../core/shared/bitstream.model';
import { Item } from '../../../../core/shared/item.model';
import { FileSectionComponent } from '../../../simple/field-components/file-section/file-section.component';
import { hasValue } from '../../../../shared/empty.util';

/**
 * This component renders the file section of the item
 * inside a 'ds-metadata-field-wrapper' component.
 */

@Component({
  selector: 'ds-item-page-full-file-section',
  styleUrls: ['./full-file-section.component.scss'],
  templateUrl: './full-file-section.component.html'
})
export class FullFileSectionComponent extends FileSectionComponent implements OnInit {

  @Input() item: Item;

  label: string;

  files: Observable<Bitstream[]>;

  thumbnails: Map<string, Observable<Bitstream>> = new Map();

  ngOnInit(): void {
    super.ngOnInit();
  }

  initialize(): void {
    const originals = this.item.getFiles();
    const licenses = this.item.getBitstreamsByBundleName('LICENSE');
    this.files = Observable.combineLatest(originals, licenses, (o, l) => [...o, ...l]);
    this.files.subscribe(
      (files) =>
        files.forEach(
          (original) => {
            const thumbnail: Observable<Bitstream> = this.item.getThumbnailForOriginal(original);
            this.thumbnails.set(original.id, thumbnail);
          }
        )
    )
  }

}
