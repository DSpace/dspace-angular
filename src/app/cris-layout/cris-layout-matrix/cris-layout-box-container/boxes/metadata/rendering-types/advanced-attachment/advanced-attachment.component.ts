import { FindListOptions } from './../../../../../../../core/data/request.models';
import { environment } from './../../../../../../../../environments/environment';
import { FeatureID } from './../../../../../../../core/data/feature-authorization/feature-id';
import { AuthorizationDataService } from './../../../../../../../core/data/feature-authorization/authorization-data.service';
import { Component, Inject, OnInit } from '@angular/core';

import { Observable, combineLatest as observableCombineLatest, BehaviorSubject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

import { FieldRenderingType, MetadataBoxFieldRendering } from '../metadata-box.decorator';
import { BitstreamRenderingModelComponent } from '../bitstream-rendering-model';
import { BitstreamDataService } from '../../../../../../../core/data/bitstream-data.service';
import { Bitstream } from '../../../../../../../core/shared/bitstream.model';
import { Item } from '../../../../../../../core/shared/item.model';
import { LayoutField } from '../../../../../../../core/layout/models/box.model';
import { getBitstreamDownloadRoute, getBitstreamRequestACopyRoute } from '../../../../../../../app-routing-paths';
import { map } from 'rxjs/operators';


@Component({
  selector: 'ds-advanced-attachment',
  templateUrl: './advanced-attachment.component.html',
  styleUrls: ['./advanced-attachment.component.scss']
})
/**
 * This component renders the attachment with an advanced layout.
 */
@MetadataBoxFieldRendering(FieldRenderingType.ADVANCEDATTACHMENT, true)
export class AdvancedAttachmentComponent extends BitstreamRenderingModelComponent implements OnInit {


  /**
   * List of bitstreams to show in the list
   */
  bitstreams$: Observable<Bitstream[]>;

  /**
   * List of all bitstreams that belong to the item
   */
  allBitstreams$: BehaviorSubject<Bitstream[]> = new BehaviorSubject<Bitstream[]>([]);

  /**
   * Pagination configuration as FindOptionList for future api pagination implementation
   */
  config: FindListOptions = Object.assign(new FindListOptions(), {
    elementsPerPage: environment.attachmentPagination.perPage,
    currentPage: 1
  });

  /**
   * If the list should show view more button
   */
  canViewMore = false;

  /**
  * Total number of pages available
  */
  totalPages: number = null;

  /**
   * Envoirment variables configuring the fields to be viewed
   */
  envData = environment.advancedAttachment;

  constructor(
    private authorizationService: AuthorizationDataService,
    @Inject('fieldProvider') public fieldProvider: LayoutField,
    @Inject('itemProvider') public itemProvider: Item,
    @Inject('renderingSubTypeProvider') public renderingSubTypeProvider: string,
    protected bitstreamDataService: BitstreamDataService,
    protected translateService: TranslateService
  ) {
    super(fieldProvider, itemProvider, renderingSubTypeProvider, bitstreamDataService, translateService);
  }


  /**
  * On init check if we want to show the attachment list with pagination or show all attachments
  */
  ngOnInit() {
    if (environment.attachmentPagination.pagination) {
      this.startWithPagination();
    } else {
      this.startWithAll();
    }
  }



  /**
   * Get if bitstream can be downloaded
   */
  getCanDownload(bitstream): Observable<boolean> {
    return this.authorizationService.isAuthorized(FeatureID.CanDownload, bitstream.self);
  }


  /**
   * Get if bitstream can be requested as copy
   */
  getCanRequestACopy(bitstream): Observable<boolean> {
    return this.authorizationService.isAuthorized(FeatureID.CanRequestACopy, bitstream.self);
  }


  /**
   * Get the download link
   */
  downloadLink(bitstream: Bitstream) {
    return {
      routerLink: getBitstreamDownloadRoute(bitstream),
      queryParams: {}
    };
  }


  /**
   * Get the request a copy link
   */
  requestACopyLink(bitstream: Bitstream) {
    return getBitstreamRequestACopyRoute(this.item, bitstream);
  }
  /**
   * Start the list with pagination configuration
   */
  startWithPagination() {
    this.getOtherBitstreams();
    this.getBitstreams().subscribe((bitstreams: Bitstream[]) => {
      this.allBitstreams$.next(bitstreams);
      this.totalPages = Math.ceil((bitstreams.length - 1) / this.config.elementsPerPage);
      if (this.totalPages > 1) {
        this.canViewMore = true;
      }
    });
  }

  /**
   * Start the list with all the attachments
   */
  startWithAll() {
    this.bitstreams$ = this.getBitstreams();
  }

  /**
   * When view more is clicked show the next page and check if shold show view more button
   */
  viewMore() {
    this.config.currentPage++;
    this.getOtherBitstreams();
    if (this.config.currentPage === this.totalPages) {
      this.canViewMore = false;
    }
  }

  /**
   * Get the bitstreams until a specific page
   */
  getOtherBitstreams() {
    this.bitstreams$ = this.allBitstreams$.pipe(
      map((bitstreams: Bitstream[]) => {
        return bitstreams.filter((bitstream: Bitstream, index) => {
          return index < this.config.elementsPerPage * this.config.currentPage;
        });
      })
    );
  }

}
