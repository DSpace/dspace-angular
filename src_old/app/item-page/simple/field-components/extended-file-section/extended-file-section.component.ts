import { AsyncPipe } from '@angular/common';
import {
  Component,
  Inject,
  Input,
  OnInit,
} from '@angular/core';
import {
  APP_CONFIG,
  AppConfig,
} from '@dspace/config/app-config.interface';
import { DSONameService } from '@dspace/core/breadcrumbs/dso-name.service';
import { BitstreamDataService } from '@dspace/core/data/bitstream-data.service';
import { BitstreamFormatDataService } from '@dspace/core/data/bitstream-format-data.service';
import { PaginatedList } from '@dspace/core/data/paginated-list.model';
import { RemoteData } from '@dspace/core/data/remote-data';
import { PaginationService } from '@dspace/core/pagination/pagination.service';
import { PaginationComponentOptions } from '@dspace/core/pagination/pagination-component-options.model';
import { Bitstream } from '@dspace/core/shared/bitstream.model';
import { followLink } from '@dspace/core/shared/follow-link-config.model';
import { Item } from '@dspace/core/shared/item.model';
import { TranslateModule } from '@ngx-translate/core';
import {
  from,
  Observable,
} from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { ThemedFileDownloadLinkComponent } from '../../../../shared/file-download-link/themed-file-download-link.component';
import { PaginationComponent } from '../../../../shared/pagination/pagination.component';
import { FileSizePipe } from '../../../../shared/utils/file-size-pipe';
import { VarDirective } from '../../../../shared/utils/var.directive';

@Component({
  selector: 'ds-extended-file-section',
  imports: [
    AsyncPipe,
    FileSizePipe,
    PaginationComponent,
    ThemedFileDownloadLinkComponent,
    TranslateModule,
    VarDirective,
  ],
  templateUrl: './extended-file-section.component.html',
  styleUrl: './extended-file-section.component.scss',
})
export class ExtendedFileSectionComponent implements OnInit {

  @Input() item: Item;

  @Input() bundleName = 'ORIGINAL';

  @Input() label = 'item.page.extended-file-section';

  bitstreamsRD$: Observable<RemoteData<PaginatedList<Bitstream>>>;

  pageSize = this.appConfig.item.bitstream.pageSize;


  /**
   * The current pagination configuration for the page
   */
  pageConfig: PaginationComponentOptions = Object.assign(new PaginationComponentOptions(), {
    id: 'efs',
    currentPage: 1,
    pageSize: this.appConfig.item.bitstream.pageSize,
  });


  constructor(
    protected bitstreamDataService: BitstreamDataService,
    protected bitstreamFormatDataService: BitstreamFormatDataService,
    public dsoNameService: DSONameService,
    @Inject(APP_CONFIG) protected appConfig: AppConfig,
    private paginationService: PaginationService,
  ) {
    this.bitstreamsRD$ = from([]);
  }

  ngOnInit(): void {
    this.bitstreamsRD$ = this.paginationService.getCurrentPagination(this.pageConfig.id, this.pageConfig).pipe(
      switchMap((options: PaginationComponentOptions) => {
        return this.bitstreamDataService.findAllByItemAndBundleName(
          this.item,
          this.bundleName,
          { elementsPerPage: options.pageSize, currentPage: options.currentPage },
          true,
          true,
          followLink('format'),
          followLink('accessStatus'),
        );
      }),
    );
  }


}
