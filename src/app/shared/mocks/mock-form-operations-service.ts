import { SectionFormOperationsService } from '../../submission/sections/form/section-form-operations.service';

export function getMockFormOperationsService(): SectionFormOperationsService {
  return jasmine.createSpyObj('SectionFormOperationsService', {
    dispatchOperationsFromEvent: jasmine.createSpy('dispatchOperationsFromEvent'),
    getArrayIndexFromEvent: jasmine.createSpy('getArrayIndexFromEvent'),
    isPartOfArrayOfGroup: jasmine.createSpy('isPartOfArrayOfGroup'),
    getQualdropValueMap: jasmine.createSpy('getQualdropValueMap'),
    getFieldPathFromEvent: jasmine.createSpy('getFieldPathFromEvent'),
    getQualdropItemPathFromEvent: jasmine.createSpy('getQualdropItemPathFromEvent'),
    getFieldPathSegmentedFromChangeEvent: jasmine.createSpy('getFieldPathSegmentedFromChangeEvent'),
    getFieldValueFromChangeEvent: jasmine.createSpy('getFieldValueFromChangeEvent'),
    getValueMap: jasmine.createSpy('getValueMap'),

  });

}
