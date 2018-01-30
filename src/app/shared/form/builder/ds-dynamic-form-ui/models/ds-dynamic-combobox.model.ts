import { ClsConfig, DynamicFormGroupModel, DynamicInputModelConfig, serializable } from '@ng-dynamic-forms/core';
import { DsDynamicInputModel, DsDynamicInputModelConfig, Language } from './ds-dynamic-input.model';
import { Subject } from 'rxjs/Subject';
import { DynamicFormGroupModelConfig } from '@ng-dynamic-forms/core/src/model/form-group/dynamic-form-group.model';

export const COMBOBOX_GROUP_SUFFIX = '_COMBO_GROUP';
export const COMBOBOX_METADATA_SUFFIX = '_COMBO_METADATA';
export const COMBOBOX_VALUE_SUFFIX = '_COMBO_VALUE';

export interface DsDynamicComboboxModelConfig extends DynamicFormGroupModelConfig {
  languages: Language[];
  language: string;
}

export class DynamicComboboxModel extends DynamicFormGroupModel {
  @serializable() private _languages: Language[];
  @serializable() private _language: string;
  @serializable() languageUpdates: Subject<string>;

  constructor(config: DsDynamicComboboxModelConfig, cls?: ClsConfig) {
    super(config, cls);

    this.languages = config.languages;
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

  get languages(): Language[] {
    return this._languages;
  }

  set languages(languages: Language[]) {
    this._languages = languages;
    this.language = this.language || this.languages ? this.languages[0].code : null;
  }

}
