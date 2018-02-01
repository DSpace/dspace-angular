import { ClsConfig, DynamicInputModel, DynamicInputModelConfig, serializable } from '@ng-dynamic-forms/core';
import { Subject } from 'rxjs/Subject';
import { LanguageCode } from '../../models/form-field-language-value.model';
import { AuthorityModel } from '../../../../../core/integration/models/authority.model';

export interface DsDynamicInputModelConfig extends DynamicInputModelConfig {
  languageCodes: LanguageCode[];
  language?: string;
  value?: any;
}

export class DsDynamicInputModel extends DynamicInputModel {
  @serializable() private _languageCodes: LanguageCode[];
  @serializable() private _language: string;
  @serializable() languageUpdates: Subject<string>;

  constructor(config: DsDynamicInputModelConfig, cls?: ClsConfig) {
    super(config, cls);

    console.log(this.id);
    console.log(config.value);
    console.log(config.language);

    this.value = config.value;
    this.language = config.language;
    if (!this.language) {
      // TypeAhead
      if (config.value instanceof AuthorityModel) {
        this.language = config.value.language;
      } else if (Array.isArray(config.value)){
        // Tag of Authority
        if (config.value[0].language) {
          this.language = config.value[0].language;
        }
      }
    }
    this.languageCodes = config.languageCodes;

    this.languageUpdates = new Subject<string>();
    this.languageUpdates.subscribe((lang: string) => {
      this.language = lang;
    });
  }

  hasLanguages(): boolean {
    if (this.languageCodes && this.languageCodes.length > 1) {
      return true;
    }
  }

  get language(): string {
    return this._language;
  }

  set language(language: string) {
    this._language = language;
  }

  get languageCodes(): LanguageCode[] {
    return this._languageCodes;
  }

  set languageCodes(languageCodes: LanguageCode[]) {
    this._languageCodes = languageCodes;
    if (!this.language || this.language === null || this.language === '') {
      this.language = this.languageCodes ? this.languageCodes[0].code : null;
    }
  }

}
