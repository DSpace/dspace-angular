import { METADATACOMPONENT } from '../../core/layout/models/metadata-component.resource-type';
import {
  MetadataBoxConfiguration,
  MetricsBoxConfiguration,
  RelationBoxConfiguration
} from '../../core/layout/models/box.model';

export const medataBoxConfigurationMock: MetadataBoxConfiguration = {
  id: 'testBox',
  type: METADATACOMPONENT.value,
  rows: [
  {
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
  },
  {
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
