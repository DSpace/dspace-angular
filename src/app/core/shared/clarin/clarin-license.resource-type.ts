/**
 * The resource type for the Clarin License endpoint
 *
 * Needs to be in a separate file to prevent circular
 * dependencies in webpack.
 */
import { ResourceType } from '../resource-type';

export const CLARIN_LICENSE = new ResourceType('clarinlicense');

/**
 * Confirmation possible values.
 */
export const CLARIN_LICENSE_CONFIRMATION = ['Not required', 'Ask only once', 'Ask always', 'Allow anonymous'];

/**
 * Wrap required info to the object for better maintaining in the clarin license table.
 */
export class ClarinLicenseRequiredInfo {
  id: number;
  value: string;
  name: string;
}

/**
 * Required info possible values.
 */
export const CLARIN_LICENSE_REQUIRED_INFO = {
  SEND_TOKEN: 'The user will receive an email with download instructions.',
  NAME: 'User Name',
  DOB: 'Date of birth',
  ADDRESS: 'Address',
  COUNTRY: 'Country',
  EXTRA_EMAIL: 'Ask user for another email address',
  ORGANIZATION: 'Ask user for organization (optional)',
  REQUIRED_ORGANIZATION: 'Ask user for organization (mandatory)',
  INTENDED_USE: 'Ask user for his intentions with the item',
  ACA_ORG_NAME_AND_SEAT: 'Ask for the name and seat (address) of user\'s academic institution',
};

/**
 * Create list of required info objects filled by possible values.
 */
export const CLARIN_LICENSE_FORM_REQUIRED_OPTIONS = [
  Object.assign(new ClarinLicenseRequiredInfo(), {
    id: 0,
    value: CLARIN_LICENSE_REQUIRED_INFO.SEND_TOKEN,
    name: 'SEND_TOKEN'
  }),
  Object.assign(new ClarinLicenseRequiredInfo(), {
    id: 1,
    value: CLARIN_LICENSE_REQUIRED_INFO.NAME,
    name: 'NAME'
  }),
  Object.assign(new ClarinLicenseRequiredInfo(), {
    id: 2,
    value: CLARIN_LICENSE_REQUIRED_INFO.DOB,
    name: 'DOB'
  }),
  Object.assign(new ClarinLicenseRequiredInfo(), {
    id: 3,
    value: CLARIN_LICENSE_REQUIRED_INFO.ADDRESS,
    name: 'ADDRESS'
  }),
  Object.assign(new ClarinLicenseRequiredInfo(), {
    id: 4,
    value: CLARIN_LICENSE_REQUIRED_INFO.COUNTRY,
    name: 'COUNTRY'
  }),
  Object.assign(new ClarinLicenseRequiredInfo(), {
    id: 5,
    value: CLARIN_LICENSE_REQUIRED_INFO.EXTRA_EMAIL,
    name: 'EXTRA_EMAIL'
  }),
  Object.assign(new ClarinLicenseRequiredInfo(), {
    id: 6,
    value: CLARIN_LICENSE_REQUIRED_INFO.ORGANIZATION,
    name: 'ORGANIZATION'
  }),
  Object.assign(new ClarinLicenseRequiredInfo(), {
    id: 7,
    value: CLARIN_LICENSE_REQUIRED_INFO.REQUIRED_ORGANIZATION,
    name: 'REQUIRED_ORGANIZATION'
  }),
  Object.assign(new ClarinLicenseRequiredInfo(), {
    id: 8,
    value: CLARIN_LICENSE_REQUIRED_INFO.INTENDED_USE,
    name: 'INTENDED_USE'
  }),
  Object.assign(new ClarinLicenseRequiredInfo(), {
    id: 9,
    value: CLARIN_LICENSE_REQUIRED_INFO.INTENDED_USE,
    name: 'INTENDED_USE'
  })
];

