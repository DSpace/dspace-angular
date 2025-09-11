import {
  AsyncPipe,
  KeyValuePipe,
  Location,
} from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import {
  ActivatedRoute,
  Data,
  Router,
  RouterLink,
} from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import {
  BehaviorSubject,
  Observable,
} from 'rxjs';
import {
  filter,
  map,
} from 'rxjs/operators';

import { NotifyInfoService } from '../../core/coar-notify/notify-info/notify-info.service';
import { AuthorizationDataService } from '../../core/data/feature-authorization/authorization-data.service';
import { ItemDataService } from '../../core/data/item-data.service';
import { RemoteData } from '../../core/data/remote-data';
import { SignpostingDataService } from '../../core/data/signposting-data.service';
import { LinkHeadService } from '../../core/services/link-head.service';
import { ServerResponseService } from '../../core/services/server-response.service';
import { Item } from '../../core/shared/item.model';
import { MetadataMap } from '../../core/shared/metadata.models';
import { fadeInOut } from '../../shared/animations/fade';
import { DsoEditMenuComponent } from '../../shared/dso-page/dso-edit-menu/dso-edit-menu.component';
import { hasValue } from '../../shared/empty.util';
import { ErrorComponent } from '../../shared/error/error.component';
import { ThemedLoadingComponent } from '../../shared/loading/themed-loading.component';
import { VarDirective } from '../../shared/utils/var.directive';
import { ThemedItemAlertsComponent } from '../alerts/themed-item-alerts.component';
import { CollectionsComponent } from '../field-components/collections/collections.component';
import { ThemedItemPageTitleFieldComponent } from '../simple/field-components/specific-field/title/themed-item-page-field.component';
import { ItemPageComponent } from '../simple/item-page.component';
import { ItemVersionsComponent } from '../versions/item-versions.component';
import { ItemVersionsNoticeComponent } from '../versions/notice/item-versions-notice.component';
import { ThemedFullFileSectionComponent } from './field-components/file-section/themed-full-file-section.component';

/**
 * This component renders a full item page.
 * The route parameter 'id' is used to request the item it represents.
 */

@Component({
  selector: 'ds-base-full-item-page',
  styleUrls: ['./full-item-page.component.scss'],
  templateUrl: './full-item-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInOut],
  imports: [
    AsyncPipe,
    CollectionsComponent,
    DsoEditMenuComponent,
    ErrorComponent,
    ItemVersionsComponent,
    ItemVersionsNoticeComponent,
    KeyValuePipe,
    RouterLink,
    ThemedFullFileSectionComponent,
    ThemedItemAlertsComponent,
    ThemedItemPageTitleFieldComponent,
    ThemedLoadingComponent,
    TranslateModule,
    VarDirective,
  ],
  standalone: true,
})
export class FullItemPageComponent extends ItemPageComponent implements OnInit, OnDestroy {

  itemRD$: BehaviorSubject<RemoteData<Item>>;

  metadata$: Observable<MetadataMap>;

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
    protected signpostingDataService: SignpostingDataService,
    protected linkHeadService: LinkHeadService,
    protected notifyInfoService: NotifyInfoService,
    @Inject(PLATFORM_ID) protected platformId: string,
  ) {
    super(route, router, items, authorizationService, responseService, signpostingDataService, linkHeadService, notifyInfoService, platformId);
  }

  /*** AoT inheritance fix, will hopefully be resolved in the near future **/
  ngOnInit(): void {
    super.ngOnInit();
    this.metadata$ = this.itemRD$.pipe(
      map((rd: RemoteData<Item>) => rd.payload),
      filter((item: Item) => hasValue(item)),
      map((item: Item) => item.metadata));

    this.subs.push(this.route.data.subscribe((data: Data) => {
      this.fromSubmissionObject = hasValue(data.wfi) || hasValue(data.wsi);
    }),
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
  }
}
