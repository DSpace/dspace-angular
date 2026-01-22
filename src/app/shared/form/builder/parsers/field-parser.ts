import {
  Inject,
  InjectionToken,
} from '@angular/core';
import { FormFieldModel } from '@dspace/core/shared/form/models/form-field.model';
import { FormFieldMetadataValueObject } from '@dspace/core/shared/form/models/form-field-metadata-value.model';
import { RelationshipOptions } from '@dspace/core/shared/relationship-options.model';
import { SectionVisibility } from '@dspace/core/submission/models/section-visibility.model';
import { SubmissionScopeType } from '@dspace/core/submission/submission-scope-type';
import { VisibilityType } from '@dspace/core/submission/visibility-type';
import { VocabularyOptions } from '@dspace/core/submission/vocabularies/models/vocabulary-options.model';
import { isNgbDateStruct } from '@dspace/shared/utils/date.util';
import {
  hasValue,
  isNotEmpty,
  isNotNull,
  isNotUndefined,
} from '@dspace/shared/utils/empty.util';
import { DynamicFormControlLayout } from '@ng-dynamic-forms/core';
import { TranslateService } from '@ngx-translate/core';
import uniqueId from 'lodash/uniqueId';

import {
  DsDynamicInputModel,
  DsDynamicInputModelConfig,
} from '../ds-dynamic-form-ui/models/ds-dynamic-input.model';
import {
  DynamicRowArrayModel,
  DynamicRowArrayModelConfig,
} from '../ds-dynamic-form-ui/models/ds-dynamic-row-array-model';
import { getTypeBindRelations } from '../ds-dynamic-form-ui/type-bind.utils';
import { setLayout } from './parser.utils';
import { ParserOptions } from './parser-options';
import { ParserType } from './parser-type';

export const SUBMISSION_ID: InjectionToken<string> = new InjectionToken<string>('submissionId');
export const CONFIG_DATA: InjectionToken<FormFieldModel> = new InjectionToken<FormFieldModel>('configData');
export const INIT_FORM_VALUES: InjectionToken<any> = new InjectionToken<any>('initFormValues');
export const PARSER_OPTIONS: InjectionToken<ParserOptions> = new InjectionToken<ParserOptions>('parserOptions');
/**
 * This pattern checks that a regex field uses the common ECMAScript format: `/{pattern}/{flags}`, in which the flags
 * are part of the regex, or a simpler one with only pattern `/{pattern}/` or `{pattern}`.
 * The regex itself is encapsulated inside a `RegExp` object, that will validate the pattern syntax.
 */
export const REGEX_FIELD_VALIDATOR = new RegExp('(\\/?)(.+)\\1([gimsuy]*)', 'i');

export abstract class FieldParser {

  protected fieldId: string;
  /**
   * This is the field to use for type binding
   * @protected
   */
  protected typeField: string;

  constructor(
    @Inject(SUBMISSION_ID) protected submissionId: string,
    @Inject(CONFIG_DATA) protected configData: FormFieldModel,
    @Inject(INIT_FORM_VALUES) protected initFormValues: any,
    @Inject(PARSER_OPTIONS) protected parserOptions: ParserOptions,
    protected translate: TranslateService,
  ) {
  }

  public abstract modelFactory(fieldValue?: FormFieldMetadataValueObject, label?: boolean): any;

