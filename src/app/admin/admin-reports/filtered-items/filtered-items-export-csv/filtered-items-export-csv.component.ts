import {
  AsyncPipe,
  NgIf,
} from '@angular/common';
import {
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import {
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import {
  combineLatest as observableCombineLatest,
  Observable,
} from 'rxjs';
import { map } from 'rxjs/operators';

import { AuthorizationDataService } from '../../../../core/data/feature-authorization/authorization-data.service';
import { FeatureID } from '../../../../core/data/feature-authorization/feature-id';
import { ScriptDataService } from '../../../../core/data/processes/script-data.service';
import { RemoteData } from '../../../../core/data/remote-data';
import { getFirstCompletedRemoteData } from '../../../../core/shared/operators';
import { getProcessDetailRoute } from '../../../../process-page/process-page-routing.paths';
import { Process } from '../../../../process-page/processes/process.model';
import { hasValue } from '../../../../shared/empty.util';
import { NotificationsService } from '../../../../shared/notifications/notifications.service';
import { FiltersComponent } from '../../filters-section/filters-section.component';

@Component({
  selector: 'ds-filtered-items-export-csv',
  styleUrls: ['./filtered-items-export-csv.component.scss'],
  templateUrl: './filtered-items-export-csv.component.html',
  standalone: true,
  imports: [NgIf, NgbTooltipModule, AsyncPipe, TranslateModule],
})
/**
 * Display a button to export the current search results as csv
 */
export class FilteredItemsExportCsvComponent implements OnInit {

  /**
   * The current configuration of the search
   */
  @Input() reportParams: FormGroup;

  /**
   * Observable used to determine whether the button should be shown
   */
  shouldShowButton$: Observable<boolean>;

  /**
   * The message key used for the tooltip of the button
   */
  tooltipMsg = 'metadata-export-filtered-items.tooltip';

  constructor(private scriptDataService: ScriptDataService,
              private authorizationDataService: AuthorizationDataService,
              private notificationsService: NotificationsService,
              private translateService: TranslateService,
              private router: Router,
  ) {
  }

  ngOnInit(): void {
    const scriptExists$ = this.scriptDataService.findById('metadata-export-filtered-items-report').pipe(
      getFirstCompletedRemoteData(),
      map((rd) => rd.isSuccess && hasValue(rd.payload)),
    );

    const isAuthorized$ = this.authorizationDataService.isAuthorized(FeatureID.AdministratorOf);

    this.shouldShowButton$ = observableCombineLatest([scriptExists$, isAuthorized$]).pipe(
      map(([scriptExists, isAuthorized]: [boolean, boolean]) => scriptExists && isAuthorized),
    );
  }

  /**
   * Start the export of the items based on the selected parameters
   */
  export() {
    const parameters = [];
    const colls = this.reportParams.value.collections || [];
    for (let i = 0; i < colls.length; i++) {
      if (colls[i]) {
        parameters.push({ name: '-c', value: colls[i].id });
      }
    }

    const preds = this.reportParams.value.queryPredicates || [];
    for (let i = 0; i < preds.length; i++) {
      const field = preds[i].field;
      const op = preds[i].operator;
      if (field && op) {
        const value = preds[i].value;
        if (value) {
          parameters.push({ name: '-qp', value: `${field}:${op}:${value}` });
        } else {
          parameters.push({ name: '-qp', value: `${field}:${op}` });
        }
      }
    }

    const filters = FiltersComponent.toQueryString(this.reportParams.value.filters) || [];
    if (filters.length > 0) {
      parameters.push({ name: '-f', value: filters });
    }

    this.scriptDataService.invoke('metadata-export-filtered-items-report', parameters, []).pipe(
      getFirstCompletedRemoteData(),
    ).subscribe((rd: RemoteData<Process>) => {
      if (rd.hasSucceeded) {
        this.notificationsService.success(this.translateService.get('metadata-export-filtered-items.submit.success'));
        this.router.navigateByUrl(getProcessDetailRoute(rd.payload.processId));
      } else {
        this.notificationsService.error(this.translateService.get('metadata-export-filtered-items.submit.error'));
      }
    });
  }
}
