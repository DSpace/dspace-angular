import {
  ClsConfig, DynamicFormGroupModel, DynamicFormGroupModelConfig, DynamicInputModel, DynamicInputModelConfig,
  serializable
} from '@ng-dynamic-forms/core';
import { isNotEmpty } from '../../../../empty.util';
import { Subject } from 'rxjs/Subject';

export interface DsDynamicInputModelConfig extends DynamicInputModelConfig {
  languages: Language[];
  language: Language;
}

export class DsDynamicInputModel extends DynamicInputModel {

  @serializable() languages: Language[];
  @serializable() language: Language;
  @serializable() languageUpdates: Subject<Language>;

  constructor(config: DsDynamicInputModelConfig, cls?: ClsConfig) {
    super(config, cls);

    this.languages = config.languages;
    this.language = config.language;
  }

  hasLanguages(): boolean {
    if (this.languages && this.languages.length > 1) {
      return true;
    }
  }

}

export interface Language {
  display: string;
  code: string;
}
