import { CrisLayoutBox } from '../../core/layout/models/box.model';
import {
  metadataBoxConfigurationMock,
  metricsBoxConfigurationMock,
  relationBoxConfigurationMock
} from './box-configurations.mock';

export const boxMetadata: CrisLayoutBox = {
  id: 1,
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
  configuration: metadataBoxConfigurationMock,
};

export const boxSearch: CrisLayoutBox = {
  id: 2,
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
};

export const boxMetrics: CrisLayoutBox = {
  id: 3,
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
};

export const boxes = [boxMetadata, boxSearch, boxMetrics];
