import { filter, map, tap } from 'rxjs/operators';
import { ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Data, Router } from '@angular/router';

import { BehaviorSubject, Observable } from 'rxjs';

import { ItemPageComponent } from '../simple/item-page.component';
import { MetadataMap } from '../../core/shared/metadata.models';
import { ItemDataService } from '../../core/data/item-data.service';

import { RemoteData } from '../../core/data/remote-data';
import { Item } from '../../core/shared/item.model';

import { fadeInOut } from '../../shared/animations/fade';
import { hasValue } from '../../shared/empty.util';
import { Location } from '@angular/common';
import { AuthorizationDataService } from '../../core/data/feature-authorization/authorization-data.service';
import { ServerResponseService } from '../../core/services/server-response.service';
import { LinkHeadService } from '../../core/services/link-head.service';
import { APP_CONFIG, AppConfig } from '../../../config/app-config.interface';

/**
 * This component renders a full item page.
 * The route parameter 'id' is used to request the item it represents.
 */

@Component({
  selector: 'ds-full-item-page',
  styleUrls: ['./full-item-page.component.scss'],
  templateUrl: './full-item-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInOut]
})
export class FullItemPageComponent extends ItemPageComponent implements OnInit, OnDestroy {

  itemRD$: BehaviorSubject<RemoteData<Item>>;

  metadata$: Observable<MetadataMap>;

  metadataMapLimit$: BehaviorSubject<Map<string, number>> = new BehaviorSubject<Map<string, number>>(new Map<string, number>());

  limitSize = this.appConfig.item.metadataLimit;

  /**
   * True when the itemRD has been originated from its workspaceite/workflowitem, false otherwise.
   */
  fromSubmissionObject = false;

  subs = [];

  constructor(
    protected route: ActivatedRoute,
    protected router: Router,
    protected items: ItemDataService,
    protected authorizationService: AuthorizationDataService,
    protected _location: Location,
    protected responseService: ServerResponseService,
    protected linkHeadService: LinkHeadService,
    @Inject(PLATFORM_ID) protected platformId: string,
    @Inject(APP_CONFIG) private appConfig: AppConfig,
  ) {
    super(route, router, items, authorizationService, responseService, linkHeadService, platformId);
  }

  /*** AoT inheritance fix, will hopefully be resolved in the near future **/
  ngOnInit(): void {
    super.ngOnInit();
    this.metadata$ = this.itemRD$.pipe(
      map((rd: RemoteData<Item>) => rd.payload),
      filter((item: Item) => hasValue(item)),
      map((item: Item) => item.metadata),
      tap((metadataMap: MetadataMap) => this.nextMetadataMapLimit(metadataMap))
     );

    this.subs.push(this.route.data.subscribe((data: Data) => {
        this.fromSubmissionObject = hasValue(data.wfi) || hasValue(data.wsi);
      })
    );
  }

  /**
   * Navigate back in browser history.
   */
  back() {
    this._location.back();
  }

  ngOnDestroy() {
    this.subs.filter((sub) => hasValue(sub)).forEach((sub) => sub.unsubscribe());
    super.ngOnDestroy();
  }

  protected increaseLimit(metadataKey: string) {
    const newMetadataMap: Map<string, number> = new Map(this.metadataMapLimit$.value);
    const newMetadataSize = newMetadataMap.get(metadataKey) + this.limitSize;
    newMetadataMap.set(metadataKey, newMetadataSize);
    this.metadataMapLimit$.next(newMetadataMap);
  }

  protected nextMetadataMapLimit(metadataMap: MetadataMap) {
    const metadataMapLimit: Map<string, number> = new Map(this.metadataMapLimit$.value);
    Object.keys(metadataMap).forEach((key: string) => metadataMapLimit.set(key, this.limitSize));
    this.metadataMapLimit$.next(metadataMapLimit);
  }

}
