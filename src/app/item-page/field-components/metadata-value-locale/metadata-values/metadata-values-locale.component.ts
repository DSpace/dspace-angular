import { Component, Input, OnInit } from '@angular/core';
import { isEmpty } from 'src/app/shared/empty.util';
import { LocaleService } from '../../../../core/locale/locale.service';
import { MetadataValue } from '../../../../core/shared/metadata.models';

/**
 * This component renders the configured 'values' filtering with the user's language.
 * It puts the given 'separator' between each two values.
 */
@Component({
  selector: 'ds-metadata-values-locale',
  styleUrls: ['./metadata-values-locale.component.scss'],
  templateUrl: './metadata-values-locale.component.html'
})
export class MetadataValuesLocaleComponent implements OnInit {

  /**
   * The metadata values to display
   */
  @Input() mdValues: MetadataValue[];

  /**
   * The seperator used to split the metadata values (can contain HTML)
   */
  @Input() separator: string;

  /**
   * The label for this iteration of metadata values
   */
  @Input() label: string;

  /**
   * The filtered metadata language
   */
  @Input() language: string;

  /**
   * Default fallback language
   */
  @Input() defaultLanguage = 'en';

  constructor(
    private localeService: LocaleService
  ) {
  }

  ngOnInit(): void {
    this.language = this.localeService.getCurrentLanguageCode();
  }

  currentLanguageValues(): MetadataValue[] {
    return this.mdValues.filter(value => value.language === this.language);
  }

  defaultLanguageValues(): MetadataValue[] {
    return this.mdValues.filter(value => value.language === this.defaultLanguage);
  }

  emptyLanguageValues(): MetadataValue[] {
      return this.mdValues.filter(val => isEmpty(val.language));
  }

  currentLanguageValueOrDefault(): MetadataValue[] {
    let mdValues = this.currentLanguageValues();
    if (!mdValues.length) {
      mdValues = this.defaultLanguageValues();
    }
    if (!mdValues.length) {
      mdValues = this.emptyLanguageValues();
    }
    return mdValues;
  }

}
