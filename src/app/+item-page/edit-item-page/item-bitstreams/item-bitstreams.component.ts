import { Component, OnDestroy } from '@angular/core';
import { AbstractItemUpdateComponent } from '../abstract-item-update/abstract-item-update.component';
import { switchMap, take } from 'rxjs/operators';
import { Bitstream } from '../../../core/shared/bitstream.model';
import { getBundleNames, toBitstreamsArray, toBundleMap } from '../../../core/shared/item-bitstreams-utils';
import { Observable } from 'rxjs/internal/Observable';
import { FieldUpdates } from '../../../core/data/object-updates/object-updates.reducer';
import { Subscription } from 'rxjs/internal/Subscription';

@Component({
  selector: 'ds-item-bitstreams',
  styleUrls: ['./item-bitstreams.component.scss'],
  templateUrl: './item-bitstreams.component.html',
})
/**
 * Component for displaying an item's bitstreams edit page
 */
export class ItemBitstreamsComponent extends AbstractItemUpdateComponent implements OnDestroy {

  bundleNames$: Observable<string[]>;

  updatesMap: Map<string, Observable<FieldUpdates>>;

  updatesMapSub: Subscription;

  /**
   * Set up and initialize all fields
   */
  ngOnInit(): void {
    super.ngOnInit();
    this.bundleNames$ = this.item.bitstreams.pipe(getBundleNames());
  }

  initializeNotificationsPrefix(): void {
    this.notificationsPrefix = 'item.edit.bitstreams.notifications.';
  }

  initializeOriginalFields(): void {
    this.item.bitstreams.pipe(
      toBitstreamsArray(),
      take(1)
    ).subscribe((bitstreams: Bitstream[]) => {
      this.objectUpdatesService.initialize(this.url, bitstreams, this.item.lastModified);
    });
  }

  initializeUpdates(): void {
    this.updates$ = this.item.bitstreams.pipe(
      toBitstreamsArray(),
      switchMap((bitstreams: Bitstream[]) => this.objectUpdatesService.getFieldUpdates(this.url, bitstreams))
    );
    this.updatesMapSub = this.item.bitstreams.pipe(
      toBundleMap()
    ).subscribe((bundleMap: Map<string, Bitstream[]>) => {
      const updatesMap = new Map();
      bundleMap.forEach((bitstreams: Bitstream[], bundleName: string) => {
        updatesMap.set(bundleName, this.objectUpdatesService.getFieldUpdatesExclusive(this.url, bitstreams));
      });
      this.updatesMap = updatesMap;
    });
  }

  submit() {
    // TODO: submit changes
  }

  ngOnDestroy(): void {
    this.updatesMapSub.unsubscribe();
  }
}
