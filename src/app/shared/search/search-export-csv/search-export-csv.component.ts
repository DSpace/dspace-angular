import { AsyncPipe } from '@angular/common';
import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { Router } from '@angular/router';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import {
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import { Observable } from 'rxjs';
import {
  filter,
  map,
  startWith,
  switchMap,
} from 'rxjs/operators';

import { ConfigurationDataService } from '../../../core/data/configuration-data.service';
import { AuthorizationDataService } from '../../../core/data/feature-authorization/authorization-data.service';
import { FeatureID } from '../../../core/data/feature-authorization/feature-id';
import { ScriptDataService } from '../../../core/data/processes/script-data.service';
import { RemoteData } from '../../../core/data/remote-data';
import { ConfigurationProperty } from '../../../core/shared/configuration-property.model';
import { getFirstCompletedRemoteData } from '../../../core/shared/operators';
import { getProcessDetailRoute } from '../../../process-page/process-page-routing.paths';
import { Process } from '../../../process-page/processes/process.model';
import {
  hasValue,
  isNotEmpty,
} from '../../empty.util';
import { NotificationsService } from '../../notifications/notifications.service';
import { PaginatedSearchOptions } from '../models/paginated-search-options.model';
import { SearchFilter } from '../models/search-filter.model';

@Component({
  selector: 'ds-search-export-csv',
  styleUrls: ['./search-export-csv.component.scss'],
  templateUrl: './search-export-csv.component.html',
  standalone: true,
  imports: [
    AsyncPipe,
    NgbTooltipModule,
    TranslateModule,
  ],
})
/**
 * Display a button to export the current search results as csv
 */
export class SearchExportCsvComponent implements OnInit, OnChanges {

  /**
   * The current configuration of the search
   */
  @Input() searchConfig: PaginatedSearchOptions;

  /**
   * The total number of items in the search results which can be exported
   */
  @Input() total: number;

  /**
   * Observable used to determine whether the button should be shown
   */
  shouldShowButton$: Observable<boolean>;

  /**
   * The message key used for the tooltip of the button
   */
  tooltipMsg = 'metadata-export-search.tooltip';

  exportLimitExceededKey = 'metadata-export-search.submit.error.limit-exceeded';

  exportLimitExceededMsg = '';

  shouldShowWarning$: Observable<boolean>;

  constructor(private scriptDataService: ScriptDataService,
              private authorizationDataService: AuthorizationDataService,
              private notificationsService: NotificationsService,
              private translateService: TranslateService,
              private router: Router,
              private configurationService: ConfigurationDataService) {
  }

  ngOnInit(): void {
    this.shouldShowButton$ = this.authorizationDataService.isAuthorized(FeatureID.AdministratorOf).pipe(
      filter((isAuthorized: boolean) => isAuthorized),
      switchMap(() => this.scriptDataService.scriptWithNameExistsAndCanExecute('metadata-export-search')),
      map((canExecute: boolean) => canExecute),
      startWith(false),
    );
    this.shouldShowWarning$ = this.itemExceeds();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.total) {
      this.shouldShowWarning$ = this.itemExceeds();
    }
  }

  /**
   * Checks if the export limit has been exceeded and updates the tooltip accordingly
   */
  private itemExceeds(): Observable<boolean> {
    return this.configurationService.findByPropertyName('bulkedit.export.max.items').pipe(
      getFirstCompletedRemoteData(),
      map((response: RemoteData<ConfigurationProperty>) => {
        const limit = Number(response.payload?.values?.[0]) || 500;
        if (limit < this.total) {
          this.exportLimitExceededMsg = this.translateService.instant(this.exportLimitExceededKey, { limit: String(limit) });
          return true;
        } else {
          return false;
        }
      }),
    );
  }

  /**
   * Start the export of the items based on the current search configuration
   */
  export() {
    const parameters = [];
    if (hasValue(this.searchConfig)) {
      if (isNotEmpty(this.searchConfig.query)) {
        parameters.push({ name: '-q', value: this.searchConfig.query });
      }
      if (isNotEmpty(this.searchConfig.scope)) {
        parameters.push({ name: '-s', value: this.searchConfig.scope });
      }
      if (isNotEmpty(this.searchConfig.configuration)) {
        parameters.push({ name: '-c', value: this.searchConfig.configuration });
      }
      if (isNotEmpty(this.searchConfig.filters)) {
        this.searchConfig.filters.forEach((searchFilter: SearchFilter) => {
          if (hasValue(searchFilter.values)) {
            searchFilter.values.forEach((value: string) => {
              let operator;
              let filterValue;
              if (hasValue(searchFilter.operator)) {
                operator = searchFilter.operator;
                filterValue = value;
              } else {
                operator = value.substring(value.lastIndexOf(',') + 1);
                filterValue = value.substring(0, value.lastIndexOf(','));
              }
              const valueToAdd = `${searchFilter.key.substring(2)},${operator}=${filterValue}`;
              parameters.push({ name: '-f', value: valueToAdd });
            });
          }
        });
      }
      if (isNotEmpty(this.searchConfig.fixedFilter)) {
        const fixedFilter = this.searchConfig.fixedFilter.substring(2);
        const keyAndValue = fixedFilter.split('=');
        if (keyAndValue.length > 1) {
          const key = keyAndValue[0];
          const valueAndOperator = keyAndValue[1].split(',');
          if (valueAndOperator.length > 1) {
            const value = valueAndOperator[0];
            const operator = valueAndOperator[1];
            parameters.push({ name: '-f', value: `${key},${operator}=${value}` });
          }
        }
      }
    }

    this.scriptDataService.invoke('metadata-export-search', parameters, []).pipe(
      getFirstCompletedRemoteData(),
    ).subscribe((rd: RemoteData<Process>) => {
      if (rd.hasSucceeded) {
        this.notificationsService.success(this.translateService.get('metadata-export-search.submit.success'));
        this.router.navigateByUrl(getProcessDetailRoute(rd.payload.processId));
      } else {
        this.notificationsService.error(this.translateService.get('metadata-export-search.submit.error'));
      }
    });
  }
}