  public parse() {
    if (((this.getInitValueCount() > 1 && !this.configData.repeatable) || (this.configData.repeatable))
      && (this.configData.input.type !== ParserType.List.valueOf())
      && (this.configData.input.type !== ParserType.Tag.valueOf())
    ) {
      let arrayCounter = 0;
      let fieldArrayCounter = 0;

      let metadataKey;

      if (Array.isArray(this.configData.selectableMetadata) && this.configData.selectableMetadata.length === 1) {
        metadataKey = this.configData.selectableMetadata[0].metadata;
      }

      let isDraggable = true;
      if (this.configData.input.type === ParserType.Onebox.valueOf() && this.configData?.selectableMetadata?.length > 1) {
        isDraggable = false;
      }
      const config = {
        id: uniqueId() + '_array',
        label: this.configData.label,
        initialCount: this.getInitArrayIndex(),
        notRepeatable: !this.configData.repeatable,
        relationshipConfig: this.configData.selectableRelationship,
        required: JSON.parse(this.configData.mandatory),
        submissionId: this.submissionId,
        metadataKey,
        metadataFields: this.getAllFieldIds(),
        hasSelectableMetadata: isNotEmpty(this.configData.selectableMetadata),
        isDraggable,
        typeBindRelations: isNotEmpty(this.configData.typeBind) ? getTypeBindRelations(this.configData.typeBind,
          this.parserOptions.typeField) : null,
        groupFactory: () => {
          let model;
          if ((arrayCounter === 0)) {
            model = this.modelFactory();
            arrayCounter++;
          } else {
            const fieldArrayOfValueLength = this.getInitValueCount(arrayCounter - 1);
            let fieldValue = null;
            if (fieldArrayOfValueLength > 0) {
              fieldValue = this.getInitFieldValue(arrayCounter - 1, fieldArrayCounter++);
              if (fieldArrayCounter === fieldArrayOfValueLength) {
                fieldArrayCounter = 0;
                arrayCounter++;
              }
            }
            model = this.modelFactory(fieldValue, false);
          }
          setLayout(model, 'element', 'host', 'col');
          if (model.hasLanguages || isNotEmpty(model.relationship)) {
            setLayout(model, 'grid', 'control', 'col');
          }
          return [model];
        },
      } as DynamicRowArrayModelConfig;

      const layout: DynamicFormControlLayout = {
        grid: {
          group: 'row',
        },
      };

      return new DynamicRowArrayModel(config, layout);

    } else {
      const model = this.modelFactory(this.getInitFieldValue());
      model.submissionId = this.submissionId;
      if (model.hasLanguages || isNotEmpty(model.relationship)) {
        setLayout(model, 'grid', 'control', 'col');
      }
      return model;
    }
  }

  public setVocabularyOptions(controlModel) {
    if (isNotEmpty(this.configData.selectableMetadata) && isNotEmpty(this.configData.selectableMetadata[0].controlledVocabulary)) {
      controlModel.vocabularyOptions = new VocabularyOptions(
        this.configData.selectableMetadata[0].controlledVocabulary,
        this.configData.selectableMetadata[0].closed,
      );
    }
  }

  public setValues(modelConfig: DsDynamicInputModelConfig, fieldValue: any, forceValueAsObj: boolean = false, groupModel?: boolean) {
    if (isNotEmpty(fieldValue)) {
      if (groupModel) {
        // Array, values is an array
        modelConfig.value = this.getInitGroupValues();
        if (Array.isArray(modelConfig.value) && modelConfig.value.length > 0 && modelConfig.value[0].language) {
          // Array Item has language, ex. AuthorityModel
          modelConfig.language = modelConfig.value[0].language;
        }
        return;
      }

      if (isNgbDateStruct(fieldValue)) {
        modelConfig.value = fieldValue;
      } else if (typeof fieldValue === 'object') {
        modelConfig.metadataValue = fieldValue;
        modelConfig.language = fieldValue.language;
        modelConfig.place = fieldValue.place;
        if (forceValueAsObj) {
          modelConfig.value = fieldValue;
        } else {
          modelConfig.value = fieldValue.value;
        }
      } else {
        if (forceValueAsObj) {
          // If value isn't an instance of FormFieldMetadataValueObject instantiate it
          modelConfig.value = new FormFieldMetadataValueObject(fieldValue);
        } else {
          if (typeof fieldValue === 'string') {
            // Case only string
            modelConfig.value = fieldValue;
          }
        }
      }
    }

    return modelConfig;
  }

  protected getInitValueCount(index = 0, fieldId?): number {
    const fieldIds = fieldId || this.getAllFieldIds();
    if (isNotEmpty(this.initFormValues) && isNotNull(fieldIds) && fieldIds.length === 1 && this.initFormValues.hasOwnProperty(fieldIds[0])) {
      return this.initFormValues[fieldIds[0]].length;
    } else if (isNotEmpty(this.initFormValues) && isNotNull(fieldIds) && fieldIds.length > 1) {
      const values = [];
      fieldIds.forEach((id) => {
        if (this.initFormValues.hasOwnProperty(id)) {
          values.push(this.initFormValues[id].length);
        }
      });
      return values[index];
    } else {
      return 0;
    }
  }

