import { RoleType } from '../../core/roles/role-types';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
var MockRoleService = /** @class */ (function () {
    function MockRoleService() {
        this._isSubmitter = new BehaviorSubject(true);
        this._isController = new BehaviorSubject(true);
        this._isAdmin = new BehaviorSubject(true);
    }
    MockRoleService.prototype.setSubmitter = function (isSubmitter) {
        this._isSubmitter.next(isSubmitter);
    };
    MockRoleService.prototype.setController = function (isController) {
        this._isController.next(isController);
    };
    MockRoleService.prototype.setAdmin = function (isAdmin) {
        this._isAdmin.next(isAdmin);
    };
    MockRoleService.prototype.isSubmitter = function () {
        return this._isSubmitter;
    };
    MockRoleService.prototype.isController = function () {
        return this._isController;
    };
    MockRoleService.prototype.isAdmin = function () {
        return this._isAdmin;
    };
    MockRoleService.prototype.checkRole = function (role) {
        var check;
        switch (role) {
            case RoleType.Submitter:
                check = this.isSubmitter();
                break;
            case RoleType.Controller:
                check = this.isController();
                break;
            case RoleType.Admin:
                check = this.isAdmin();
                break;
        }
        return check;
    };
    return MockRoleService;
}());
export { MockRoleService };
//# sourceMappingURL=mock-role-service.js.map