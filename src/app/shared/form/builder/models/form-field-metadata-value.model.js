import { isEmpty, isNotEmpty, isNotNull } from '../../../empty.util';
import { ConfidenceType } from '../../../../core/integration/models/confidence-type';
import { PLACEHOLDER_PARENT_METADATA } from '../ds-dynamic-form-ui/models/relation-group/dynamic-relation-group.model';
var FormFieldMetadataValueObject = /** @class */ (function () {
    function FormFieldMetadataValueObject(value, language, authority, display, place, confidence, otherInformation, metadata) {
        if (value === void 0) { value = null; }
        if (language === void 0) { language = null; }
        if (authority === void 0) { authority = null; }
        if (display === void 0) { display = null; }
        if (place === void 0) { place = 0; }
        if (confidence === void 0) { confidence = null; }
        if (otherInformation === void 0) { otherInformation = null; }
        if (metadata === void 0) { metadata = null; }
        this.value = isNotNull(value) ? ((typeof value === 'string') ? value.trim() : value) : null;
        this.language = language;
        this.authority = authority;
        this.display = display || value;
        this.confidence = confidence;
        if (authority != null && isEmpty(confidence)) {
            this.confidence = ConfidenceType.CF_ACCEPTED;
        }
        else if (isNotEmpty(confidence)) {
            this.confidence = confidence;
        }
        else {
            this.confidence = ConfidenceType.CF_UNSET;
        }
        this.place = place;
        if (isNotEmpty(metadata)) {
            this.metadata = metadata;
        }
        this.otherInformation = otherInformation;
    }
    FormFieldMetadataValueObject.prototype.hasAuthority = function () {
        return isNotEmpty(this.authority);
    };
    FormFieldMetadataValueObject.prototype.hasValue = function () {
        return isNotEmpty(this.value);
    };
    FormFieldMetadataValueObject.prototype.hasOtherInformation = function () {
        return isNotEmpty(this.otherInformation);
    };
    FormFieldMetadataValueObject.prototype.hasPlaceholder = function () {
        return this.hasValue() && this.value === PLACEHOLDER_PARENT_METADATA;
    };
    return FormFieldMetadataValueObject;
}());
export { FormFieldMetadataValueObject };
//# sourceMappingURL=form-field-metadata-value.model.js.map