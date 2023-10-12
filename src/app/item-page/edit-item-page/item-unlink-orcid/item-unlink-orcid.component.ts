import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { RemoteData } from '../../../core/data/remote-data';
import { Item } from '../../../core/shared/item.model';
import { getAllSucceededRemoteDataPayload, getFirstSucceededRemoteData } from '../../../core/shared/operators';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { getItemEditRoute, getItemPageRoute } from '../../item-page-routing-paths';
import { OrcidAuthService } from '../../../core/orcid/orcid-auth.service';

/**
 * Page component for unlink a profile item from ORCID.
 */
@Component({
  selector: 'ds-item-unlink-orcid',
  templateUrl: './item-unlink-orcid.component.html',
})
 export class ItemUnlinkOrcidComponent implements OnInit {

  itemRD$: Observable<RemoteData<Item>>;
  item: Item;

  /**
   * Route to the item's page
   */
  itemPageRoute$: Observable<string>;

  processing = false;

  constructor(
    private notificationsService: NotificationsService,
    private orcidAuthService: OrcidAuthService,
    private route: ActivatedRoute,
    private router: Router,
    private translateService: TranslateService) {

  }

  ngOnInit(): void {
    this.itemRD$ = this.route.data.pipe(
      map((data) => data.dso),
      getFirstSucceededRemoteData()
    ) as Observable<RemoteData<Item>>;

    this.itemPageRoute$ = this.itemRD$.pipe(
      getAllSucceededRemoteDataPayload(),
      map((item) => getItemPageRoute(item))
    );

    this.itemRD$.subscribe((rd) => {
        this.item = rd.payload;
      }
    );
  }

  isLinkedToOrcid(): boolean {
    return this.orcidAuthService.isLinkedToOrcid(this.item);
  }

  unlinkOrcid(): void {
    this.processing = true;
    this.orcidAuthService.unlinkOrcidByItem(this.item).subscribe((remoteData) => {
      this.processing = false;
      if (remoteData.isSuccess) {
        this.notificationsService.success(this.translateService.get('item.edit.unlink-orcid.unlink.success'));
        this.router.navigateByUrl(getItemEditRoute(this.item));
      } else {
        this.notificationsService.error(this.translateService.get('item.edit.unlink-orcid.unlink.error'));
      }
    });
  }

 }
