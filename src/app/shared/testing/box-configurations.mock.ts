import {
  MetadataBoxConfiguration,
  MetricsBoxConfiguration,
  RelationBoxConfiguration
} from '../../core/layout/models/box.model';

/*export const medataBoxConfigurationMock: MetadataBoxConfiguration = {
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
};*/


export const relationBoxConfigurationMock: RelationBoxConfiguration = {
  type: 'boxrelationconfiguration',
  'discovery-configuration': 'RELATION.Person.researchoutputs'
};

export const metricsBoxConfigurationMock: MetricsBoxConfiguration = {
  type: 'boxmetricsconfiguration',
  maxColumns: null,
  metrics: ['view', 'embedded-view']
};

export const metadataBoxConfigurationMock: MetadataBoxConfiguration = {
  'id': 'mockBoxConfiguration',
  'type': 'boxmetadataconfiguration',
  'rows': [
    {
      'style': 'row-style',
      'cells': [
        {
          'style': 'col-3',
          'fields': [
            {
              'bitstream': {
                'bundle': 'ORIGINAL',
                'metadataField': 'dc.type',
                'metadataValue': 'personal picture'
              },
              'label': null,
              'rendering': 'thumbnail',
              'fieldType': 'BITSTREAM',
              'style': null,
              'styleLabel': null,
              'styleValue': null,
              'labelAsHeading': false,
              'valuesInline': true
            }
          ]
        },
        {
          'style': 'cell-style',
          'fields': [
            {
              'metadata': 'dc.title',
              'label': 'Preferred name',
              'rendering': null,
              'fieldType': 'METADATA',
              'style': null,
              'styleLabel': 'font-weight-bold',
              'styleValue': null,
              'labelAsHeading': false,
              'valuesInline': true
            },
            {
              'metadata': 'crisrp.name',
              'label': 'Official Name',
              'rendering': null,
              'fieldType': 'METADATA',
              'style': null,
              'styleLabel': 'font-weight-bold',
              'styleValue': null,
              'labelAsHeading': false,
              'valuesInline': true
            },
            {
              'metadata': 'crisrp.name.translated',
              'label': 'Translated Name',
              'rendering': null,
              'fieldType': 'METADATA',
              'style': null,
              'styleLabel': 'font-weight-bold',
              'styleValue': null,
              'labelAsHeading': false,
              'valuesInline': true
            },
            {
              'metadata': 'crisrp.name.variant',
              'label': 'Alternative Name',
              'rendering': null,
              'fieldType': 'METADATA',
              'style': null,
              'styleLabel': 'font-weight-bold',
              'styleValue': null,
              'labelAsHeading': false,
              'valuesInline': true
            },
            {
              'metadata': 'oairecerif.identifier.url',
              'label': 'Web Site',
              'rendering': 'link',
              'fieldType': 'METADATA',
              'style': null,
              'styleLabel': 'font-weight-bold',
              'styleValue': null,
              'labelAsHeading': false,
              'valuesInline': true
            }
          ]
        }
      ]
    },
    {
      'style': 'row-style',
      'cells': [
        {
          'style': 'cell-style',
          'fields': [
            {
              'metadata': 'dc.description.abstract',
              'label': 'Biography',
              'rendering': 'longtext',
              'fieldType': 'METADATA',
              'style': null,
              'styleLabel': 'font-weight-bold',
              'styleValue': null,
              'labelAsHeading': false,
              'valuesInline': true
            },
            {
              'metadata': 'oairecerif.person.affiliation',
              'label': 'Affiliation',
              'rendering': 'table',
              'fieldType': 'METADATAGROUP',
              'style': null,
              'styleLabel': 'font-weight-bold',
              'styleValue': null,
              'metadataGroup': {
                'leading': 'oairecerif.person.affiliation',
                'elements': [
                  {
                    'metadata': 'oairecerif.affiliation.role',
                    'label': 'Role',
                    'rendering': 'text',
                    'fieldType': 'METADATA',
                    'style': 'row',
                    'styleLabel': 'col',
                    'styleValue': 'col',
                    'labelAsHeading': false,
                    'valuesInline': true
                  },
                  {
                    'metadata': 'oairecerif.person.affiliation',
                    'label': 'Organisation',
                    'rendering': 'crisref',
                    'fieldType': 'METADATA',
                    'style': 'row',
                    'styleLabel': 'col',
                    'styleValue': 'col',
                    'labelAsHeading': false,
                    'valuesInline': true
                  },
                  {
                    'metadata': 'oairecerif.affiliation.startDate',
                    'label': 'Start',
                    'rendering': 'date',
                    'fieldType': 'METADATA',
                    'style': 'row',
                    'styleLabel': 'col',
                    'styleValue': 'col',
                    'labelAsHeading': false,
                    'valuesInline': true
                  },
                  {
                    'metadata': 'oairecerif.affiliation.endDate',
                    'label': 'End',
                    'rendering': 'date',
                    'fieldType': 'METADATA',
                    'style': 'row',
                    'styleLabel': 'col',
                    'styleValue': 'col',
                    'labelAsHeading': false,
                    'valuesInline': true
                  }
                ]
              },
              'labelAsHeading': false,
              'valuesInline': true
            },
            {
              'metadata': 'crisrp.education',
              'label': 'Education',
              'rendering': 'inline',
              'fieldType': 'METADATAGROUP',
              'style': null,
              'styleLabel': 'font-weight-bold',
              'styleValue': null,
              'metadataGroup': {
                'leading': 'crisrp.education',
                'elements': [
                  {
                    'metadata': 'crisrp.education.role',
                    'label': 'Role',
                    'rendering': 'text',
                    'fieldType': 'METADATA',
                    'style': 'row',
                    'styleLabel': 'col',
                    'styleValue': 'col',
                    'labelAsHeading': false,
                    'valuesInline': true
                  },
                  {
                    'metadata': 'crisrp.education',
                    'label': 'Organisation',
                    'rendering': 'crisref',
                    'fieldType': 'METADATA',
                    'style': 'row',
                    'styleLabel': 'col',
                    'styleValue': 'col',
                    'labelAsHeading': false,
                    'valuesInline': true
                  },
                  {
                    'metadata': 'crisrp.education.start',
                    'label': 'Start',
                    'rendering': 'date',
                    'fieldType': 'METADATA',
                    'style': 'row',
                    'styleLabel': 'col',
                    'styleValue': 'col',
                    'labelAsHeading': false,
                    'valuesInline': true
                  },
                  {
                    'metadata': 'crisrp.education.end',
                    'label': 'End',
                    'rendering': 'date',
                    'fieldType': 'METADATA',
                    'style': 'row',
                    'styleLabel': 'col',
                    'styleValue': 'col',
                    'labelAsHeading': false,
                    'valuesInline': true
                  }
                ]
              },
              'labelAsHeading': false,
              'valuesInline': true
            }
          ]
        }
      ]
    }
  ]
};
