import { MetadataBoxConfiguration } from '../../core/layout/models/box.model';

export const medataBoxConfigurationMock: MetadataBoxConfiguration = {
  id: 'testTagBox',
  type: 'boxmetadataconfiguration',
  rows: [{
    style: 'row-style',
    cells: [{
      style: 'cell-style',
      fields: [
        {
          metadata: 'dc.subject',
          label: 'Subjects',
          rendering: 'tag',
          fieldType: 'metadata',
          labelAsHeading: true,
          valuesInline: true
        }
      ]
    }]
  }]
};
