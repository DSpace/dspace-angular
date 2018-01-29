import {
  ClsConfig, DynamicFormGroupModel, DynamicFormGroupModelConfig, DynamicInputModel, DynamicInputModelConfig,
  serializable
} from '@ng-dynamic-forms/core';
import { isNotEmpty } from '../../../../empty.util';
import { Subject } from 'rxjs/Subject';
import { AuthorityModel } from '../../../../../core/integration/models/authority.model';

export interface DsDynamicInputModelConfig extends DynamicInputModelConfig {
  languages: Language[];
  language: Language;
}

export class DsDynamicInputModel extends DynamicInputModel {

  @serializable() languages: Language[];
  // @serializable() language: Language;
  @serializable() _language: Language;
  @serializable() languageUpdates: Subject<Language>;

  constructor(config: DsDynamicInputModelConfig, cls?: ClsConfig) {
    super(config, cls);

    this.languages = config.languages;
    // this.language = config.language;
    this._language = {code:'', display:''};

    this.languageUpdates = new Subject<Language>();
    this.languageUpdates.subscribe((lang: Language) => {
      this.language = lang;
      console.log('Language setted to ' + this.language.code);
    });
    this.languageUpdates.next(this.language);
  }

  hasLanguages(): boolean {
    if (this.languages && this.languages.length > 1) {
      return true;
    }
  }

  get language(): Language {
    return this._language;
  }

  set language(language: Language) {
    // if (language) {
    //   if (Array.isArray(language)) {
    //     this._language = language;
    //   } else {
    //     // _language is non extendible so assign it a new array
    //     const newValue = (this.language as Language[]).concat([language]);
    //     this._language = newValue
    //   }
    // }
    this._language = language;
  }

}

export interface Language {
  display: string;
  code: string;
}
