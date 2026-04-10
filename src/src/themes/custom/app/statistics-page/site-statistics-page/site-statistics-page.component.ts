import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  Component,
  Inject,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import {
  Observable,
  of,
} from 'rxjs';
import {
  catchError,
  map,
  shareReplay,
} from 'rxjs/operators';

import {
  APP_CONFIG,
  AppConfig,
} from 'src/config/app-config.interface';
import { Point, UsageReport } from '../../../../../app/core/statistics/models/usage-report.model';
import { SiteDataService } from '../../../../../app/core/data/site-data.service';
import { ThemedLoadingComponent } from '../../../../../app/shared/loading/themed-loading.component';
import { VarDirective } from '../../../../../app/shared/utils/var.directive';
import { SiteStatisticsPageComponent as BaseComponent } from '../../../../../app/statistics-page/site-statistics-page/site-statistics-page.component';

@Component({
  selector: 'ds-themed-site-statistics-page',
  templateUrl: './site-statistics-page.component.html',
  styleUrls: ['./site-statistics-page.component.scss'],
  imports: [
    CommonModule,
    ThemedLoadingComponent,
    TranslateModule,
    VarDirective,
  ],
})
export class SiteStatisticsPageComponent extends BaseComponent implements OnInit {

  recordCount$: Observable<number>;
  visitCount$: Observable<number>;
  visitsReport$: Observable<UsageReport | undefined>;
  countriesReport$: Observable<UsageReport | undefined>;
  citiesReport$: Observable<UsageReport | undefined>;

  constructor(
    siteService: SiteDataService,
    private http: HttpClient,
    @Inject(APP_CONFIG) private appConfig: AppConfig,
    @Inject(PLATFORM_ID) private platformId: object,
  ) {
    super(siteService);
  }

  ngOnInit(): void {
    super.ngOnInit();

    // Share so multiple async pipes don't trigger separate HTTP requests
    this.reports$ = (this.reports$ as Observable<UsageReport[]>).pipe(shareReplay(1));

    this.visitsReport$ = this.reports$.pipe(
      map(reports => reports.find(r => r.reportType === 'TotalVisits')),
    );
    this.countriesReport$ = this.reports$.pipe(
      map(reports => reports.find(r => r.reportType === 'TopCountries')),
    );
    this.citiesReport$ = this.reports$.pipe(
      map(reports => reports.find(r => r.reportType === 'TopCities')),
    );

    this.recordCount$ = this.http.get<any>(
      `${this.appConfig.rest.baseUrl}/api/discover/search/objects?dsoType=item&size=0`,
    ).pipe(
      map((r: any) => r?._embedded?.searchResult?.page?.totalElements ?? 0),
      catchError(() => of(0)),
      shareReplay(1),
    );

    // Only fetch visit count in browser — relative URL /api/visit-count cannot be resolved during SSR
    if (isPlatformBrowser(this.platformId)) {
      this.visitCount$ = this.http.get<{ total: number }>('/api/visit-count').pipe(
        map((r) => r?.total ?? 0),
        catchError(() => of(0)),
        shareReplay(1),
      );
    } else {
      this.visitCount$ = of(0);
    }
  }

  getHeaders(report: UsageReport): string[] {
    if (report?.points?.length > 0) {
      return Object.keys(report.points[0].values as any);
    }
    return [];
  }

  getPointValue(point: Point, key: string): unknown {
    return (point.values as any)[key];
  }

  getBarWidth(report: UsageReport, key: string, point: Point): number {
    const max = Math.max(...report.points.map((p) => (p.values as any)[key] ?? 0)) || 1;
    return ((point.values as any)[key] ?? 0) / max * 100;
  }

  getFlagEmoji(countryCode: string): string {
    if (!countryCode || countryCode.length !== 2) { return '🌐'; }
    const codePoints = countryCode.toUpperCase().split('').map(c => 127397 + c.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  }

  printReport(): void {
    window.print();
  }
}
