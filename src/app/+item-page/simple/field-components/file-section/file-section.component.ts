import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { BitstreamDataService } from '../../../../core/data/bitstream-data.service';

import { Bitstream } from '../../../../core/shared/bitstream.model';
import { Item } from '../../../../core/shared/item.model';
import { filter, takeWhile } from 'rxjs/operators';
import { RemoteData } from '../../../../core/data/remote-data';
import { hasNoValue, hasValue } from '../../../../shared/empty.util';
import { PaginatedList } from '../../../../core/data/paginated-list';

/**
 * This component renders the file section of the item
 * inside a 'ds-metadata-field-wrapper' component.
 */
@Component({
  selector: 'ds-item-page-file-section',
  templateUrl: './file-section.component.html'
})
export class FileSectionComponent implements OnInit {

  @Input() item: Item;

  label = 'item.page.files';

  separator = '<br/>';

  bitstreams$: BehaviorSubject<Bitstream[]>;

  currentPage: number;

  isLoading: boolean;

  isLastPage: boolean;

  pageSize = 5;

  constructor(
    protected bitstreamDataService: BitstreamDataService
  ) {
  }

  ngOnInit(): void {
    this.getNextPage();
  }

  /**
   * This method will retrieve the next page of Bitstreams from the external BitstreamDataService call.
   * It'll retrieve the currentPage from the class variables and it'll add the next page of bitstreams with the
   * already existing one.
   * If the currentPage variable is undefined, we'll set it to 1 and retrieve the first page of Bitstreams
   */
  getNextPage(): void {
    this.isLoading = true;
    if (this.currentPage === undefined) {
      this.currentPage = 1;
      this.bitstreams$ = new BehaviorSubject([]);
    } else {
      this.currentPage++;
    }
    this.bitstreamDataService.findAllByItemAndBundleName(this.item, 'ORIGINAL', { currentPage: this.currentPage, elementsPerPage: this.pageSize }).pipe(
        filter((bitstreamsRD: RemoteData<PaginatedList<Bitstream>>) => hasValue(bitstreamsRD)),
        takeWhile((bitstreamsRD: RemoteData<PaginatedList<Bitstream>>) => hasNoValue(bitstreamsRD.payload) && hasNoValue(bitstreamsRD.error), true)
    ).subscribe((bitstreamsRD: RemoteData<PaginatedList<Bitstream>>) => {
      const current: Bitstream[] = this.bitstreams$.getValue();
      this.bitstreams$.next([...current, ...bitstreamsRD.payload.page]);
      this.isLoading = false;
      this.isLastPage = this.currentPage === bitstreamsRD.payload.totalPages;
    });
  }
}
