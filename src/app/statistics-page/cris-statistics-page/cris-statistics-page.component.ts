import { Component, OnInit,Input, SimpleChanges, OnChanges } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { UsageReportService } from '../../core/statistics/usage-report-data.service';
import { map, switchMap, tap } from 'rxjs/operators';
import { of as observableOf } from 'rxjs';

import { UsageReport } from '../../core/statistics/models/usage-report.model';
import { RemoteData } from '../../core/data/remote-data';
import {
  getRemoteDataPayload,
  getFirstSucceededRemoteData,
  redirectOn4xx
} from '../../core/shared/operators';
import { DSpaceObject } from '../../core/shared/dspace-object.model';
import { ActivatedRoute, Router } from '@angular/router';
import { DSONameService } from '../../core/breadcrumbs/dso-name.service';
import { AuthService } from '../../core/auth/auth.service';
import { StatisticsCategory } from '../../core/statistics/models/statistics-category.model';
import { StatisticsCategoriesService } from '../../core/statistics/statistics-categories.service';
import { DataReportService } from '../../core/statistics/data-report.service';
import { SiteDataService } from '../../core/data/site-data.service';

import { NgbDateParserFormatter, NgbDateStruct , NgbDate } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ds-cris-statistics-page',
  templateUrl: './cris-statistics-page.component.html',
  styleUrls: ['./cris-statistics-page.component.scss']
})
export class CrisStatisticsPageComponent implements OnInit,OnChanges {

  /**
   * The scope dso for this statistics page, as an Observable.
   */
  scope$: Observable<DSpaceObject>;

  /**
   * The report types to show on this statistics page.
   */
  @Input() types: string[];

  /**
   * The usage report types to show on this statistics page, as an Observable list.
   */
  reports$: Observable<any[]>;

  /**
   * The statistics categories to show on this statistics page, as an Observable list.
   */
  categories$: Observable<StatisticsCategory[]>;

  /**
   * List of categories, utilized when tab is selected.
   */
  categorieList: StatisticsCategory[];

  /**
   * The selected category that will be changed from tabs
   */
  selectedCategory: StatisticsCategory;


  /**
   * The date from to filter
   */
  dateFrom: NgbDateStruct;

  /**
   * The date from to filter
   */
  dateTo: NgbDateStruct;

  constructor(
    protected route: ActivatedRoute,
    protected router: Router,
    protected usageReportService: UsageReportService,
    protected statisticsCategoriesService: StatisticsCategoriesService,
    protected nameService: DSONameService,
    protected authService: AuthService,
    protected siteService: SiteDataService,
    private ngbDateParserFormatter: NgbDateParserFormatter
  ) {
  }


  /**
   * Get the scope from site or from dso.
   */
  ngOnInit(): void {
    this.route.data.subscribe((res) => {
      if ( res.type === 'site' ) {
        this.scope$ = this.getSiteScope$();
      } else {
        this.scope$ = this.getScope$();
      }
      this.categories$ = this.getCategories$();
    });
  }

  /**
   * Get the scope from site.
   */
  public getSiteScope$() {
    return this.siteService.find();
  }

  /**
   * Get the scope dso for this statistics page, as an Observable.
   */
  public getScope$(): Observable<DSpaceObject> {
    return this.route.data.pipe(
      map((data: any) => data.scope as RemoteData<any>),
      redirectOn4xx(this.router, this.authService),
      getFirstSucceededRemoteData(),
      getRemoteDataPayload()
    );
  }

  /**
   * Get the categories for this statistics page, as an Observable list
   */
  public getCategories$(): Observable<StatisticsCategory[]> {
    return this.scope$.pipe(
      switchMap((scope) => {
        return this.statisticsCategoriesService.getCategoriesStatistics(scope._links.self.href,0,50,this.parseDate(this.dateFrom),this.parseDate(this.dateTo));
      }),
      tap( (categories: StatisticsCategory[]) => {
        this.categorieList = categories;
        this.selectedCategory = categories[0];
        this.getUserReports(this.selectedCategory);
      })
    );
  }


  ngOnChanges(changes: SimpleChanges): void {
    // this.ngOnInit();
  }

  /**
   * Get the name of the scope dso.
   * @param scope the scope dso to get the name for
   */
  getName(scope: DSpaceObject): string {
    return this.nameService.getName(scope);
  }



  /**
   * When tab changed ,need to refresh information.
   * @param category the that is being selected
   */
  // changeCategoryType(category: StatisticsCategory) {
  changeCategoryType(event) {
    const category = this.categorieList.find((cat) => { return cat.id === event.nextId; });
    this.selectedCategory = category;
  }


  /**
   * Get the user reports for the specific category.
   * @param category the that is being selected
   */
   getUserReports(category) {
     this.reports$ = this.getReports$(category.id);
   }

