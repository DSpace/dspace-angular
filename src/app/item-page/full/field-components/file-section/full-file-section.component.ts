import { AsyncPipe } from '@angular/common';
import {
  Component,
  Inject,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  APP_CONFIG,
  AppConfig,
} from '@dspace/config/app-config.interface';
import { DSONameService } from '@dspace/core/breadcrumbs/dso-name.service';
import { BitstreamDataService } from '@dspace/core/data/bitstream-data.service';
import { PaginatedList } from '@dspace/core/data/paginated-list.model';
import { RemoteData } from '@dspace/core/data/remote-data';
import { NotificationsService } from '@dspace/core/notification-system/notifications.service';
import { PaginationService } from '@dspace/core/pagination/pagination.service';
import { PaginationComponentOptions } from '@dspace/core/pagination/pagination-component-options.model';
import { Bitstream } from '@dspace/core/shared/bitstream.model';
import { followLink } from '@dspace/core/shared/follow-link-config.model';
import { Item } from '@dspace/core/shared/item.model';
import {
  hasValue,
  isEmpty,
} from '@dspace/shared/utils/empty.util';
import {
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import { Observable } from 'rxjs';
import {
  switchMap,
  tap,
} from 'rxjs/operators';

import { ThemedFileDownloadLinkComponent } from '../../../../shared/file-download-link/themed-file-download-link.component';
import { MetadataFieldWrapperComponent } from '../../../../shared/metadata-field-wrapper/metadata-field-wrapper.component';
import { PaginationComponent } from '../../../../shared/pagination/pagination.component';
import { FileSizePipe } from '../../../../shared/utils/file-size-pipe';
import { VarDirective } from '../../../../shared/utils/var.directive';
import { ThemedThumbnailComponent } from '../../../../thumbnail/themed-thumbnail.component';
import { FileSectionComponent } from '../../../simple/field-components/file-section/file-section.component';

/**
 * This component renders the file section of the item
 * inside a 'ds-metadata-field-wrapper' component.
 */

@Component({
  selector: 'ds-base-item-page-full-file-section',
  styleUrls: ['./full-file-section.component.scss'],
  templateUrl: './full-file-section.component.html',
  imports: [
    AsyncPipe,
    FileSizePipe,
    MetadataFieldWrapperComponent,
    PaginationComponent,
    ThemedFileDownloadLinkComponent,
    ThemedThumbnailComponent,
    TranslateModule,
    VarDirective,
  ],
  standalone: true,
})
export class FullFileSectionComponent extends FileSectionComponent implements OnDestroy, OnInit {

  @Input() item: Item;

  label: string;

  originals$: Observable<RemoteData<PaginatedList<Bitstream>>>;
  licenses$: Observable<RemoteData<PaginatedList<Bitstream>>>;

  originalOptions = Object.assign(new PaginationComponentOptions(), {
    id: 'obo',
    currentPage: 1,
    pageSize: this.appConfig.item.bitstream.pageSize,
  });

  licenseOptions = Object.assign(new PaginationComponentOptions(), {
    id: 'lbo',
    currentPage: 1,
    pageSize: this.appConfig.item.bitstream.pageSize,
  });

  constructor(
    bitstreamDataService: BitstreamDataService,
    protected notificationsService: NotificationsService,
    protected translateService: TranslateService,
    protected paginationService: PaginationService,
    public dsoNameService: DSONameService,
    @Inject(APP_CONFIG) protected appConfig: AppConfig,
  ) {
    super(bitstreamDataService, notificationsService, translateService, dsoNameService, appConfig);
  }

  ngOnInit(): void {
    this.initialize();
  }

  initialize(): void {
    this.originals$ = this.paginationService.getCurrentPagination(this.originalOptions.id, this.originalOptions).pipe(
      switchMap((options: PaginationComponentOptions) => this.bitstreamDataService.findAllByItemAndBundleName(
        this.item,
        'ORIGINAL',
        { elementsPerPage: options.pageSize, currentPage: options.currentPage },
        true,
        true,
        followLink('format'),
        followLink('thumbnail'),
        followLink('accessStatus'),
      )),
      tap((rd: RemoteData<PaginatedList<Bitstream>>) => {
        if (hasValue(rd.errorMessage)) {
          this.notificationsService.error(this.translateService.get('file-section.error.header'), `${rd.statusCode} ${rd.errorMessage}`);
        }
      },
      ),
    );

    this.licenses$ = this.paginationService.getCurrentPagination(this.licenseOptions.id, this.licenseOptions).pipe(
      switchMap((options: PaginationComponentOptions) => this.bitstreamDataService.findAllByItemAndBundleName(
        this.item,
        'LICENSE',
        { elementsPerPage: options.pageSize, currentPage: options.currentPage },
        true,
        true,
        followLink('format'),
        followLink('thumbnail'),
        followLink('accessStatus'),
      )),
      tap((rd: RemoteData<PaginatedList<Bitstream>>) => {
        if (hasValue(rd.errorMessage)) {
          this.notificationsService.error(this.translateService.get('file-section.error.header'), `${rd.statusCode} ${rd.errorMessage}`);
        }
      },
      ),
    );

  }

  hasValuesInBundle(bundle: PaginatedList<Bitstream>) {
    return hasValue(bundle) && !isEmpty(bundle.page);
  }

  ngOnDestroy(): void {
    this.paginationService.clearPagination(this.originalOptions.id);
    this.paginationService.clearPagination(this.licenseOptions.id);
  }

}
