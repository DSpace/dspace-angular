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
import { hasValue } from '@dspace/shared/utils/empty.util';
import { TranslateModule } from '@ngx-translate/core';
import {
  BehaviorSubject,
  Observable,
} from 'rxjs';
import {
  filter,
  map,
} from 'rxjs/operators';

import { NotifyInfoService } from '../../../../../app/core/coar-notify/notify-info/notify-info.service';
import { AuthorizationDataService } from '../../../../../app/core/data/feature-authorization/authorization-data.service';
import { ItemDataService } from '../../../../../app/core/data/item-data.service';
import { RemoteData } from '../../../../../app/core/data/remote-data';
import { SignpostingDataService } from '../../../../../app/core/data/signposting-data.service';
import { LinkHeadService } from '../../../../../app/core/services/link-head.service';
import { ServerResponseService } from '../../../../../app/core/services/server-response.service';
import { Item } from '../../../../../app/core/shared/item.model';
import { MetadataMap } from '../../../../../app/core/shared/metadata.models';
import { ThemedItemAlertsComponent } from '../../../../../app/item-page/alerts/themed-item-alerts.component';
import { CollectionsComponent } from '../../../../../app/item-page/field-components/collections/collections.component';
import { FullItemPageComponent as BaseComponent } from '../../../../../app/item-page/full/full-item-page.component';
import { ItemVersionsComponent } from '../../../../../app/item-page/versions/item-versions.component';
import { ItemVersionsNoticeComponent } from '../../../../../app/item-page/versions/notice/item-versions-notice.component';
import { fadeInOut } from '../../../../../app/shared/animations/fade';
import { DsoEditMenuComponent } from '../../../../../app/shared/dso-page/dso-edit-menu/dso-edit-menu.component';
import { ErrorComponent } from '../../../../../app/shared/error/error.component';
import { ThemedLoadingComponent } from '../../../../../app/shared/loading/themed-loading.component';
import { VarDirective } from '../../../../../app/shared/utils/var.directive';
import { WorkflowItemPackageComponent } from './workflow-item-package/workflow-item-package.component';

@Component({
  selector: 'ds-themed-full-item-page',
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
    ThemedItemAlertsComponent,
    ThemedLoadingComponent,
    TranslateModule,
    VarDirective,
    WorkflowItemPackageComponent,
  ],
})
export class FullItemPageComponent extends BaseComponent implements OnInit, OnDestroy {

  override itemRD$: BehaviorSubject<RemoteData<Item>>;

  override metadata$: Observable<MetadataMap>;

  override fromSubmissionObject = false;

  override subs = [];

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
    super(route, router, items, authorizationService, _location, responseService, signpostingDataService, linkHeadService, notifyInfoService, platformId);
  }

  override ngOnInit(): void {
    super.ngOnInit();
    this.metadata$ = this.itemRD$.pipe(
      map((rd: RemoteData<Item>) => rd.payload),
      filter((item: Item) => hasValue(item)),
      map((item: Item) => item.metadata),
    );

    this.subs.push(this.route.data.subscribe((data: Data) => {
      this.fromSubmissionObject = hasValue(data.wfi) || hasValue(data.wsi);
    }));
  }

  isUrl(value: string): boolean {
    return value?.startsWith('http://') || value?.startsWith('https://');
  }

  override back() {
    this._location.back();
  }

  override ngOnDestroy() {
    this.subs.filter((sub) => hasValue(sub)).forEach((sub) => sub.unsubscribe());
  }
}
