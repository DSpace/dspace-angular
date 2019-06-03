import { type } from '../ngrx/type';
export var HistoryActionTypes = {
    ADD_TO_HISTORY: type('dspace/history/ADD_TO_HISTORY'),
    GET_HISTORY: type('dspace/history/GET_HISTORY')
};
/* tslint:disable:max-classes-per-file */
var AddUrlToHistoryAction = /** @class */ (function () {
    function AddUrlToHistoryAction(url) {
        this.type = HistoryActionTypes.ADD_TO_HISTORY;
        this.payload = { url: url };
    }
    return AddUrlToHistoryAction;
}());
export { AddUrlToHistoryAction };
//# sourceMappingURL=history.actions.js.map