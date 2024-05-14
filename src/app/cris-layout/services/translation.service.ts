import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class TranslationUtilityService {

  constructor(private translateService: TranslateService) {
  }

  /**
   * Returns true if the passed value is a NgbDateStruct.
   *
   * @param fieldLabelI18nKey
   *    The field label i18n key
   * @return boolean
   *    if the translation haven't found return null otherwise return translated label
   */
  getTranslation(fieldLabelI18nKey: string): string {
    const header: string = this.translateService.instant(fieldLabelI18nKey);
    if (header !== fieldLabelI18nKey) {
      return header;
    }
    return null;
  }
}
