import { AsyncPipe } from '@angular/common';
import {
  Component,
  OnInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ItemRequest } from '../../../core/shared/item-request.model';
import {
  dateToString,
  stringToNgbDateStruct,
} from '../../../shared/date.util';
import {
  hasValue,
  isNotEmpty,
} from '../../../shared/empty.util';
import { VarDirective } from '../../../shared/utils/var.directive';

@Component({
  selector: 'ds-access-by-token-notification',
  templateUrl: './access-by-token-notification.component.html',
  styleUrls: ['./access-by-token-notification.component.scss'],
  imports: [
    AsyncPipe,
    TranslateModule,
    VarDirective,
  ],
  standalone: true,
})
export class AccessByTokenNotificationComponent implements OnInit {

  itemRequest$: Observable<ItemRequest>;
  protected readonly hasValue = hasValue;

  constructor(protected route: ActivatedRoute) {
  }

  ngOnInit() {
    this.itemRequest$ = this.route.data.pipe(
      map((data) => data.itemRequest as ItemRequest),
    );
  }

  /**
   * Returns a date in simplified format (YYYY-MM-DD).
   *
   * @param date
   * @return a string with formatted date
   */
  formatDate(date: string): string {
    return isNotEmpty(date) ? dateToString(stringToNgbDateStruct(date)) : '';
  }
}
