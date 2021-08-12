import { MetadataComponent } from '../../core/layout/models/metadata-component.model';
import { METADATACOMPONENT } from '../../core/layout/models/metadata-component.resource-type';

export const tagMedataComponent: MetadataComponent = {
  id: '1',
  type: METADATACOMPONENT,
  rows: [
  {
    fields: [
      {
        metadata: 'dc.subject',
        label: 'Subjects',
        rendering: 'tag',
        fieldType: 'metadata',
        style: 'field-0-style'
      }
    ]
  },
  {
    fields: [
      {
        metadata: 'dc.subject',
        label: 'Subjects',
        rendering: 'tag',
        fieldType: 'metadata',
        style: null
      }
    ]
  }],
  _links: {
    self: {
      href: 'https://rest.api/rest/api/metadatacomponent/1'
    }
  }
};
