import {
  DynamicFormControlLayout,
  DynamicFormControlRelation,
  DynamicInputModel,
  DynamicInputModelConfig,
  serializable
} from '@ng-dynamic-forms/core';

import { Subject } from 'rxjs';

import { LanguageCode } from '../../models/form-field-language-value.model';
import { AuthorityOptions } from '../../../../../core/integration/models/authority-options.model';
import { hasValue } from '../../../../empty.util';
import { FormFieldMetadataValueObject } from '../../models/form-field-metadata-value.model';
import { RelationshipOptions } from '../../models/relationship-options.model';

export interface DsDynamicInputModelConfig extends DynamicInputModelConfig {
  authorityOptions?: AuthorityOptions;
  languageCodes?: LanguageCode[];
  language?: string;
  value?: any;
  typeBindRelations?: DynamicFormControlRelation[];
  relationship?: RelationshipOptions;
  repeatable: boolean;
  metadataFields: string[];
  submissionId: string;
}

export class DsDynamicInputModel extends DynamicInputModel {

  @serializable() authorityOptions: AuthorityOptions;
  @serializable() private _languageCodes: LanguageCode[];
  @serializable() private _language: string;
  @serializable() languageUpdates: Subject<string>;
  @serializable() typeBindRelations: DynamicFormControlRelation[];
  @serializable() typeBindHidden = false;
  @serializable() relationship?: RelationshipOptions;
  @serializable() repeatable?: boolean;
  @serializable() metadataFields: string[];
  @serializable() submissionId: string;

  constructor(config: DsDynamicInputModelConfig, layout?: DynamicFormControlLayout) {
    super(config, layout);
    this.repeatable = config.repeatable;
    this.metadataFields = config.metadataFields;
    this.hint = config.hint;
    this.readOnly = config.readOnly;
    this.value = config.value;
    this.relationship = config.relationship;
    this.submissionId = config.submissionId;

    this.language = config.language;
    if (!this.language) {
      // TypeAhead
      if (config.value instanceof FormFieldMetadataValueObject) {
        this.language = config.value.language;
      } else if (Array.isArray(config.value)) {
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

    this.typeBindRelations = config.typeBindRelations ? config.typeBindRelations : [];

    this.authorityOptions = config.authorityOptions;
  }

  get hasAuthority(): boolean {
    return this.authorityOptions && hasValue(this.authorityOptions.name);
  }

  get hasLanguages(): boolean {
    return this.languageCodes && this.languageCodes.length > 1;
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
