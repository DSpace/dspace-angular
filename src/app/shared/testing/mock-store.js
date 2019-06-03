import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { ActionsSubject, ReducerManager, StateObservable, Store } from '@ngrx/store';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
var MockStore = /** @class */ (function (_super) {
    tslib_1.__extends(MockStore, _super);
    function MockStore(state$, actionsObserver, reducerManager) {
        var _this = _super.call(this, state$, actionsObserver, reducerManager) || this;
        _this.stateSubject = new BehaviorSubject({});
        _this.source = _this.stateSubject.asObservable();
        return _this;
    }
    MockStore.prototype.nextState = function (nextState) {
        this.stateSubject.next(nextState);
    };
    MockStore = tslib_1.__decorate([
        Injectable(),
        tslib_1.__metadata("design:paramtypes", [StateObservable,
            ActionsSubject,
            ReducerManager])
    ], MockStore);
    return MockStore;
}(Store));
export { MockStore };
//# sourceMappingURL=mock-store.js.map