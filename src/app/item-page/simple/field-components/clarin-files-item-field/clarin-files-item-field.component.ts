import { Component, Input, OnInit } from '@angular/core';
import { Item } from '../../../../core/shared/item.model';
import { BehaviorSubject } from 'rxjs';
import { Bitstream } from '../../../../core/shared/bitstream.model';
import { BitstreamDataService } from '../../../../core/data/bitstream-data.service';
import { NotificationsService } from '../../../../shared/notifications/notifications.service';
import { TranslateService } from '@ngx-translate/core';
import { getFirstCompletedRemoteData } from '../../../../core/shared/operators';
import { RemoteData } from '../../../../core/data/remote-data';
import { PaginatedList } from '../../../../core/data/paginated-list.model';
import { hasValue } from '../../../../shared/empty.util';

@Component({
  selector: 'ds-clarin-files-item-field',
  templateUrl: './clarin-files-item-field.component.html',
  styleUrls: ['./clarin-files-item-field.component.scss']
})
export class ClarinFilesItemFieldComponent implements OnInit {

  /**
   * The item to display metadata for
   */
  @Input() item: Item;

  /**
   * Fontawesome v5. icon name with default settings.
   */
  @Input() iconName: string;

  /**
   * Separator string between multiple values of the metadata fields defined
   * @type {string}
   */
  @Input() separator: string;

  /**
   * Name of the metadata field.
   */
  label = 'item.page.files';

  bitstreams$: BehaviorSubject<Bitstream[]>;

  currentPage: number;

  isLoading: boolean;

  isLastPage: boolean;

  pageSize = 5;

  constructor(
    protected bitstreamDataService: BitstreamDataService,
    protected notificationsService: NotificationsService,
    protected translateService: TranslateService
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
    this.bitstreamDataService.findAllByItemAndBundleName(this.item, 'ORIGINAL', {
      currentPage: this.currentPage,
      elementsPerPage: this.pageSize
    }).pipe(
      getFirstCompletedRemoteData(),
    ).subscribe((bitstreamsRD: RemoteData<PaginatedList<Bitstream>>) => {
      if (bitstreamsRD.errorMessage) {
        this.notificationsService.error(this.translateService.get('file-section.error.header'), `${bitstreamsRD.statusCode} ${bitstreamsRD.errorMessage}`);
      } else if (hasValue(bitstreamsRD.payload)) {
        const current: Bitstream[] = this.bitstreams$.getValue();
        this.bitstreams$.next([...current, ...bitstreamsRD.payload.page]);
        this.isLoading = false;
        this.isLastPage = this.currentPage === bitstreamsRD.payload.totalPages;
      }
    });
  }
}
