import {
  DynamicFormControlLayout,
  DynamicRadioGroupModel,
  DynamicRadioGroupModelConfig,
  serializable
} from '@ng-dynamic-forms/core';
import { VocabularyOptions } from '../../../../../../core/submission/vocabularies/models/vocabulary-options.model';
import { hasValue } from '../../../../../empty.util';
import { VocabularyEntry } from '../../../../../../core/submission/vocabularies/models/vocabulary-entry.model';

export interface DynamicListModelConfig extends DynamicRadioGroupModelConfig<any> {
  vocabularyOptions: VocabularyOptions;
  groupLength?: number;
  repeatable: boolean;
  value?: VocabularyEntry[];
  required: boolean;
  hint?: string;
}

export class DynamicListRadioGroupModel extends DynamicRadioGroupModel<any> {

  @serializable() vocabularyOptions: VocabularyOptions;
  @serializable() repeatable: boolean;
  @serializable() groupLength: number;
  @serializable() required: boolean;
  @serializable() hint: string;
  isListGroup = true;

  constructor(config: DynamicListModelConfig, layout?: DynamicFormControlLayout) {
    super(config, layout);

    this.vocabularyOptions = config.vocabularyOptions;
    this.groupLength = config.groupLength || 5;
    this.repeatable = config.repeatable;
    this.required = config.required;
    this.hint = config.hint;
    this.value = config.value;
  }

  get hasAuthority(): boolean {
    return this.vocabularyOptions && hasValue(this.vocabularyOptions.name);
  }
}
