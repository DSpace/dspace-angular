import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { UsageReportService } from '../../core/statistics/usage-report-data.service';
import { map, switchMap, tap } from 'rxjs/operators';
import { RemoteData } from '../../core/data/remote-data';
import { getFirstSucceededRemoteData, getRemoteDataPayload, redirectOn4xx } from '../../core/shared/operators';
import { DSpaceObject } from '../../core/shared/dspace-object.model';
import { ActivatedRoute, Router } from '@angular/router';
import { DSONameService } from '../../core/breadcrumbs/dso-name.service';
import { AuthService } from '../../core/auth/auth.service';
import { StatisticsCategory } from '../../core/statistics/models/statistics-category.model';
import { StatisticsCategoriesService } from '../../core/statistics/statistics-categories.service';
import { SiteDataService } from '../../core/data/site-data.service';

import { NgbDate, NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ds-cris-statistics-page',
  templateUrl: './cris-statistics-page.component.html',
  styleUrls: ['./cris-statistics-page.component.scss']
})
export class CrisStatisticsPageComponent implements OnInit {

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
  changeCategoryType(event) {
    const category = this.categorieList.find((cat) => { return cat.id === event.nextId; });
    console.log(category);
    this.selectedCategory = category;
    this.getUserReports(category);
  }


  /**
   * Get the user reports for the specific category.
   * @param category the that is being selected
   */
   getUserReports(category) {
     this.reports$ = this.getReports$(category.id);
   }

  /**
   * Get the user reports for the specific category.
   * @param categoryId the that is being selected
   */
   getReports$(categoryId) {
     return this.scope$.pipe(
       switchMap((scope) => {
         return this.usageReportService.searchStatistics(scope._links.self.href,0,50,categoryId,this.parseDate(this.dateFrom),this.parseDate(this.dateTo));
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
