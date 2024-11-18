import { Inject } from '@angular/core';
import { FormFieldModel } from '../models/form-field.model';
import { ConcatFieldParser } from './concat-field-parser';
import { CONFIG_DATA, INIT_FORM_VALUES, PARSER_OPTIONS, SECURITY_CONFIG, SUBMISSION_ID } from './field-parser';
import { ParserOptions } from './parser-options';
import { FormFieldMetadataValueObject } from '../models/form-field-metadata-value.model';
import { DynamicFormControlLayout } from '@ng-dynamic-forms/core';
import {
    CONCAT_FIRST_INPUT_SUFFIX, CONCAT_SECOND_INPUT_SUFFIX,
    DynamicConcatModelConfig
} from '../ds-dynamic-form-ui/models/ds-dynamic-concat.model';
import { DsDynamicInputModel, DsDynamicInputModelConfig } from '../ds-dynamic-form-ui/models/ds-dynamic-input.model';
import { hasNoValue, hasValue, isNotEmpty } from '../../../empty.util';
import { DynamicLinkModel } from '../ds-dynamic-form-ui/models/ds-dynamic-link.model';
import { TranslateService } from '@ngx-translate/core';

export class LinkFieldParser extends ConcatFieldParser {

    constructor(
        @Inject(SUBMISSION_ID) submissionId: string,
        @Inject(CONFIG_DATA) configData: FormFieldModel,
        @Inject(INIT_FORM_VALUES) initFormValues,
        @Inject(PARSER_OPTIONS) parserOptions: ParserOptions,
        @Inject(SECURITY_CONFIG) securityConfig: any = null,
        translateService: TranslateService
    ) {
        super(submissionId, configData, initFormValues, parserOptions, securityConfig, translateService, ',', 'Label', 'Value');
    }

    public modelFactory(fieldValue?: FormFieldMetadataValueObject | any, label?: boolean): any {
        let clsGroup: DynamicFormControlLayout;
        let clsInput1: DynamicFormControlLayout;
        let clsInput2: DynamicFormControlLayout;
        const id: string = this.configData.selectableMetadata[0].metadata;

        clsInput1 = {
            grid: {
                host: 'col-sm-6'
            }
        };
        clsInput2 = {
            grid: {
                host: 'col-sm-6 d-flex flex-column justify-content-start'
            }
        };

        const concatGroup: DynamicConcatModelConfig = this.initModel(id, label, false, true);

        concatGroup.group = [];

        const input1ModelConfig: DsDynamicInputModelConfig = this.initModel(
            id + CONCAT_FIRST_INPUT_SUFFIX,
            false,
            true,
            true,
            false
        );
        input1ModelConfig.name = this.getFieldId();
        const input2ModelConfig: DsDynamicInputModelConfig = this.initModel(
            id + CONCAT_SECOND_INPUT_SUFFIX,
            false,
            true,
            false,
            false
        );

        input1ModelConfig.hideErrorMessages = true;
        input2ModelConfig.hideErrorMessages = true;

        if (hasNoValue(concatGroup.hint) && hasValue(input1ModelConfig.hint) && hasNoValue(input2ModelConfig.hint)) {
            concatGroup.hint = input1ModelConfig.hint;
            input1ModelConfig.hint = undefined;
        }

        if (this.configData.mandatory) {
            concatGroup.required = true;
            input1ModelConfig.required = true;
        }

        concatGroup.disabled = input1ModelConfig.readOnly;

        if (isNotEmpty(this.firstPlaceholder)) {
            input1ModelConfig.placeholder = this.firstPlaceholder;
        }

        if (isNotEmpty(this.secondPlaceholder)) {
            input2ModelConfig.placeholder = this.secondPlaceholder;
        }

        // Split placeholder if is like 'placeholder1/placeholder2'
        const placeholder = this.configData.label.split('/');
        if (placeholder.length === 2) {
            input1ModelConfig.placeholder = placeholder[0];
            input2ModelConfig.placeholder = placeholder[1];
        }

        const model1 = new DsDynamicInputModel(input1ModelConfig, clsInput1);
        const model2 = new DsDynamicInputModel(input2ModelConfig, clsInput2);

        // only for the first input add security visibility
        (model1 as any).toggleSecurityVisibility = false;
        (model2 as any).toggleSecurityVisibility = false;
        // attach the security config for children
        (model1 as any).securityConfigLevel = (concatGroup as any).securityConfigLevel;
        (model2 as any).securityConfigLevel = (concatGroup as any).securityConfigLevel;
        concatGroup.group.push(model1);
        concatGroup.group.push(model2);

        clsGroup = {
            element: {
                control: 'form-row',
            }
        };
        this.initSecurityValue(concatGroup, fieldValue);
        const concatModel = new DynamicLinkModel(concatGroup, clsGroup);
        concatModel.name = this.getFieldId();
        // Init values
        if (isNotEmpty(fieldValue)) {
            concatModel.value = fieldValue;
        }


        return concatModel;
    }

}
