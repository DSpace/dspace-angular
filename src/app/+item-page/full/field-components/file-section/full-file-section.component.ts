import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { BitstreamDataService } from '../../../../core/data/bitstream-data.service';

import { Bitstream } from '../../../../core/shared/bitstream.model';
import { Item } from '../../../../core/shared/item.model';
import { followLink } from '../../../../shared/utils/follow-link-config.model';
import { FileSectionComponent } from '../../../simple/field-components/file-section/file-section.component';
import { PaginationComponentOptions } from '../../../../shared/pagination/pagination-component-options.model';
import { PaginatedList } from '../../../../core/data/paginated-list';
import { RemoteData } from '../../../../core/data/remote-data';
import { switchMap } from 'rxjs/operators';

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

  originals$: Observable<RemoteData<PaginatedList<Bitstream>>>;
  licenses$: Observable<RemoteData<PaginatedList<Bitstream>>>;

  pageSize = 5;
  originalOptions = Object.assign(new PaginationComponentOptions(),{
    id: 'original-bitstreams-options',
    currentPage: 1,
    pageSize: this.pageSize
  });
  originalCurrentPage$ = new BehaviorSubject<number>(1);

  licenseOptions = Object.assign(new PaginationComponentOptions(),{
    id: 'license-bitstreams-options',
    currentPage: 1,
    pageSize: this.pageSize
  });
  licenseCurrentPage$ = new BehaviorSubject<number>(1);

  constructor(
    bitstreamDataService: BitstreamDataService
  ) {
    super(bitstreamDataService);
  }

  ngOnInit(): void {
    this.initialize();
  }

  initialize(): void {
    this.originals$ = this.originalCurrentPage$.pipe(
        switchMap((pageNumber: number) => this.bitstreamDataService.findAllByItemAndBundleName(
            this.item,
            'ORIGINAL',
            { elementsPerPage: this.pageSize, currentPage: pageNumber },
            followLink( 'format')
        ))
    );

    this.licenses$ = this.licenseCurrentPage$.pipe(
        switchMap((pageNumber: number) => this.bitstreamDataService.findAllByItemAndBundleName(
            this.item,
            'LICENSE',
            { elementsPerPage: this.pageSize, currentPage: pageNumber },
            followLink( 'format')
        ))
    );

  }

  /**
   * Update the current page for the original bundle bitstreams
   * @param page
   */
  switchOriginalPage(page: number) {
    this.originalOptions.currentPage = page;
    this.originalCurrentPage$.next(page);
  }

  /**
   * Update the current page for the license bundle bitstreams
   * @param page
   */
  switchLicensePage(page: number) {
    this.licenseOptions.currentPage = page;
    this.licenseCurrentPage$.next(page);
  }
}
