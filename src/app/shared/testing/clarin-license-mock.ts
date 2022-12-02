import { ClarinLicenseLabel } from '../../core/shared/clarin/clarin-license-label.model';
import { ClarinLicense } from '../../core/shared/clarin/clarin-license.model';
import { createSuccessfulRemoteDataObject$ } from '../remote-data.utils';
import { buildPaginatedList } from '../../core/data/paginated-list.model';
import { PageInfo } from '../../core/shared/page-info.model';
import { ClarinLicenseRequiredInfo } from '../../core/shared/clarin/clarin-license.resource-type';

/**
 * The mocked Clarin License and Clarin License Label objects for testing.
 */

export const mockClarinRequiredInfo = [Object.assign(new ClarinLicenseRequiredInfo(), {
  id: 0,
  value: 'test rInfo',
  name: 'test rName'
})];

export const mockExtendedLicenseLabel = Object.assign(new ClarinLicenseLabel(), {
  id: 1,
  label: 'exLL',
  title: 'exTTL',
  extended: true,
  icon: [new Blob(['blob string'], {
    type: 'text/plain'
  })],
  _links: {
    self: {
      href: 'url.ex.1'
    }
  }
});

export const mockNonExtendedLicenseLabel = Object.assign(new ClarinLicenseLabel(), {
  id: 2,
  label: 'LLL',
  title: 'licenseLTTL',
  extended: false,
  icon: null,
  _links: {
    self: {
      href: 'url.ex.1'
    }
  }
});

export const mockLicense = Object.assign(new ClarinLicense(), {
  id: 1,
  name: 'test license',
  definition: 'test definition',
  confirmation: 0,
  requiredInfo: mockClarinRequiredInfo,
  clarinLicenseLabel: mockNonExtendedLicenseLabel,
  extendedClarinLicenseLabels: [mockExtendedLicenseLabel],
  bitstreams: 0,
  _links: {
    self: {
      href: 'url.license.1'
    }
  }
});


export const mockLicenseRD$ = createSuccessfulRemoteDataObject$(buildPaginatedList(new PageInfo(), [mockLicense]));
export const mockLicenseLabelListRD$ = createSuccessfulRemoteDataObject$(buildPaginatedList(new PageInfo(),
  [mockExtendedLicenseLabel, mockNonExtendedLicenseLabel]));
export const createdLicenseRD$ = createSuccessfulRemoteDataObject$(mockLicense);
export const createdLicenseLabelRD$ = createSuccessfulRemoteDataObject$(mockNonExtendedLicenseLabel);
export const successfulResponse = {
  response: {
    statusCode: 200
  }};
