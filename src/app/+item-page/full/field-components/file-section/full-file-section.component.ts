import { Component, Injector, Input, OnInit } from '@angular/core';
import { combineLatest as observableCombineLatest, Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { BitstreamDataService } from '../../../../core/data/bitstream-data.service';

import { Bitstream } from '../../../../core/shared/bitstream.model';
import { Item } from '../../../../core/shared/item.model';
import { getFirstSucceededRemoteListPayload } from '../../../../core/shared/operators';
import { followLink } from '../../../../shared/utils/follow-link-config.model';
import { FileSectionComponent } from '../../../simple/field-components/file-section/file-section.component';

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

  bitstreams$: Observable<Bitstream[]>;

  constructor(
    bitstreamDataService: BitstreamDataService
  ) {
    super(bitstreamDataService);
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  initialize(): void {
    // TODO pagination
    const originals$ = this.bitstreamDataService.findAllByItemAndBundleName(
      this.item,
      'ORIGINAL',
      { elementsPerPage: Number.MAX_SAFE_INTEGER },
      followLink( 'format')
    ).pipe(
      getFirstSucceededRemoteListPayload(),
      startWith([])
    );
    const licenses$ = this.bitstreamDataService.findAllByItemAndBundleName(
      this.item,
      'LICENSE',
      { elementsPerPage: Number.MAX_SAFE_INTEGER },
      followLink( 'format')
    ).pipe(
      getFirstSucceededRemoteListPayload(),
      startWith([])
    );
    this.bitstreams$ = observableCombineLatest(originals$, licenses$).pipe(
      map(([o, l]) => [...o, ...l]),
      map((files: Bitstream[]) =>
        files.map(
          (original) => {
            original.thumbnail = this.bitstreamDataService.getMatchingThumbnail(this.item, original);
            return original;
          }
        )
      )
    );
  }

}