   /**
   * Get mock data for the reports.
   */
   // getReports$(categoryId) {
   //   return observableOf([
   //          {
   //              'id': '1911e8a4-6939-490c-b58b-a5d70f8d91fb_TotalVisits',
   //              'type': 'usagereport',
   //              'reportType': 'TotalVisits',
   //              'viewMode': 'chart.bar',
   //              'points': [
   //                  {
   //                      'label': '1911e8a4-6939-490c-b58b-a5d70f8d91fb',
   //                      'type': 'item',
   //                      'id': '1911e8a4-6939-490c-b58b-a5d70f8d91fb',
   //                      'values': {
   //                          'views': 3
   //                      }
   //                  }
   //              ],
   //              '_links' : {
   //                'self' : {
   //                  'href' : 'https://{dspace.url}/server/api/statistics/usagereports/1911e8a4-6939-490c-b58b-a5d70f8d91fb_TotalVisits'
   //                }
   //              }
   //          },
   //          {
   //              'id': '0aa1fe0c-e173-4a36-a526-5c157dedfc07_TotalVisitsPerMonth',
   //              'points': [
   //                {
   //                  'id': 'September 2020',
   //                  'label': 'September 2020',
   //                  'values': {
   //                    'views': 0
   //                  },
   //                  'type': 'date'
   //                },
   //                {
   //                  'id': 'October 2020',
   //                  'label': 'October 2020',
   //                  'values': {
   //                    'views': 0
   //                  },
   //                  'type': 'date'
   //                },
   //                {
   //                  'id': 'November 2020',
   //                  'label': 'November 2020',
   //                  'values': {
   //                    'views': 0
   //                  },
   //                  'type': 'date'
   //                },
   //                {
   //                  'id': 'December 2020',
   //                  'label': 'December 2020',
   //                  'values': {
   //                    'views': 0
   //                  },
   //                  'type': 'date'
   //                },
   //                {
   //                  'id': 'January 2021',
   //                  'label': 'January 2021',
   //                  'values': {
   //                    'views': 0
   //                  },
   //                  'type': 'date'
   //                },
   //                {
   //                  'id': 'February 2021',
   //                  'label': 'February 2021',
   //                  'values': {
   //                    'views': 67
   //                  },
   //                  'type': 'date'
   //                },
   //                {
   //                  'id': 'March 2021',
   //                  'label': 'March 2021',
   //                  'values': {
   //                    'views': 234
   //                  },
   //                  'type': 'date'
   //                }
   //              ],
   //              'type': 'usagereport',
   //              'reportType': 'TotalVisitsPerMonth',
   //              'viewMode': 'chart.line',
   //              '_links': {
   //                'self': {
   //                  'href': 'https://dspacecris7.4science.cloud/server/api/statistics/usagereports/0aa1fe0c-e173-4a36-a526-5c157dedfc07_TotalVisitsPerMonth'
   //                }
   //              }
   //          },
   //          {
   //              'id': '1911e8a4-6939-490c-b58b-a5d70f8d91fb_TotalDownloads',
   //              'type': 'usagereport',
   //              'reportType': 'TotalDownloads',
   //              'viewMode': 'chart.pie',
   //              'points': [
   //                  {
   //                      'label': '8d33bdfb-e7ba-43e6-a93a-f445b7e8a1e2',
   //                      'type': 'bitstream',
   //                      'id': '8d33bdfb-e7ba-43e6-a93a-f445b7e8a1e2',
   //                      'values': {
   //                          'downloads': 8
   //                      }
   //                  }
   //              ],
   //              '_links' : {
   //                'self' : {
   //                  'href' : 'https://{dspace.url}/server/api/statistics/usagereports/1911e8a4-6939-490c-b58b-a5d70f8d91fb_TotalVisits'
   //                }
   //              }
   //          },
   //          {
   //              'id': '1911e8a4-6939-490c-b58b-a5d70f8d91fb_TopCountries',
   //              'type': 'usagereport',
   //              'reportType': 'TopCountries',
   //              'viewMode': 'map',
   //              'points': [
   //                  {
   //                      'label': 'United States',
   //                      'type': 'country',
   //                      'id': 'US',
   //                      'values': {
   //                          'views': 2
   //                      }
   //                  },
   //                  {
   //                      'label': 'China',
   //                      'type': 'country',
   //                      'id': 'CN',
   //                      'values': {
   //                          'views': 1
   //                      }
   //                  }
   //              ],
   //              '_links' : {
   //                'self' : {
   //                  'href' : 'https://{dspace.url}/server/api/statistics/usagereports/1911e8a4-6939-490c-b58b-a5d70f8d91fb_TotalVisits'
   //                }
   //              }
   //          },
   //          {
   //              'id': '1911e8a4-6939-490c-b58b-a5d70f8d91fb_TopCountries',
   //              'type': 'usagereport',
   //              'reportType': 'TopCountries',
   //              'viewMode': 'table',
   //              'points': [
   //                  {
   //                      'label': 'United States',
   //                      'type': 'country',
   //                      'id': 'US',
   //                      'values': {
   //                          'views': 2
   //                      }
   //                  },
   //                  {
   //                      'label': 'China',
   //                      'type': 'country',
   //                      'id': 'CN',
   //                      'values': {
   //                          'views': 1
   //                      }
   //                  }
   //              ],
   //              '_links' : {
   //                'self' : {
   //                  'href' : 'https://{dspace.url}/server/api/statistics/usagereports/1911e8a4-6939-490c-b58b-a5d70f8d91fb_TotalVisits'
   //                }
   //              }
   //          }
   //      ]
   //    );
   // }


  /**
   * Get the user reports for the specific category.
   * @param categoryId the that is being selected
   */
    getReports$(categoryId) {
      return this.scope$.pipe(
        switchMap((scope) => {
          return this.usageReportService.searchStatistics(scope._links.self.href,0,50,categoryId,this.parseDate(this.dateFrom),this.parseDate(this.dateTo))
        }),
      );
    }

  /**
   * Refresh categories when the date from or date to is changed.
   */
    dateChanged() {
      this.categories$ = this.getCategories$();
    }

  /**
   * Parse date object type and return a string of year and day YY-MM.
   * @param dateObject: NgbDateStruct that is being parsed.
   */
  parseDate(dateObject: NgbDateStruct) {
    if ( !dateObject ) {
      return null;
    }
    const date: NgbDate = new NgbDate(dateObject.year, dateObject.month, dateObject.day);
    return this.ngbDateParserFormatter.format(date);
  }

}
