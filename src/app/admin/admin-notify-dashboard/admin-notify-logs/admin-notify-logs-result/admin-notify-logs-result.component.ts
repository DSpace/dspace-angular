import { AsyncPipe } from '@angular/common';
import {
  Component,
  Inject,
  Input,
  OnInit,
} from '@angular/core';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  Router,
} from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Context } from '../../../../core/shared/context.model';
import { SearchConfigurationService } from '../../../../core/shared/search/search-configuration.service';
import { ViewMode } from '../../../../core/shared/view-mode.model';
import { SEARCH_CONFIG_SERVICE } from '../../../../my-dspace-page/my-dspace-configuration.service';
import { SearchLabelsComponent } from '../../../../shared/search/search-labels/search-labels.component';
import { ThemedSearchComponent } from '../../../../shared/search/themed-search.component';

@Component({
  selector: 'ds-admin-notify-logs-result',
  templateUrl: './admin-notify-logs-result.component.html',
  providers: [
    {
      provide: SEARCH_CONFIG_SERVICE,
      useClass: SearchConfigurationService,
    },
  ],
  standalone: true,
  imports: [
    AsyncPipe,
    SearchLabelsComponent,
    ThemedSearchComponent,
    TranslateModule,
  ],
})

/**
 * Component for visualization of search page and related results for the logs of the Notify dashboard
 */

export class AdminNotifyLogsResultComponent implements OnInit {

  @Input()
  defaultConfiguration: string;


  public selectedSearchConfig$: Observable<string>;
  public isInbound$: Observable<boolean>;

  protected readonly context = Context.CoarNotify;

  constructor(
    @Inject(SEARCH_CONFIG_SERVICE) public searchConfigService: SearchConfigurationService,
    protected router: Router,
    protected route: ActivatedRoute,
  ) {
  }

  ngOnInit() {
    this.selectedSearchConfig$ = this.searchConfigService.getCurrentConfiguration(this.defaultConfiguration);
    this.isInbound$ = this.selectedSearchConfig$.pipe(
      map(config => config.startsWith('NOTIFY.incoming')),
    );
  }

  /**
   * Reset route state to default configuration
   */
  public resetDefaultConfiguration() {
    //Idle navigation to trigger rendering of result on same page
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([this.getResolvedUrl(this.route.snapshot)], {
        queryParams: {
          configuration: this.defaultConfiguration,
          view: ViewMode.Table,
        },
      });
    });
  }

  /**
   * Get resolved url from route
   *
   * @param route url path
   * @returns url path
   */
  private getResolvedUrl(route: ActivatedRouteSnapshot): string {
    return route.pathFromRoot.map(v => v.url.map(segment => segment.toString()).join('/')).join('/');
  }
}
