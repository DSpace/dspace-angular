import { ExternalSourceService } from '../../core/data/external-source.service';
import { ExternalSource } from '../../core/shared/external-source.model';
import { ResourceType } from '../../core/shared/resource-type';

export const externalSourceOrcid: ExternalSource = {
  type: new ResourceType('externalsource'),
  id: 'orcid',
  name: 'orcid',
  hierarchical: false,
  _links: {
    entries: {
      href: 'https://dspace7.4science.cloud/server/api/integration/externalsources/orcid/entries'
    },
    self: {
      href: 'https://dspace7.4science.cloud/server/api/integration/externalsources/orcid'
    }
  }
};

export const externalSourceCiencia: ExternalSource = {
  type: new ResourceType('externalsource'),
  id: 'ciencia',
  name: 'ciencia',
  hierarchical: false,
  _links: {
    entries: {
      href: 'https://dspace7.4science.cloud/server/api/integration/externalsources/ciencia/entries'
    },
    self: {
      href: 'https://dspace7.4science.cloud/server/api/integration/externalsources/ciencia'
    }
  }
};

export const externalSourceMyStaffDb: ExternalSource = {
  type: new ResourceType('externalsource'),
  id: 'my_staff_db',
  name: 'my_staff_db',
  hierarchical: false,
  _links: {
    entries: {
      href: 'https://dspace7.4science.cloud/server/api/integration/externalsources/my_staff_db/entries'
    },
    self: {
      href: 'https://dspace7.4science.cloud/server/api/integration/externalsources/my_staff_db'
    }
  }
};

/**
 * Mock for [[ExternalSourceService]]
 */
export function getMockExternalSourceService():
ExternalSourceService {
  return jasmine.createSpyObj('ExternalSourceService', {
    findAll: jasmine.createSpy('findAll'),
    getExternalSourceEntries: jasmine.createSpy('getExternalSourceEntries'),
  });
}
