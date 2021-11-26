import { Box } from '../../core/layout/models/box.model';
import { BOX } from '../../core/layout/models/box.resource-type';
import {
  medataBoxConfigurationMock,
  metricsBoxConfigurationMock,
  relationBoxConfigurationMock
} from './box-configurations.mock';

export const boxMetadata: Box = {
  type: BOX,
  id: 1,
  uuid: 'shortname-box-1-1',
  shortname: 'shortname-box-1',
  header: 'header-box-1',
  entityType: 'Box',
  collapsed: false,
  minor: false,
  style: 'col-md-4',
  clear: false,
  maxColumn: null,
  container: true,
  security: 0,
  boxType: 'metadata',
  metadataSecurityFields: [],
  configuration: medataBoxConfigurationMock,
  _links: {
    self: {
      href: 'https://rest.api/rest/api/boxes/1'
    },
  }
};

export const boxSearch: Box = {
  type: BOX,
  id: 2,
  uuid: 'shortname-box-2-2',
  shortname: 'shortname-box-2',
  header: 'header-box-2',
  entityType: 'Box',
  collapsed: false,
  minor: false,
  style: 'col-md-10',
  clear: false,
  maxColumn: null,
  container: true,
  security: 0,
  boxType: 'relation',
  metadataSecurityFields: [],
  configuration: relationBoxConfigurationMock,
  _links: {
    self: {
      href: 'https://rest.api/rest/api/boxes/2'
    },
  }
};

export const boxMetrics: Box = {
  type: BOX,
  id: 3,
  uuid: 'shortname-box-3-3',
  shortname: 'shortname-box-3',
  header: 'header-box-3',
  entityType: 'Box',
  collapsed: false,
  minor: false,
  style: 'col-md-2',
  clear: false,
  maxColumn: null,
  container: true,
  security: 0,
  boxType: 'metrics',
  metadataSecurityFields: [],
  configuration: metricsBoxConfigurationMock,
  _links: {
    self: {
      href: 'https://rest.api/rest/api/boxes/3'
    },
  }
};

export const boxes = [boxMetadata, boxSearch, boxMetrics];
