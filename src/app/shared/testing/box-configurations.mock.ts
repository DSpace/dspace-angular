import {
  MetadataBoxConfiguration,
  MetricsBoxConfiguration,
  RelationBoxConfiguration
} from '../../core/layout/models/box.model';

export const medataBoxConfigurationMock: MetadataBoxConfiguration = {
  id: 'testBox',
  type: 'boxmetadataconfiguration',
  rows: [{
    style: 'row-style',
    cells: [{
      style: 'cell-style',
      fields: [
        {
          metadata: 'dc.title',
          label: 'Title',
          rendering: 'text',
          fieldType: 'metadata',
          labelAsHeading: true,
          valuesInline: true
        }
      ]
    },
      {
        style: 'cell-style',
        fields: [
          {
            metadata: 'dc.contibutor.author',
            label: 'Authors',
            rendering: 'text',
            fieldType: 'metadata',
            labelAsHeading: true,
            valuesInline: true
          }
        ]
      }]
  }]
};


export const relationBoxConfigurationMock: RelationBoxConfiguration = {
  type: 'boxrelationconfiguration',
  'discovery-configuration': 'RELATION.Person.researchoutputs'
};

export const metricsBoxConfigurationMock: MetricsBoxConfiguration = {
  type: 'boxmetricsconfiguration',
  maxColumns: null,
  metrics: ['view', 'embedded-view']
};
