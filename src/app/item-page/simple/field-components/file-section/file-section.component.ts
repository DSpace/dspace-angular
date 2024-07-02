import { CommonModule } from '@angular/common';
import {
  Component,
  Inject,
  Input,
  OnInit,
} from '@angular/core';
import {
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';
import {
  APP_CONFIG,
  AppConfig,
} from 'src/config/app-config.interface';

import { DSONameService } from '../../../../core/breadcrumbs/dso-name.service';
import { BitstreamDataService } from '../../../../core/data/bitstream-data.service';
import { PaginatedList } from '../../../../core/data/paginated-list.model';
import { RemoteData } from '../../../../core/data/remote-data';
import { Bitstream } from '../../../../core/shared/bitstream.model';
import { Item } from '../../../../core/shared/item.model';
import { getFirstCompletedRemoteData } from '../../../../core/shared/operators';
import { hasValue } from '../../../../shared/empty.util';
import { ThemedFileDownloadLinkComponent } from '../../../../shared/file-download-link/themed-file-download-link.component';
import { ThemedLoadingComponent } from '../../../../shared/loading/themed-loading.component';
import { MetadataFieldWrapperComponent } from '../../../../shared/metadata-field-wrapper/metadata-field-wrapper.component';
import { NotificationsService } from '../../../../shared/notifications/notifications.service';
import { FileSizePipe } from '../../../../shared/utils/file-size-pipe';
import { VarDirective } from '../../../../shared/utils/var.directive';

/**
 * This component renders the file section of the item
 * inside a 'ds-metadata-field-wrapper' component.
 */
@Component({
  selector: 'ds-base-item-page-file-section',
  templateUrl: './file-section.component.html',
  imports: [
    CommonModule,
    ThemedFileDownloadLinkComponent,
    MetadataFieldWrapperComponent,
    ThemedLoadingComponent,
    TranslateModule,
    FileSizePipe,
    VarDirective,
  ],
  standalone: true,
})
export class FileSectionComponent implements OnInit {

  @Input() item: Item;

  label = 'item.page.files';

  separator = '<br/>';

  bitstreams$: BehaviorSubject<Bitstream[]>;

  currentPage: number;

  isLoading: boolean;

  isLastPage: boolean;

  pageSize: number;

  primaryBitsreamId: string;

  constructor(
    protected bitstreamDataService: BitstreamDataService,
    protected notificationsService: NotificationsService,
    protected translateService: TranslateService,
    public dsoNameService: DSONameService,
    @Inject(APP_CONFIG) protected appConfig: AppConfig,
  ) {
    this.pageSize = this.appConfig.item.bitstream.pageSize;
  }

  ngOnInit(): void {
    this.getPrimaryBitstreamId();
    this.getNextPage();
  }

  private getPrimaryBitstreamId() {
    this.bitstreamDataService.findPrimaryBitstreamByItemAndName(this.item, 'ORIGINAL', true, true).subscribe((primaryBitstream: Bitstream | null) => {
      if (!primaryBitstream) {
        return;
      }
      this.primaryBitsreamId = primaryBitstream?.id;
    });
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
      elementsPerPage: this.pageSize,
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
