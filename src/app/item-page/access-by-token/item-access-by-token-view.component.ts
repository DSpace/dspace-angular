import {
  AsyncPipe,
  KeyValuePipe,
  NgForOf,
  NgIf,
} from '@angular/common';
import {
  Component,
  Input,
  OnInit,
} from '@angular/core';
import {
  Router,
  RouterLink,
} from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import {
  BehaviorSubject,
  Observable,
} from 'rxjs';
import { filter } from 'rxjs/operators';

import { RouteService } from '../../core/services/route.service';
import { ItemRequest } from '../../core/shared/item-request.model';
import { DsoEditMenuComponent } from '../../shared/dso-page/dso-edit-menu/dso-edit-menu.component';
import { hasValue } from '../../shared/empty.util';
import { ErrorComponent } from '../../shared/error/error.component';
import { ThemedLoadingComponent } from '../../shared/loading/themed-loading.component';
import { MetadataFieldWrapperComponent } from '../../shared/metadata-field-wrapper/metadata-field-wrapper.component';
import { ThemedResultsBackButtonComponent } from '../../shared/results-back-button/themed-results-back-button.component';
import { VarDirective } from '../../shared/utils/var.directive';
import { ViewTrackerComponent } from '../../statistics/angulartics/dspace/view-tracker.component';
import { ThemedThumbnailComponent } from '../../thumbnail/themed-thumbnail.component';
import { ThemedItemAlertsComponent } from '../alerts/themed-item-alerts.component';
import { CollectionsComponent } from '../field-components/collections/collections.component';
import { ThemedFullFileSectionComponent } from '../full/field-components/file-section/themed-full-file-section.component';
import { ThemedMediaViewerComponent } from '../media-viewer/themed-media-viewer.component';
import { MiradorViewerComponent } from '../mirador-viewer/mirador-viewer.component';
import { ThemedFileSectionComponent } from '../simple/field-components/file-section/themed-file-section.component';
import { ItemPageAbstractFieldComponent } from '../simple/field-components/specific-field/abstract/item-page-abstract-field.component';
import { ItemPageDateFieldComponent } from '../simple/field-components/specific-field/date/item-page-date-field.component';
import { GenericItemPageFieldComponent } from '../simple/field-components/specific-field/generic/generic-item-page-field.component';
import { ThemedItemPageTitleFieldComponent } from '../simple/field-components/specific-field/title/themed-item-page-field.component';
import { ItemPageUriFieldComponent } from '../simple/field-components/specific-field/uri/item-page-uri-field.component';
import { ItemComponent } from '../simple/item-types/shared/item.component';
import { ThemedMetadataRepresentationListComponent } from '../simple/metadata-representation-list/themed-metadata-representation-list.component';
import { ItemVersionsComponent } from '../versions/item-versions.component';
import { ItemVersionsNoticeComponent } from '../versions/notice/item-versions-notice.component';
import { ItemSecureFileSectionComponent } from './field-components/file-section/item-secure-file-section.component';
import { ItemSecureMediaViewerComponent } from './field-components/media-viewer/item-secure-media-viewer.component';

@Component({
  selector: 'ds-item-access-by-token-view',
  styleUrls: ['./item-access-by-token-view.component.scss'],
  templateUrl: './item-access-by-token-view.component.html',
  standalone: true,
  imports: [
    ErrorComponent,
    ThemedLoadingComponent,
    TranslateModule,
    ThemedFullFileSectionComponent,
    CollectionsComponent,
    ItemVersionsComponent,
    NgIf,
    NgForOf,
    AsyncPipe,
    KeyValuePipe,
    RouterLink,
    ThemedItemPageTitleFieldComponent,
    DsoEditMenuComponent,
    ItemVersionsNoticeComponent,
    ViewTrackerComponent,
    ThemedItemAlertsComponent,
    VarDirective,
    ItemSecureFileSectionComponent,
    GenericItemPageFieldComponent,
    ItemPageAbstractFieldComponent,
    ItemPageDateFieldComponent,
    ItemPageUriFieldComponent,
    MetadataFieldWrapperComponent,
    MiradorViewerComponent,
    ThemedFileSectionComponent,
    ThemedMediaViewerComponent,
    ThemedMetadataRepresentationListComponent,
    ThemedResultsBackButtonComponent,
    ThemedThumbnailComponent,
    ItemSecureMediaViewerComponent,
    //ItemPageTitleFieldComponent,
    //ThumbnailComponent,
    //MetadataRepresentationListComponent,
  ],
})
export class ItemAccessByTokenViewComponent extends ItemComponent implements OnInit {

  @Input() itemRequest$: Observable<ItemRequest>;
  itemRequestSubject = new BehaviorSubject<ItemRequest>(null);
  expiryDate: Date;

  constructor(
    protected routeService: RouteService,
    protected router: Router,
  ) {
    super(routeService, router);
  }

  protected readonly hasValue = hasValue;

  ngOnInit(): void {
    this.itemRequest$.pipe(
      filter(request => hasValue(request)),
    ).subscribe(request => {
      this.itemRequestSubject.next(request);
      super.ngOnInit();
    });


  }

  getAccessPeriodEndDate(): Date {
    const request = this.itemRequestSubject.getValue();
    // Set expiry, if not 0
    if (hasValue(request) && request.accessPeriod > 0) {
      const date = new Date(request.decisionDate);
      date.setUTCSeconds(date.getUTCSeconds() + request.accessPeriod);
      return date;
    }
  }
}
