import { Component, Inject, OnDestroy } from '@angular/core';
import { AbstractItemUpdateComponent } from '../abstract-item-update/abstract-item-update.component';
import { map, switchMap, take } from 'rxjs/operators';
import { Bitstream } from '../../../core/shared/bitstream.model';
import { getBundleNames, toBitstreamsArray, toBundleMap } from '../../../core/shared/item-bitstreams-utils';
import { Observable } from 'rxjs/internal/Observable';
import { FieldUpdate, FieldUpdates } from '../../../core/data/object-updates/object-updates.reducer';
import { Subscription } from 'rxjs/internal/Subscription';
import { ItemDataService } from '../../../core/data/item-data.service';
import { ObjectUpdatesService } from '../../../core/data/object-updates/object-updates.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { TranslateService } from '@ngx-translate/core';
import { GLOBAL_CONFIG, GlobalConfig } from '../../../../config';
import { BitstreamDataService } from '../../../core/data/bitstream-data.service';
import { FieldChangeType } from '../../../core/data/object-updates/object-updates.actions';
import { isNotEmptyOperator } from '../../../shared/empty.util';
import { zip as observableZip } from 'rxjs';
import { RestResponse } from '../../../core/cache/response.models';

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

  constructor(
    public itemService: ItemDataService,
    public objectUpdatesService: ObjectUpdatesService,
    public router: Router,
    public notificationsService: NotificationsService,
    public translateService: TranslateService,
    @Inject(GLOBAL_CONFIG) public EnvConfig: GlobalConfig,
    public route: ActivatedRoute,
    public bitstreamService: BitstreamDataService
  ) {
    super(itemService, objectUpdatesService, router, notificationsService, translateService, EnvConfig, route);
  }

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
    const removedBitstreams$ = this.item.bitstreams.pipe(
      toBitstreamsArray(),
      switchMap((bitstreams: Bitstream[]) => this.objectUpdatesService.getFieldUpdatesExclusive(this.url, bitstreams) as Observable<FieldUpdates>),
      map((fieldUpdates: FieldUpdates) => Object.values(fieldUpdates).filter((fieldUpdate: FieldUpdate) => fieldUpdate.changeType === FieldChangeType.REMOVE)),
      map((fieldUpdates: FieldUpdate[]) => fieldUpdates.map((fieldUpdate: FieldUpdate) => fieldUpdate.field)),
      isNotEmptyOperator()
    );
    removedBitstreams$.pipe(
      take(1),
      switchMap((removedBistreams: Bitstream[]) => observableZip(...removedBistreams.map((bitstream: Bitstream) => this.bitstreamService.delete(bitstream))))
    ).subscribe();
  }

  ngOnDestroy(): void {
    this.updatesMapSub.unsubscribe();
  }
}
