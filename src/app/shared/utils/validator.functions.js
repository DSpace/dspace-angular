import { isNotEmpty } from '../empty.util';
/**
 * Returns a validator function to check if the control's value is in a given list
 * @param list The list to look in
 */
export function inListValidator(list) {
    return function (control) {
        var hasValue = isNotEmpty(control.value);
        var inList = true;
        if (isNotEmpty(list)) {
            inList = list.indexOf(control.value) > -1;
        }
        return (hasValue && inList) ? null : { inList: { value: control.value } };
    };
}
//# sourceMappingURL=validator.functions.js.map