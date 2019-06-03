import { TestBed } from '@angular/core/testing';
/**
 * Returns true if a Native Element has a specified css class.
 *
 * @param element
 *    the Native Element
 * @param className
 *    the class name to find
 */
export var hasClass = function (element, className) {
    var classes = element.getAttribute('class');
    return classes.split(' ').indexOf(className) !== -1;
};
/**
 * Creates an instance of a component and returns test fixture.
 *
 * @param html
 *    the component's template as html
 * @param type
 *    the type of the component to instantiate
 */
export var createTestComponent = function (html, type) {
    TestBed.overrideComponent(type, {
        set: { template: html }
    });
    var fixture = TestBed.createComponent(type);
    fixture.detectChanges();
    return fixture;
};
/**
 * Allows you to spy on a read only property
 *
 * @param obj
 *    The object to spy on
 * @param prop
 *    The property to spy on
 */
export function spyOnOperator(obj, prop) {
    var oldProp = obj[prop];
    Object.defineProperty(obj, prop, {
        configurable: true,
        enumerable: true,
        value: oldProp,
        writable: true
    });
    return spyOn(obj, prop);
}
//# sourceMappingURL=utils.js.map