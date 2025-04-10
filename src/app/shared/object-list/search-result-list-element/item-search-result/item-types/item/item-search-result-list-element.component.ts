import { AfterViewInit, Component, Inject, Input, OnInit, Optional } from '@angular/core';
import {
  listableObjectComponent
} from '../../../../../object-collection/shared/listable-object/listable-object.decorator';
import { ViewMode } from '../../../../../../core/shared/view-mode.model';
import { ItemSearchResult } from '../../../../../object-collection/shared/item-search-result.model';
import { SearchResultListElementComponent } from '../../../search-result-list-element.component';
import { Item } from '../../../../../../core/shared/item.model';
import { getItemPageRoute } from '../../../../../../item-page/item-page-routing-paths';
import { Context } from '../../../../../../core/shared/context.model';
import { environment } from '../../../../../../../environments/environment';
import { KlaroService } from '../../../../../cookies/klaro.service';
import { combineLatest, Observable } from 'rxjs';
import { TruncatableService } from '../../../../../truncatable/truncatable.service';
import { DSONameService } from '../../../../../../core/breadcrumbs/dso-name.service';
import { APP_CONFIG, AppConfig } from '../../../../../../../config/app-config.interface';
import { getFirstSucceededRemoteListPayload } from '../../../../../../core/shared/operators';
import { differenceInDays, differenceInMilliseconds, parseISO} from 'date-fns';
import { filter, map } from 'rxjs/operators';
import { isNotEmpty } from '../../../../../empty.util';
import { MetadataValueFilter } from '../../../../../../core/shared/metadata.models';
import { PLACEHOLDER_VALUE } from '../../../../../../core/shared/metadata.utils';

@listableObjectComponent('PublicationSearchResult', ViewMode.ListElement)
@listableObjectComponent(ItemSearchResult, ViewMode.ListElement)
@listableObjectComponent(ItemSearchResult, ViewMode.ListElement, Context.BrowseMostElements)
@Component({
  selector: 'ds-item-search-result-list-element',
  styleUrls: ['./item-search-result-list-element.component.scss'],
  templateUrl: './item-search-result-list-element.component.html'
})
/**
 * The component for displaying a list element for an item search result of the type Publication
 */
export class ItemSearchResultListElementComponent extends SearchResultListElementComponent<ItemSearchResult, Item> implements OnInit, AfterViewInit {

  /**
   * Whether to show the metrics badges
   */
  @Input() showMetrics = true;

  /**
   * Route to the item's page
   */
  itemPageRoute: string;

  authorMetadata = environment.searchResult.authorMetadata;

  hasLoadedThirdPartyMetrics$: Observable<boolean>;

  readonly placeholderFilter: MetadataValueFilter = {
    negate: true,
    value: PLACEHOLDER_VALUE
  };

  private thirdPartyMetrics = environment.info.metricsConsents.filter(metric => metric.enabled).map(metric => metric.key);


  constructor(
    protected truncatableService: TruncatableService,
    public dsoNameService: DSONameService,
    @Inject(APP_CONFIG) protected appConfig?: AppConfig,
    @Optional() private klaroService?: KlaroService,
  ) {
    super(truncatableService, dsoNameService);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.itemPageRoute = getItemPageRoute(this.dso);
  }

  /**
   * Check if item has Third-party metrics blocked by consents
   */
  ngAfterViewInit() {
    if (this.showMetrics && this.klaroService) {
      this.klaroService.watchConsentUpdates();

      this.hasLoadedThirdPartyMetrics$ = combineLatest([
        this.klaroService.consentsUpdates$.pipe(
          filter(consents => isNotEmpty(consents))
        ),
        this.dso.metrics?.pipe(
          getFirstSucceededRemoteListPayload(),
          map(metrics => {
            return metrics.filter(metric => this.thirdPartyMetrics.includes(metric.metricType));
          })
        )
      ]).pipe(
        map(([consents, metrics]) => {
          return metrics.reduce((previous, current) => {
            return consents[current.metricType] && previous;
          }, true);
        })
      );
    }
  }

  getDateForItem(itemStartDate: string) {
    const itemStartDateConverted: Date = parseISO(itemStartDate);
    const days: number = Math.floor(differenceInDays(Date.now(), itemStartDateConverted));
    const remainingMilliseconds: number = differenceInMilliseconds(Date.now(), itemStartDateConverted) - days * 24 * 60 * 60 * 1000;
    const hours: number = Math.floor(remainingMilliseconds / (60 * 60 * 1000));
    return `${days} d ${hours} h`;
  }

  /**
   * Prompt user for consents settings
   */
  showSettings() {
    this.klaroService.showSettings();
  }
}
