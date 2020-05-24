import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaginatedList } from '../../core/data/paginated-list';
import { PageInfo } from '../../core/shared/page-info.model';

/**
 * Returns true if a Native Element has a specified css class.
 *
 * @param element
 *    the Native Element
 * @param className
 *    the class name to find
 */
export const hasClass = (element: any, className: string): boolean => {
  const classes = element.getAttribute('class');
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
export const createTestComponent = <T>(html: string, type: new (...args: any[]) => T ): ComponentFixture<T> => {
  TestBed.overrideComponent(type, {
    set: { template: html }
  });
  const fixture = TestBed.createComponent(type);

  fixture.detectChanges();
  return fixture as ComponentFixture<T>;
};

/**
 * Allows you to spy on a read only property
 *
 * @param obj
 *    The object to spy on
 * @param prop
 *    The property to spy on
 */
export function spyOnOperator(obj: any, prop: string): any {
  const oldProp = obj[prop];
  Object.defineProperty(obj, prop, {
    configurable: true,
    enumerable: true,
    value: oldProp,
    writable: true
  });

  return spyOn(obj, prop);
}

/**
 * Method to create a paginated list for an array of objects
 * @param objects An array representing the paginated list's page
 */
export function createPaginatedList<T>(objects?: T[]): PaginatedList<T> {
  return new PaginatedList(new PageInfo(), objects);
}

/**
 * Creates a jasmine spy for an exported function
 * @param target The object to spy on
 * @param prop The property/function to spy on
 */
export function spyOnExported<T>(target: T, prop: keyof T): jasmine.Spy {
  const spy = jasmine.createSpy(`${prop}Spy`);
  spyOnProperty(target, prop).and.returnValue(spy);
  return spy;
}
