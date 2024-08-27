import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  NgbDate,
  NgbDateParserFormatter,
  NgbDatepickerModule,
  NgbDateStruct,
} from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';
import {
  take,
  tap,
} from 'rxjs/operators';

import {
  getFirstSucceededRemoteData,
  getPaginatedListPayload,
  getRemoteDataPayload,
} from '../../core/shared/operators';
import { LoginStatisticsService } from '../../core/statistics/login-statistics.service';
import { LoginStatistics } from '../../core/statistics/models/login-statistics.model';
import { AlertComponent } from '../../shared/alert/alert.component';
import { AlertType } from '../../shared/alert/alert-type';
import { ThemedLoadingComponent } from '../../shared/loading/themed-loading.component';
import { VarDirective } from '../../shared/utils/var.directive';
import { StatisticsTableComponent } from '../statistics-table/statistics-table.component';

@Component({
  selector: 'ds-login-statistics',
  templateUrl: './login-statistics-page.component.html',
  styleUrls: ['./login-statistics-page.component.scss'],
  standalone: true,
  imports: [CommonModule, VarDirective, ThemedLoadingComponent, StatisticsTableComponent, TranslateModule, FormsModule, NgbDatepickerModule, AlertComponent],
})
export class LoginStatisticsPageComponent implements OnInit {

  logins$ = new BehaviorSubject<LoginStatistics[]>([]);

  dateFrom: NgbDateStruct;

  dateTo: NgbDateStruct;

  max: number;

  AlertTypeEnum = AlertType;

  public processing$ = new BehaviorSubject<boolean>(false);

  constructor( private loginStatisticsService: LoginStatisticsService,
    private ngbDateParserFormatter: NgbDateParserFormatter) {

  }

  ngOnInit(): void {
    this.searchByDateRange(null, null, this.max);
  }

  /**
   * Perform a search when the search filters change.
   */
  onSearchFilterChange() {
    this.searchByDateRange(this.parseDate(this.dateFrom),this.parseDate(this.dateTo), this.max);
  }

  /**
   * Search for login statistics using the provided filters.
   * @param startDate the start date to search for
   * @param endDate the end date to search for
   * @param limit the limit to apply
   * @private
   */
  private searchByDateRange(startDate: string, endDate: string, limit: number) {
    this.processing$.next(true);
    this.loginStatisticsService.searchByDateRange(startDate, endDate, limit).pipe(
      getFirstSucceededRemoteData(),
      getRemoteDataPayload(),
      getPaginatedListPayload(),
      take(1),
      tap(() => this.processing$.next(false)),
    ).subscribe((logins) => {
      this.logins$.next(logins);
    });
  }

  /**
   * Reset all the search filters.
   */
  resetFilters(): void {
    this.dateFrom = null;
    this.dateTo = null;
    this.max = null;
    this.searchByDateRange(null, null, this.max);
  }

  /**
   * Parse the incoming date object.
   * @param dateObject the date to parse
   */
  parseDate(dateObject: NgbDateStruct) {
    if ( !dateObject ) {
      return null;
    }
    const date: NgbDate = new NgbDate(dateObject.year, dateObject.month, dateObject.day);
    return this.ngbDateParserFormatter.format(date);
  }

}
