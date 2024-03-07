import { Component, Input, OnInit } from '@angular/core';
import { Item } from '../../../../core/shared/item.model';
import { BehaviorSubject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

const MULTIPLE_DATE_VALUES_SEPARATOR = ',';

@Component({
  selector: 'ds-clarin-date-item-field',
  templateUrl: './clarin-date-item-field.component.html',
  styleUrls: ['./clarin-date-item-field.component.scss']
})
export class ClarinDateItemFieldComponent implements OnInit {

  constructor(private translateService: TranslateService) {
  }

  /**
   * The item to display metadata for
   */
  @Input() item: Item;

  updatedDateValue: BehaviorSubject<string> = new BehaviorSubject<string>('');

  ngOnInit(): void {
    let localDateValue = this.item.allMetadataValues('local.approximateDate.issued');
    let dateValue = this.item.allMetadataValues('dc.date.issued');

    // There is no local date value - show only one date metadata value
    if (localDateValue.length === 0) {
      // Date value is not empty
      if (dateValue.length !== 0) {
        this.updatedDateValue.next(dateValue[0]);
      } else {
        console.error('There is no date value for the item');
      }
      return;
    }

    // There is local date value - that values could be different and should be shown differently
    localDateValue = localDateValue[0]?.split(MULTIPLE_DATE_VALUES_SEPARATOR);

    if (localDateValue.length === 1) {
      this.updatedDateValue.next(this.updateOneValue(localDateValue));
    } else {
      this.updatedDateValue.next(this.updateMoreValues(localDateValue));
    }
  }

  updateOneValue(localDateValue: string[]) {
    const ccaMessage = this.translateService.instant('item.page.date.cca.message');
    return ccaMessage + ' (' + localDateValue[0] + ')';
  }

  updateMoreValues(localDateValue: string[]) {
    const composedMessage = this.translateService.instant('item.page.date.composed.message');
    const dateValues = localDateValue.join(MULTIPLE_DATE_VALUES_SEPARATOR);
    return composedMessage + ' ' + dateValues;
  }
}
