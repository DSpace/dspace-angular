import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, combineLatest as observableCombineLatest, Observable, zip } from 'rxjs';
import { RemoteData } from '../../../core/data/remote-data';
import { PaginatedList } from '../../../core/data/paginated-list';
import { PaginationComponentOptions } from '../../../shared/pagination/pagination-component-options.model';
import { BitstreamFormat } from '../../../core/shared/bitstream-format.model';
import { BitstreamFormatDataService } from '../../../core/data/bitstream-format-data.service';
import { FindListOptions } from '../../../core/data/request.models';
import { map, switchMap, take } from 'rxjs/operators';
import { hasValue } from '../../../shared/empty.util';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { RestResponse } from '../../../core/cache/response.models';

/**
 * This component renders a list of bitstream formats
 */
@Component({
  selector: 'ds-bitstream-formats',
  templateUrl: './bitstream-formats.component.html'
})
export class BitstreamFormatsComponent implements OnInit {

  /**
   * A paginated list of bitstream formats to be shown on the page
   */
  bitstreamFormats: Observable<RemoteData<PaginatedList<BitstreamFormat>>>;

  /**
   * A BehaviourSubject that keeps track of the pageState used to update the currently displayed bitstreamFormats
   */
  pageState: BehaviorSubject<string>;

  /**
   * The current pagination configuration for the page used by the FindAll method
   * Currently simply renders all bitstream formats
   */
  config: FindListOptions = Object.assign(new FindListOptions(), {
    elementsPerPage: 20
  });

  /**
   * The current pagination configuration for the page
   * Currently simply renders all bitstream formats
   */
  pageConfig: PaginationComponentOptions = Object.assign(new PaginationComponentOptions(), {
    id: 'registry-bitstreamformats-pagination',
    pageSize: 20
  });

  constructor(private notificationsService: NotificationsService,
              private router: Router,
              private translateService: TranslateService,
              private bitstreamFormatService: BitstreamFormatDataService) {
  }

  /**
   * Deletes the currently selected formats from the registry and updates the presented list
   */
  deleteFormats() {
    this.bitstreamFormatService.clearBitStreamFormatRequests().subscribe();
    this.bitstreamFormatService.getSelectedBitstreamFormats().pipe(take(1)).subscribe(
      (formats) => {
        const tasks$ = [];
        for (const format of formats) {
          if (hasValue(format.id)) {
            tasks$.push(this.bitstreamFormatService.delete(format.id).pipe(map((response: RestResponse) => response.isSuccessful)));
          }
        }
        zip(...tasks$).subscribe((results: boolean[]) => {
          const successResponses = results.filter((result: boolean) => result);
          const failedResponses = results.filter((result: boolean) => !result);
          if (successResponses.length > 0) {
            this.showNotification(true, successResponses.length);
          }
          if (failedResponses.length > 0) {
            this.showNotification(false, failedResponses.length);
          }

          this.deselectAll();

          this.router.navigate([], {
            queryParams: Object.assign({}, { page: 1 }),
            queryParamsHandling: 'merge'
          });        });
      }
    );
  }

  /**
   * Deselects all selecetd bitstream formats
   */
  deselectAll() {
    this.bitstreamFormatService.deselectAllBitstreamFormats();
  }

  /**
   * Checks whether a given bitstream format is selected in the list (checkbox)
   * @param bitstreamFormat
   */
  isSelected(bitstreamFormat: BitstreamFormat): Observable<boolean> {
    return this.bitstreamFormatService.getSelectedBitstreamFormats().pipe(
      map((bitstreamFormats: BitstreamFormat[]) => {
        return bitstreamFormats.find((selectedFormat) => selectedFormat.id === bitstreamFormat.id) != null;
      })
    );
  }

  /**
   * Selects or deselects a bitstream format based on the checkbox state
   * @param bitstreamFormat
   * @param event
   */
  selectBitStreamFormat(bitstreamFormat: BitstreamFormat, event) {
    event.target.checked ?
      this.bitstreamFormatService.selectBitstreamFormat(bitstreamFormat) :
      this.bitstreamFormatService.deselectBitstreamFormat(bitstreamFormat);
  }

  /**
   * Show notifications for an amount of deleted bitstream formats
   * @param success   Whether or not the notification should be a success message (error message when false)
   * @param amount    The amount of deleted bitstream formats
   */
  private showNotification(success: boolean, amount: number) {
    const prefix = 'admin.registries.bitstream-formats.delete';
    const suffix = success ? 'success' : 'failure';

    const messages = observableCombineLatest(
      this.translateService.get(`${prefix}.${suffix}.head`),
      this.translateService.get(`${prefix}.${suffix}.amount`, {amount: amount})
    );
    messages.subscribe(([head, content]) => {

      if (success) {
        this.notificationsService.success(head, content);
      } else {
        this.notificationsService.error(head, content);
      }
    });
  }

  /**
   * When the page is changed, make sure to update the list of bitstreams to match the new page
   * @param event The page change event
   */
  onPageChange(event) {
    this.config = Object.assign(new FindListOptions(), this.config, {
      currentPage: event,
    });
    this.pageConfig.currentPage = event;
    this.pageState.next('pageChange');
  }

  ngOnInit(): void {
    this.pageState = new BehaviorSubject('init');
    this.bitstreamFormats = this.pageState.pipe(
      switchMap(() => {
        return this.updateFormats()
          ;
      }));
  }

  /**
   * Finds all formats based on the current config
   */
  private updateFormats() {
    return this.bitstreamFormatService.findAll(this.config);
  }
}