  protected getInitGroupValues(): FormFieldMetadataValueObject[] {
    const fieldIds = this.getAllFieldIds();
    if (isNotEmpty(this.initFormValues) && isNotNull(fieldIds) && fieldIds.length === 1 && this.initFormValues.hasOwnProperty(fieldIds[0])) {
      return this.initFormValues[fieldIds[0]];
    }
  }

  protected getInitFieldValues(fieldId): FormFieldMetadataValueObject[] {
    if (isNotEmpty(this.initFormValues) && isNotNull(fieldId) && this.initFormValues.hasOwnProperty(fieldId)) {
      return this.initFormValues[fieldId];
    }
  }

  protected getInitFieldValue(outerIndex = 0, innerIndex = 0, fieldId?): FormFieldMetadataValueObject {
    const fieldIds = fieldId || this.getAllFieldIds();
    if (isNotEmpty(this.initFormValues)
      && isNotNull(fieldIds)
      && fieldIds.length === 1
      && this.initFormValues.hasOwnProperty(fieldIds[outerIndex])
      && this.initFormValues[fieldIds[outerIndex]].length > innerIndex) {
      return this.initFormValues[fieldIds[outerIndex]][innerIndex];
    } else if (isNotEmpty(this.initFormValues) && isNotNull(fieldIds) && fieldIds.length > 1) {
      const values: FormFieldMetadataValueObject[] = [];
      fieldIds.forEach((id) => {
        if (this.initFormValues.hasOwnProperty(id)) {
          const valueObj: FormFieldMetadataValueObject = Object.assign(new FormFieldMetadataValueObject(), this.initFormValues[id][innerIndex]);
          // Set metadata name, used for Qualdrop fields
          valueObj.metadata = id;
          values.push(valueObj);
        }
      });
      return values[outerIndex];
    } else {
      return null;
    }
  }

  protected getInitArrayIndex() {
    const fieldIds: any = this.getAllFieldIds();
    if (isNotEmpty(this.initFormValues) && isNotNull(fieldIds) && fieldIds.length === 1 && this.initFormValues.hasOwnProperty(fieldIds)) {
      return this.initFormValues[fieldIds].length;
    } else if (isNotEmpty(this.initFormValues) && isNotNull(fieldIds) && fieldIds.length > 1) {
      let counter = 0;
      fieldIds.forEach((id) => {
        if (this.initFormValues.hasOwnProperty(id)) {
          counter = counter + this.initFormValues[id].length;
        }
      });
      return (counter === 0) ? 1 : counter;
    } else {
      return 1;
    }
  }

  protected getFieldId(): string {
    const ids = this.getAllFieldIds();
    return isNotNull(ids) ? ids[0] : null;
  }

  protected getAllFieldIds(): string[] {
    if (Array.isArray(this.configData.selectableMetadata)) {
      if (this.configData.selectableMetadata.length === 1) {
        return [this.configData.selectableMetadata[0].metadata];
      } else {
        const ids = [];
        this.configData.selectableMetadata.forEach((entry) => ids.push(entry.metadata));
        return ids;
      }
    } else {
      return ['relation.' + this.configData.selectableRelationship.relationshipType];
    }
  }

