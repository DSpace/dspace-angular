import { ClsConfig, DynamicTextAreaModel, DynamicTextAreaModelConfig, serializable } from '@ng-dynamic-forms/core';
import { Subject } from 'rxjs/Subject';
import { LanguageCode } from '../../models/form-field-language-value.model';

export interface DsDynamicTextAreaModelConfig extends DynamicTextAreaModelConfig {
  languageCodes: LanguageCode[];
  language: string;
}

export class DsDynamicTextAreaModel extends DynamicTextAreaModel {

  @serializable() private _languageCodes: LanguageCode[];
  @serializable() private _language: string;
  @serializable() languageUpdates: Subject<string>;

  constructor(config: DsDynamicTextAreaModelConfig, cls?: ClsConfig) {
    super(config, cls);

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
    this.language = this.language || this.languageCodes ? this.languageCodes[0].code : null;
  }

}
