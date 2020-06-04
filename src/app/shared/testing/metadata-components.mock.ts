import { MetadataComponent } from 'src/app/core/layout/models/metadata-component.model';
import { METADATACOMPONENT } from 'src/app/core/layout/models/metadata-component.resource-type';

export const medataComponent: MetadataComponent = {
  id: 'box-shortname-1',
  type: METADATACOMPONENT,
  rows: [
  {
    fields: [
      {
        metadata: 'dc.contibutor.author',
        label: 'Authors',
        rendering: 'text',
        fieldType: 'metadata',
        style: null
      }
    ]
  },
  {
    fields: [
      {
        metadata: 'dc.contibutor.author',
        label: 'Authors',
        rendering: 'text',
        fieldType: 'metadata',
        style: null
      }
    ]
  }],
  _links: {
    self: {
      href: 'https://rest.api/rest/api/metadatacomponent/box-shortname-1'
    }
  }
};
