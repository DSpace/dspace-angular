import { of as observableOf } from 'rxjs';

export const MathServiceMock = jasmine.createSpyObj('MathService', {
  ready: jasmine.createSpy('ready').and.returnValue(observableOf(true)),
  render: jasmine.createSpy('render'),
});
