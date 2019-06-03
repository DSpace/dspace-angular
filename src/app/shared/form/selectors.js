import { createSelector } from '@ngrx/store';
export var formStateSelector = function (state) { return state.forms; };
export function formObjectFromIdSelector(formId) {
    return createSelector(formStateSelector, function (forms) { return forms[formId]; });
}
//# sourceMappingURL=selectors.js.map