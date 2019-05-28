import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RemoteData } from '../../core/data/remote-data';
import { Observable, of as observableOf } from 'rxjs';
import { RemoteDataError } from '../../core/data/remote-data-error';

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
export const createTestComponent = <T>(html: string, type: { new(...args: any[]): T }): ComponentFixture<T> => {
  TestBed.overrideComponent(type, {
    set: {template: html}
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

export function createSuccessfulRemoteDataObject<T>(object: T): RemoteData<T>{
  return new RemoteData(
    false,
    false,
    true,
    undefined,
    object
  );
}

export function createSuccessfulRemoteDataObject$<T>(object: T): Observable<RemoteData<T>>{
  return observableOf(createSuccessfulRemoteDataObject(object));
}

export function createFailedRemoteDataObject<T>(object?: T, error?: RemoteDataError): RemoteData<T>{
  return new RemoteData(
    false,
    false,
    false,
    error,
    object
  );
}

export function createFailedRemoteDataObject$<T>(object?: T, error?: RemoteDataError): Observable<RemoteData<T>>{
  return observableOf(createFailedRemoteDataObject(object, error));
}

export function createPendingRemoteDataObject<T>(object?: T): RemoteData<T>{
  return new RemoteData(
    true,
    true,
    true,
    null,
    object
  );
}

export function createPendingRemoteDataObject$<T>(object?: T): Observable<RemoteData<T>>{
  return observableOf(createPendingRemoteDataObject(object));
}