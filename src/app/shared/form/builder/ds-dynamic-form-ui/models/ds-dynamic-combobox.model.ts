import { ClsConfig, DynamicFormGroupModel, DynamicInputModelConfig, serializable } from '@ng-dynamic-forms/core';
import { DsDynamicInputModel, DsDynamicInputModelConfig} from './ds-dynamic-input.model';
import { Subject } from 'rxjs/Subject';
import { DynamicFormGroupModelConfig } from '@ng-dynamic-forms/core/src/model/form-group/dynamic-form-group.model';
import { LanguageCode } from '../../models/form-field-language-value.model';

export const COMBOBOX_GROUP_SUFFIX = '_COMBO_GROUP';
export const COMBOBOX_METADATA_SUFFIX = '_COMBO_METADATA';
export const COMBOBOX_VALUE_SUFFIX = '_COMBO_VALUE';

export interface DsDynamicComboboxModelConfig extends DynamicFormGroupModelConfig {
  languageCodes: LanguageCode[];
  language: string;
}

export class DynamicComboboxModel extends DynamicFormGroupModel {
  @serializable() private _languageCodes: LanguageCode[];
  @serializable() private _language: string;
  @serializable() languageUpdates: Subject<string>;

  constructor(config: DsDynamicComboboxModelConfig, cls?: ClsConfig) {
    super(config, cls);

    this.languageCodes = config.languageCodes;
    this.languageUpdates = new Subject<string>();
    this.languageUpdates.subscribe((lang: string) => {
      this.language = lang;
    });
  }

  get value() {
    return (this.get(1) as DsDynamicInputModel).value;
  }

  get qualdropId(): string {
    return (this.get(0) as DsDynamicInputModel).value.toString();
  }

  hasLanguages() {
    return false;
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

  set languageCodes(languages: LanguageCode[]) {
    this._languageCodes = languages;
    this.language = this.language || this.languageCodes ? this.languageCodes[0].code : null;
  }

}
