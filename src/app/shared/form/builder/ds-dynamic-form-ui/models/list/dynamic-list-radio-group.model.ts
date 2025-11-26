import { VocabularyEntry } from '@dspace/core/submission/vocabularies/models/vocabulary-entry.model';
import { VocabularyOptions } from '@dspace/core/submission/vocabularies/models/vocabulary-options.model';
import { hasValue } from '@dspace/shared/utils/empty.util';
import { serializable } from "@ng-dynamic-forms/core/decorator/serializable.decorator";
import { DynamicFormControlLayout } from "@ng-dynamic-forms/core/model/misc/dynamic-form-control-layout.model";
import { DynamicFormControlRelation } from "@ng-dynamic-forms/core/model/misc/dynamic-form-control-relation.model";
import { DynamicRadioGroupModel, DynamicRadioGroupModelConfig } from "@ng-dynamic-forms/core/model/radio/dynamic-radio-group.model";


export interface DynamicListModelConfig extends DynamicRadioGroupModelConfig<any> {
  vocabularyOptions: VocabularyOptions;
  groupLength?: number;
  repeatable: boolean;
  value?: VocabularyEntry[];
  required: boolean;
  hint?: string;
  typeBindRelations?: DynamicFormControlRelation[];
}

export class DynamicListRadioGroupModel extends DynamicRadioGroupModel<any> {

  @serializable() vocabularyOptions: VocabularyOptions;
  @serializable() repeatable: boolean;
  @serializable() typeBindRelations: DynamicFormControlRelation[];
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
    this.typeBindRelations = config.typeBindRelations ? config.typeBindRelations : [];
  }

  get hasAuthority(): boolean {
    return this.vocabularyOptions && hasValue(this.vocabularyOptions.name);
  }
}