  protected initModel(id?: string, label = true, labelEmpty = false, setErrors = true, hint = true) {

    const controlModel = Object.create(null);

    // Sets input ID
    this.fieldId = id ? id : this.getFieldId();

    // Sets input name (with the original field's id value)
    controlModel.name = this.fieldId;

    // input ID doesn't allow dots, so replace them
    controlModel.id = (this.fieldId).replace(/\./g, '_');

    // Set read only option
    controlModel.readOnly = this.parserOptions.readOnly || this.isFieldReadOnly(this.configData.visibility, this.configData.scope, this.parserOptions.submissionScope);
    controlModel.disabled = controlModel.readOnly;
    if (hasValue(this.configData.selectableRelationship)) {
      controlModel.relationship = Object.assign(new RelationshipOptions(), this.configData.selectableRelationship);
    }
    controlModel.repeatable = this.configData.repeatable;
    controlModel.metadataFields = this.getAllFieldIds() || [];
    controlModel.hasSelectableMetadata = isNotEmpty(this.configData.selectableMetadata);
    controlModel.submissionId = this.submissionId;

    // Set label
    this.setLabel(controlModel, label);
    if (hint) {
      controlModel.hint = this.configData.hints || '&nbsp;';
    }
    controlModel.placeholder = this.configData.label;

    if (this.configData.mandatory && setErrors) {
      this.markAsRequired(controlModel);
    }

    if (this.hasRegex()) {
      this.addPatternValidator(controlModel);
    }

    // Available Languages
    if (this.configData.languageCodes && this.configData.languageCodes.length > 0) {
      (controlModel as DsDynamicInputModel).languageCodes = this.configData.languageCodes;
    }

    // If typeBind is configured
    if (isNotEmpty(this.configData.typeBind)) {
      (controlModel as DsDynamicInputModel).typeBindRelations = getTypeBindRelations(this.configData.typeBind,
        this.parserOptions.typeField);
    }

    return controlModel;
  }

  /**
   * Checks if a field is read-only with the given scope.
   * The field is readonly when submissionScope is WORKSPACE and the main visibility is READONLY
   * or when submissionScope is WORKFLOW and the other visibility is READONLY
   * @param visibility
   * @param submissionScope
   */
  private isFieldReadOnly(visibility: SectionVisibility, fieldScope: string, submissionScope: string) {
    return isNotEmpty(submissionScope)
      && isNotEmpty(fieldScope)
      && isNotEmpty(visibility)
      && ((
        submissionScope === SubmissionScopeType.WorkspaceItem.valueOf()
          && visibility.main === VisibilityType.READONLY
      )
        ||
          (visibility.other === VisibilityType.READONLY
          && submissionScope === SubmissionScopeType.WorkflowItem.valueOf()
          )
      );
  }

  protected hasRegex() {
    return hasValue(this.configData.input.regex);
  }

  /**
   * Adds pattern validation to `controlModel`, it uses the encapsulated `configData` to test the regex,
   * contained in the input config, against the common `ECMAScript` standard validator {@link REGEX_FIELD_VALIDATOR},
   * and creates an equivalent `RegExp` object that will be used during form-validation against the user-input.
   * @param controlModel
   * @protected
   */
  protected addPatternValidator(controlModel) {
    const validatorMatcher = this.configData.input.regex.match(REGEX_FIELD_VALIDATOR);
    let regex;
    if (validatorMatcher != null && validatorMatcher.length > 3) {
      regex = new RegExp(validatorMatcher[2], validatorMatcher[3]);
    } else {
      regex = new RegExp(this.configData.input.regex);
    }
    const baseTranslationKey = 'error.validation.pattern';
    const fieldranslationKey = `${baseTranslationKey}.${controlModel.id}`;
    const fieldTranslationExists = this.translate.instant(fieldranslationKey) !== fieldranslationKey;
    controlModel.validators = Object.assign({}, controlModel.validators, { pattern: regex });
    controlModel.errorMessages = Object.assign(
      {},
      controlModel.errorMessages,
      { pattern: fieldTranslationExists ? fieldranslationKey : baseTranslationKey });
  }

  protected markAsRequired(controlModel) {
    controlModel.required = true;
    controlModel.validators = Object.assign({}, controlModel.validators, { required: null });
    controlModel.errorMessages = Object.assign(
      {},
      controlModel.errorMessages,
      { required: this.configData.mandatoryMessage });
  }

  protected setLabel(controlModel, label = true, labelEmpty = false) {
    if (label) {
      controlModel.label = (labelEmpty) ? '&nbsp;' : this.configData.label;
    }
  }

  protected setOptions(controlModel) {
    // Checks if field has multiple values and sets options available
    if (isNotUndefined(this.configData.selectableMetadata) && this.configData.selectableMetadata.length > 1) {
      controlModel.options = [];
      this.configData.selectableMetadata.forEach((option, key) => {
        if (key === 0) {
          controlModel.value = option.metadata;
        }
        controlModel.options.push({ label: option.label, value: option.metadata });
      });
    }
  }

}
