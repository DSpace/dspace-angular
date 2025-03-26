
import { DynamicConcatModel } from './ds-dynamic-concat.model';
import { DsDynamicInputModel } from './ds-dynamic-input.model';
import { FormFieldMetadataValueObject } from '../../models/form-field-metadata-value.model';
import { hasNoValue, isNotEmpty,  } from '../../../../empty.util';


export class DynamicLinkModel extends DynamicConcatModel {
    get value() {
        const [firstValue, secondValue] = this.group.map((inputModel: DsDynamicInputModel) =>
            (typeof inputModel.value === 'string') ?
                Object.assign(new FormFieldMetadataValueObject(), {value: inputModel.value, display: inputModel.value}) :
                (inputModel.value as any));
        if (isNotEmpty(firstValue) && isNotEmpty(firstValue.value) && isNotEmpty(secondValue) && isNotEmpty(secondValue.value)) {
            return Object.assign(new FormFieldMetadataValueObject(), firstValue, {value: firstValue.value, authority: secondValue.value});
        } else if (isNotEmpty(firstValue) && isNotEmpty(firstValue.value)) {
            return Object.assign(new FormFieldMetadataValueObject(), firstValue);
        } else if (isNotEmpty(secondValue) && isNotEmpty(secondValue.value)) {
            return Object.assign(new FormFieldMetadataValueObject(), secondValue, {value: secondValue.value, authority: secondValue.value});
        } else {
            return new FormFieldMetadataValueObject();
        }
    }

    set value(value: FormFieldMetadataValueObject) {
        let tempValue: string;

        if (isNotEmpty(value)) {
            tempValue = value?.value;
        }

        if (hasNoValue(tempValue)) {
            tempValue = '';
        }

        if (value.value) {
            (this.get(0) as DsDynamicInputModel).value = tempValue;
        } else {
            (this.get(0) as DsDynamicInputModel).value = undefined;
        }
        if (value?.authority && value.value) {
            (this.get(1) as DsDynamicInputModel).value = value?.authority;
        } else if (value?.authority && !value.value) {
            (this.get(1) as DsDynamicInputModel).value = value?.authority;
            (this.get(0) as DsDynamicInputModel).value = value?.authority;
        }
    }

}
