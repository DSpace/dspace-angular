import { Box } from 'src/app/core/layout/models/box.model';
import { BOX } from 'src/app/core/layout/models/box.resource-type';

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
  priority: 0,
  clear: false,
  security: 0,
  boxType: 'metadata',
  _links: {
    self: {
      href: 'https://rest.api/rest/api/boxes/1'
    }
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
  priority: 0,
  clear: false,
  security: 0,
  boxType: 'search',
  _links: {
    self: {
      href: 'https://rest.api/rest/api/boxes/2'
    }
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
  priority: 0,
  clear: false,
  security: 0,
  boxType: 'metrics',
  _links: {
    self: {
      href: 'https://rest.api/rest/api/boxes/3'
    }
  }
};

export const boxes = [boxMetadata, boxSearch, boxMetrics];
