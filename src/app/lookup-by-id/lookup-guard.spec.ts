import { of as observableOf } from 'rxjs';

import { IdentifierType } from '../core/data/request.models';
import { lookupGuard } from './lookup-guard';

describe('lookupGuard', () => {
  let dsoService: any;
  let guard: any;

  beforeEach(() => {
    dsoService = {
      findByIdAndIDType: jasmine.createSpy('findByIdAndIDType').and.returnValue(observableOf({ hasFailed: false,
        hasSucceeded: true })),
    };
    guard = lookupGuard;
  });

  it('should call findByIdAndIDType with handle params', () => {
    const scopedRoute = {
      params: {
        id: '1234',
        idType: '123456789',
      },
    };
    guard(scopedRoute as any, undefined, dsoService);
    expect(dsoService.findByIdAndIDType).toHaveBeenCalledWith('hdl:123456789/1234', IdentifierType.HANDLE);
  });

  it('should call findByIdAndIDType with handle params', () => {
    const scopedRoute = {
      params: {
        id: '123456789%2F1234',
        idType: 'handle',
      },
    };
    guard(scopedRoute as any, undefined, dsoService);
    expect(dsoService.findByIdAndIDType).toHaveBeenCalledWith('hdl:123456789%2F1234', IdentifierType.HANDLE);
  });

  it('should call findByIdAndIDType with UUID params', () => {
    const scopedRoute = {
      params: {
        id: '34cfed7c-f597-49ef-9cbe-ea351f0023c2',
        idType: 'uuid',
      },
    };
    guard(scopedRoute as any, undefined, dsoService);
    expect(dsoService.findByIdAndIDType).toHaveBeenCalledWith('34cfed7c-f597-49ef-9cbe-ea351f0023c2', IdentifierType.UUID);
  });

});
