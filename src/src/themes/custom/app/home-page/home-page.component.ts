import { Component, ViewChild, ElementRef, OnInit, Inject, PLATFORM_ID, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, interval } from 'rxjs';
import { catchError, map, shareReplay, switchMap, take } from 'rxjs/operators';
import { AsyncPipe, DecimalPipe, isPlatformBrowser } from '@angular/common';

import { APP_CONFIG, AppConfig } from 'src/config/app-config.interface';
import { HomePageComponent as BaseComponent } from '../../../../app/home-page/home-page.component';
import { SuggestionsPopupComponent } from '../../../../app/notifications/suggestions/popup/suggestions-popup.component';
import { ThemedSearchFormComponent } from '../../../../app/shared/search-form/themed-search-form.component';

export interface CommunityCard {
  id: string;
  name: string;
  logoUrl: string | null;
}

@Component({
  selector: 'ds-themed-home-page',
  styleUrls: ['./home-page.component.scss'],
  templateUrl: './home-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    SuggestionsPopupComponent,
    ThemedSearchFormComponent,
    TranslateModule,
    AsyncPipe,
    DecimalPipe,
  ],
})
export class HomePageComponent extends BaseComponent implements OnInit {

  @ViewChild('browseScroll') browseScroll!: ElementRef<HTMLDivElement>;

  recordCount$: Observable<number>;
  visitCount$: Observable<number>;
  communities$: Observable<CommunityCard[]>;

  constructor(
    @Inject(APP_CONFIG) appConfig: AppConfig,
    @Inject(PLATFORM_ID) private platformId: object,
    route: ActivatedRoute,
    private http: HttpClient,
  ) {
    super(appConfig, route);
  }

  private animateCount(target: number, durationMs = 2000): Observable<number> {
    if (!isPlatformBrowser(this.platformId) || target === 0) {
      return of(target);
    }
    const steps = 60;
    return interval(durationMs / steps).pipe(
      take(steps),
      map((i) => {
        const progress = (i + 1) / steps;
        const eased = 1 - Math.pow(1 - progress, 3);
        return Math.floor(eased * target);
      }),
    );
  }

  override ngOnInit(): void {
    super.ngOnInit();

    if (isPlatformBrowser(this.platformId)) {
      this.recordCount$ = this.http.get<any>(
        `${this.appConfig.rest.baseUrl}/api/discover/search/objects?dsoType=item&size=0`,
      ).pipe(
        map((r: any) => r?._embedded?.searchResult?.page?.totalElements ?? 0),
        catchError(() => of(0)),
        shareReplay(1),
        switchMap((target) => this.animateCount(target)),
      );

      this.visitCount$ = this.http.get<{ total: number }>('/api/visit-count').pipe(
        map((r) => r?.total ?? 0),
        catchError(() => of(0)),
        shareReplay(1),
        switchMap((target) => this.animateCount(target)),
      );

      this.communities$ = this.http.get<any>(
        `${this.appConfig.rest.baseUrl}/api/core/communities/search/top?embed=logo&page=0&size=50`,
      ).pipe(
        map((r: any) => {
          const list: any[] = r?._embedded?.communities ?? [];
          return list.map((c: any) => ({
            id: c.id,
            name: c.name,
            logoUrl: c._embedded?.logo?._links?.content?.href ?? null,
          }));
        }),
        catchError(() => of([])),
        shareReplay(1),
      );
    } else {
      this.recordCount$ = of(0);
      this.visitCount$ = of(0);
      this.communities$ = of([]);
    }
  }

  scrollBrowse(value: number): void {
    if (this.browseScroll?.nativeElement) {
      this.browseScroll.nativeElement.scrollLeft += value;
    }
  }
}
