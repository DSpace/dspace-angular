import { type } from './shared/ngrx/type';
export var StoreActionTypes = {
    REHYDRATE: type('dspace/ngrx/REHYDRATE'),
    REPLAY: type('dspace/ngrx/REPLAY')
};
var StoreAction = /** @class */ (function () {
    // tslint:disable-next-line:no-shadowed-variable
    function StoreAction(type, payload) {
        this.type = type;
        this.payload = payload;
    }
    return StoreAction;
}());
export { StoreAction };
//# sourceMappingURL=store.actions.js.map