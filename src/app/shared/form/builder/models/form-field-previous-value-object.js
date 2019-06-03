import { isEqual } from 'lodash';
var FormFieldPreviousValueObject = /** @class */ (function () {
    function FormFieldPreviousValueObject(path, value) {
        if (path === void 0) { path = null; }
        if (value === void 0) { value = null; }
        this._path = path;
        this._value = value;
    }
    Object.defineProperty(FormFieldPreviousValueObject.prototype, "path", {
        get: function () {
            return this._path;
        },
        set: function (path) {
            this._path = path;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormFieldPreviousValueObject.prototype, "value", {
        get: function () {
            return this._value;
        },
        set: function (value) {
            this._value = value;
        },
        enumerable: true,
        configurable: true
    });
    FormFieldPreviousValueObject.prototype.delete = function () {
        this._value = null;
        this._path = null;
    };
    FormFieldPreviousValueObject.prototype.isPathEqual = function (path) {
        return this._path && isEqual(this._path, path);
    };
    return FormFieldPreviousValueObject;
}());
export { FormFieldPreviousValueObject };
//# sourceMappingURL=form-field-previous-value-object.js.map