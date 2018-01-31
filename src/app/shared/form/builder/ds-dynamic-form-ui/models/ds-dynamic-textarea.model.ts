import { ClsConfig, DynamicTextAreaModel, DynamicTextAreaModelConfig, serializable } from '@ng-dynamic-forms/core';
import { Subject } from 'rxjs/Subject';
import { LanguageCode } from '../../models/form-field-language-value.model';

export interface DsDynamicTextAreaModelConfig extends DynamicTextAreaModelConfig {
  languageCodes: LanguageCode[];
  language: string;
}

export class DsDynamicTextAreaModel extends DynamicTextAreaModel {
  @serializable() private _language: string;
  @serializable() private _languageCodes: LanguageCode[];
  @serializable() languageUpdates: Subject<string>;

  constructor(config: DsDynamicTextAreaModelConfig, cls?: ClsConfig) {
    super(config, cls);

    this.value = config.value;
    this.languageCodes = config.languageCodes;
    this.language = config.language;

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
      this.language = this.languageCodes ? this.languageCodes[0].code : null
    }
  }

}
