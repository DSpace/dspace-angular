import { of as observableOf } from 'rxjs';
var MenuServiceStub = /** @class */ (function () {
    function MenuServiceStub() {
        this.visibleSection1 = {
            id: 'section',
            visible: true,
            active: false
        };
        this.visibleSection2 = {
            id: 'section_2',
            visible: true
        };
        this.hiddenSection3 = {
            id: 'section_3',
            visible: false
        };
        this.subSection4 = {
            id: 'section_4',
            visible: true,
            parentID: 'section1'
        };
    }
    MenuServiceStub.prototype.toggleMenu = function () {
    };
    ;
    MenuServiceStub.prototype.expandMenu = function () {
    };
    ;
    MenuServiceStub.prototype.collapseMenu = function () {
    };
    ;
    MenuServiceStub.prototype.showMenu = function () {
    };
    ;
    MenuServiceStub.prototype.hideMenu = function () {
    };
    ;
    MenuServiceStub.prototype.expandMenuPreview = function () {
    };
    ;
    MenuServiceStub.prototype.collapseMenuPreview = function () {
    };
    ;
    MenuServiceStub.prototype.toggleActiveSection = function () {
    };
    ;
    MenuServiceStub.prototype.activateSection = function () {
    };
    ;
    MenuServiceStub.prototype.deactivateSection = function () {
    };
    ;
    MenuServiceStub.prototype.addSection = function () {
    };
    ;
    MenuServiceStub.prototype.removeSection = function () {
    };
    ;
    MenuServiceStub.prototype.isMenuVisible = function (id) {
        return observableOf(true);
    };
    ;
    MenuServiceStub.prototype.isMenuCollapsed = function (id) {
        return observableOf(false);
    };
    ;
    MenuServiceStub.prototype.isMenuPreviewCollapsed = function (id) {
        return observableOf(true);
    };
    ;
    MenuServiceStub.prototype.hasSubSections = function (id, sectionID) {
        return observableOf(true);
    };
    ;
    MenuServiceStub.prototype.getMenuTopSections = function (id) {
        return observableOf([this.visibleSection1, this.visibleSection2]);
    };
    ;
    MenuServiceStub.prototype.getSubSectionsByParentID = function (id) {
        return observableOf([this.subSection4]);
    };
    ;
    MenuServiceStub.prototype.isSectionActive = function (id, sectionID) {
        return observableOf(true);
    };
    ;
    MenuServiceStub.prototype.isSectionVisible = function (id, sectionID) {
        return observableOf(true);
    };
    ;
    return MenuServiceStub;
}());
export { MenuServiceStub };
//# sourceMappingURL=menu-service-stub.js.map