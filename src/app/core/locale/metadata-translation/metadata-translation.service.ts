import { Inject, Injectable } from '@angular/core';
import { isEmpty, isNotEmpty } from '../../../shared/empty.util';
import { LocaleService } from '../locale.service';
import { MetadataValue, MetadataValueFilter } from '../../shared/metadata.models';
import { DSpaceObject } from '../../shared/dspace-object.model';
import { isUndefined } from '../../../shared/empty.util';

@Injectable({
  providedIn: 'root'
})
/**
 * Translate metadata from a DSpaceObject using the current language code from the locale service.
 */
export class MetadataTranslationService {

  /**
  * The filtered metadata language
  */
  language: string;

  private currentLanguageFilter: MetadataValueFilter;

  readonly defaultFilter: MetadataValueFilter = { language: 'en' };

  constructor(
    protected localeService: LocaleService,
  ) {
    this.currentLanguageFilter = { language: this.localeService.getCurrentLanguageCode() };
  }

  /* First metadata value for the current language from the locale service */
  currentLanguageValue(dso: DSpaceObject, keyOrKeys: string | string[]): string {
    const md = dso.firstMetadata(keyOrKeys, this.currentLanguageFilter);
    return this.getValue(md);
  }

  /* First metadata value for the defaultFilter defined language (en) */
  defaultLanguageValue(dso: DSpaceObject, keyOrKeys: string | string[]): string {
    const md = dso.firstMetadata(keyOrKeys, this.defaultFilter);
    return this.getValue(md);
  }

  /* First metadata value without language defined */
  emptyLanguageValue(dso: DSpaceObject, keyOrKeys: string | string[]): string {
    const md = dso.allMetadata(keyOrKeys).find(val => isEmpty(val.language));
    return this.getValue(md);
  }

  /* First metadata value for the current language. Then falls back on default then empty language value. */
  currentLanguageValueOrDefault(dso: DSpaceObject, keyOrKeys: string | string[]): string {
    let mdValue = this.currentLanguageValue(dso, keyOrKeys);
    if (!mdValue) {
      mdValue = this.defaultLanguageValue(dso, keyOrKeys);
    }
    if (!mdValue) {
      mdValue = this.emptyLanguageValue(dso, keyOrKeys);
    }
    return String(mdValue);
  }

  private getValue(mdValue: MetadataValue): string {
    return isUndefined(mdValue) ? undefined : mdValue.value;
  }

}
