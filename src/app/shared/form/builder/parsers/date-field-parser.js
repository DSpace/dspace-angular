import * as tslib_1 from "tslib";
import { FieldParser } from './field-parser';
import { DynamicDsDatePickerModel } from '../ds-dynamic-form-ui/models/date-picker/date-picker.model';
import { isNotEmpty } from '../../../empty.util';
import { DS_DATE_PICKER_SEPARATOR } from '../ds-dynamic-form-ui/models/date-picker/date-picker.component';
var DateFieldParser = /** @class */ (function (_super) {
    tslib_1.__extends(DateFieldParser, _super);
    function DateFieldParser() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DateFieldParser.prototype.modelFactory = function (fieldValue, label) {
        var malformedDate = false;
        var inputDateModelConfig = this.initModel(null, label);
        inputDateModelConfig.toggleIcon = 'fas fa-calendar';
        this.setValues(inputDateModelConfig, fieldValue);
        // Init Data and validity check
        if (isNotEmpty(inputDateModelConfig.value)) {
            var value = inputDateModelConfig.value.toString();
            if (value.length >= 4) {
                var valuesArray = value.split(DS_DATE_PICKER_SEPARATOR);
                if (valuesArray.length < 4) {
                    for (var i = 0; i < valuesArray.length; i++) {
                        var len = i === 0 ? 4 : 2;
                        if (valuesArray[i].length !== len) {
                            malformedDate = true;
                        }
                    }
                }
            }
        }
        var dateModel = new DynamicDsDatePickerModel(inputDateModelConfig);
        dateModel.malformedDate = malformedDate;
        return dateModel;
    };
    return DateFieldParser;
}(FieldParser));
export { DateFieldParser };
//# sourceMappingURL=date-field-parser.js.map