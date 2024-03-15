import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Item } from '../core/shared/item.model';

const MULTIPLE_DATE_VALUES_SEPARATOR = ',';

@Injectable()
export class ClarinDateService {
  constructor(private translateService: TranslateService) {}

  /**
   * Compose date value for the item. The date value could be fetched from the local metadata or from the
   * default metadata. The date value could be a single value or multiple values (local metadata).
   * @param item
   */
  composeItemDate(item: Item): string {
    let localDateValue = item.allMetadataValues('local.approximateDate.issued');
    let dateValue = item.allMetadataValues('dc.date.issued');

    // There is no local date value - show only one date metadata value
    if (localDateValue.length === 0) {
      // Date value is not empty
      if (dateValue.length !== 0) {
        return dateValue[0];
      } else {
        console.error('There is no date value for the item');
        return '';
      }
    }

    // There is local date value - that values could be different and should be shown differently
    localDateValue = localDateValue[0]?.split(MULTIPLE_DATE_VALUES_SEPARATOR);

    if (localDateValue.length === 1) {
      return this.updateOneValue(localDateValue);
    } else {
      return this.updateMoreValues(localDateValue);
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
