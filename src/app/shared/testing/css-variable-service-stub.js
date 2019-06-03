import { of as observableOf } from 'rxjs';
var variables = {
    smMin: '576px,',
    mdMin: '768px,',
    lgMin: '992px',
    xlMin: '1200px',
};
var CSSVariableServiceStub = /** @class */ (function () {
    function CSSVariableServiceStub() {
    }
    CSSVariableServiceStub.prototype.getVariable = function (name) {
        return observableOf('500px');
    };
    CSSVariableServiceStub.prototype.getAllVariables = function (name) {
        return observableOf(variables);
    };
    CSSVariableServiceStub.prototype.addCSSVariable = function (name, value) {
        /**/
    };
    return CSSVariableServiceStub;
}());
export { CSSVariableServiceStub };
//# sourceMappingURL=css-variable-service-stub.js.map