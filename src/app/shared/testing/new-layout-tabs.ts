import { Tab } from '../../core/layout/models/tab.model';
import { TAB } from '../../core/layout/models/tab.resource-type';

export const leadingTabs: Tab[] = [
    Object.assign(new Tab(),{
    'id': 1,
    'shortname': 'info',
    'header': 'Profile',
    'entityType': 'Person',
    'priority': 1,
    'security': 0,
    'type': 'tab',
    'leading': true,
    'rows': [
      {
        'style': 'col-md-12',
        'cells': [
          {
            'style': 'col-md-6',
            'boxes': [
              {
                'shortname': 'primary',
                'header': 'Primary Information',
                'entityType': 'Person',
                'collapsed': false,
                'minor': false,
                'style': 'col-md-6',
                'clear': true,
                'container': true,
                'maxColumn': 2,
                'security': 0,
                'boxType': 'METADATA',
                'type': 'box',
                'metadataSecurityFields': [],
                'configuration': {
                  'id': 1,
                  'rows': [
                    {
                      'fields': [
                        {
                          'metadata': 'dc.title',
                          'label': 'Name',
                          'fieldType': 'metadata'
                        },
                        {
                          'metadata': 'person.email',
                          'label': 'Email',
                          'fieldType': 'metadata',
                          'valuesInline': 'true'
                        }
                      ]
                    }
                  ]
                }
              },
              {
                'shortname': 'other',
                'header': 'Other Informations',
                'entityType': 'Person',
                'collapsed': false,
                'minor': false,
                'style': 'col-md-6',
                'clear': true,
                'maxColumn': 2,
                'security': 0,
                'boxType': 'METADATA',
                'type': 'box',
                'metadataSecurityFields': [
                  'cris.policy.eperson'
                ],
                'configuration': {
                  'id': 2,
                  'rows': [
                    {
                      'fields': [
                        {
                          'metadata': 'person.birthDate',
                          'label': 'Birth date',
                          'fieldType': 'metadata',
                          'labelAsHeading': 'true'
                        }
                      ]
                    }
                  ]
                }
              }
            ]
          },
          {
            'style': 'col-md-6',
            'boxes': [
              {
                'shortname': 'researchoutputs',
                'header': 'Research outputs',
                'entityType': 'Person',
                'collapsed': false,
                'minor': false,
                'style': 'col-md-6',
                'clear': true,
                'maxColumn': 2,
                'security': 0,
                'boxType': 'RELATION',
                'type': 'box',
                'metadataSecurityFields': [],
                'configuration': {
                  'id': 3,
                  'discovery-configuration': 'RELATION.Person.researchoutputs'
                }
              }
            ]
          }
        ]
      },
      {
        'style': 'col-md-12',
        'cells': [
          {
            'style': 'col-md-12',
            'boxes': [
              {
                'shortname': 'metrics',
                'header': 'Metrics',
                'entityType': 'Person',
                'collapsed': false,
                'minor': false,
                'style': null,
                'clear': true,
                'maxColumn': 2,
                'security': 0,
                'boxType': 'METRICS',
                'type': 'box',
                'metadataSecurityFields': [],
                'configuration': {
                  'id': 4,
                  'numColumns': 2,
                  'metrics': ['views', 'downloads']
                }
              }
            ]
          }
        ]
      }
    ]
  })
];

export const loaderTabs: Tab[] = [Object.assign(new Tab(),{
    'id': 2,
    'shortname': 'info',
    'header': 'Profile',
    'entityType': 'Person',
    'priority': 1,
    'security': 0,
    'type': 'tab',
    'leading': false,
    'rows': [
      {
        'style': 'col-md-12',
        'cells': [
          {
            'style': 'col-md-6',
            'boxes': [
              {
                'shortname': 'primary',
                'header': 'Primary Information',
                'entityType': 'Person',
                'collapsed': false,
                'minor': false,
                'style': 'col-md-6',
                'clear': true,
                'container': true,
                'maxColumn': 2,
                'security': 0,
                'boxType': 'METADATA',
                'type': 'box',
                'metadataSecurityFields': [],
                'configuration': {
                  'id': 1,
                  'rows': [
                    {
                      'fields': [
                        {
                          'metadata': 'dc.title',
                          'label': 'Name',
                          'fieldType': 'metadata'
                        },
                        {
                          'metadata': 'person.email',
                          'label': 'Email',
                          'fieldType': 'metadata',
                          'valuesInline': 'true'
                        }
                      ]
                    }
                  ]
                }
              },
              {
                'shortname': 'other',
                'header': 'Other Informations',
                'entityType': 'Person',
                'collapsed': false,
                'minor': false,
                'style': 'col-md-6',
                'clear': true,
                'maxColumn': 2,
                'security': 0,
                'boxType': 'METADATA',
                'type': 'box',
                'metadataSecurityFields': [
                  'cris.policy.eperson'
                ],
                'configuration': {
                  'id': 2,
                  'rows': [
                    {
                      'fields': [
                        {
                          'metadata': 'person.birthDate',
                          'label': 'Birth date',
                          'fieldType': 'metadata',
                          'labelAsHeading': 'true'
                        }
                      ]
                    }
                  ]
                }
              }
            ]
          },
          {
            'style': 'col-md-6',
            'boxes': [
              {
                'shortname': 'researchoutputs',
                'header': 'Research outputs',
                'entityType': 'Person',
                'collapsed': false,
                'minor': false,
                'style': 'col-md-6',
                'clear': true,
                'maxColumn': 2,
                'security': 0,
                'boxType': 'RELATION',
                'type': 'box',
                'metadataSecurityFields': [],
                'configuration': {
                  'id': 3,
                  'discovery-configuration': 'RELATION.Person.researchoutputs'
                }
              }
            ]
          }
        ]
      },
      {
        'style': 'col-md-12',
        'cells': [
          {
            'style': 'col-md-12',
            'boxes': [
              {
                'shortname': 'metrics',
                'header': 'Metrics',
                'entityType': 'Person',
                'collapsed': false,
                'minor': false,
                'style': null,
                'clear': true,
                'maxColumn': 2,
                'security': 0,
                'boxType': 'METRICS',
                'type': 'box',
                'metadataSecurityFields': [],
                'configuration': {
                  'id': 4,
                  'numColumns': 2,
                  'metrics': ['views', 'downloads']
                }
              }
            ]
          }
        ]
      }
    ]
  })
];

export const bothTabs = [...leadingTabs, ...loaderTabs];

export const loaderMultilevelTabs: Tab[] = [
  Object.assign(new Tab(),{
    'id': 2,
    'shortname': 'info',
    'header': 'Profile',
    'entityType': 'Person',
    'priority': 1,
    'security': 0,
    'type': 'tab',
    'leading': false,
    'rows': [
      {
        'style': 'col-md-12',
        'cells': [
          {
            'style': 'col-md-6',
            'boxes': [
              {
                'shortname': 'primary',
                'header': 'Primary Information',
                'entityType': 'Person',
                'collapsed': false,
                'minor': false,
                'style': 'col-md-6',
                'clear': true,
                'container': true,
                'maxColumn': 2,
                'security': 0,
                'boxType': 'METADATA',
                'type': 'box',
                'metadataSecurityFields': [],
                'configuration': {
                  'id': 1,
                  'rows': [
                    {
                      'fields': [
                        {
                          'metadata': 'dc.title',
                          'label': 'Name',
                          'fieldType': 'metadata'
                        },
                        {
                          'metadata': 'person.email',
                          'label': 'Email',
                          'fieldType': 'metadata',
                          'valuesInline': 'true'
                        }
                      ]
                    }
                  ]
                }
              },
              {
                'shortname': 'other',
                'header': 'Other Informations',
                'entityType': 'Person',
                'collapsed': false,
                'minor': false,
                'style': 'col-md-6',
                'clear': true,
                'maxColumn': 2,
                'security': 0,
                'boxType': 'METADATA',
                'type': 'box',
                'metadataSecurityFields': [
                  'cris.policy.eperson'
                ],
                'configuration': {
                  'id': 2,
                  'rows': [
                    {
                      'fields': [
                        {
                          'metadata': 'person.birthDate',
                          'label': 'Birth date',
                          'fieldType': 'metadata',
                          'labelAsHeading': 'true'
                        }
                      ]
                    }
                  ]
                }
              }
            ]
          },
          {
            'style': 'col-md-6',
            'boxes': [
              {
                'shortname': 'researchoutputs',
                'header': 'Research outputs',
                'entityType': 'Person',
                'collapsed': false,
                'minor': false,
                'style': 'col-md-6',
                'clear': true,
                'maxColumn': 2,
                'security': 0,
                'boxType': 'RELATION',
                'type': 'box',
                'metadataSecurityFields': [],
                'configuration': {
                  'id': 3,
                  'discovery-configuration': 'RELATION.Person.researchoutputs'
                }
              }
            ]
          }
        ]
      },
      {
        'style': 'col-md-12',
        'cells': [
          {
            'style': 'col-md-12',
            'boxes': [
              {
                'shortname': 'metrics',
                'header': 'Metrics',
                'entityType': 'Person',
                'collapsed': false,
                'minor': false,
                'style': null,
                'clear': true,
                'maxColumn': 2,
                'security': 0,
                'boxType': 'METRICS',
                'type': 'box',
                'metadataSecurityFields': [],
                'configuration': {
                  'id': 4,
                  'numColumns': 2,
                  'metrics': ['views', 'downloads']
                }
              }
            ]
          }
        ]
      }
    ]
  }),
  Object.assign(new Tab(),{
    'id': 2,
    'shortname': 'Projects::info',
    'header': 'Projects::info',
    'entityType': 'Project',
    'priority': 1,
    'security': 0,
    'type': 'tab',
    'leading': false,
    'rows': [
      {
        'style': 'col-md-12',
        'cells': [
          {
            'style': 'col-md-6',
            'boxes': [
              {
                'shortname': 'primary',
                'header': 'Primary Information',
                'entityType': 'Person',
                'collapsed': false,
                'minor': false,
                'style': 'col-md-6',
                'clear': true,
                'container': true,
                'maxColumn': 2,
                'security': 0,
                'boxType': 'METADATA',
                'type': 'box',
                'metadataSecurityFields': [],
                'configuration': {
                  'id': 1,
                  'rows': [
                    {
                      'fields': [
                        {
                          'metadata': 'dc.title',
                          'label': 'Name',
                          'fieldType': 'metadata'
                        },
                        {
                          'metadata': 'person.email',
                          'label': 'Email',
                          'fieldType': 'metadata',
                          'valuesInline': 'true'
                        }
                      ]
                    }
                  ]
                }
              },
              {
                'shortname': 'other',
                'header': 'Other Informations',
                'entityType': 'Person',
                'collapsed': false,
                'minor': false,
                'style': 'col-md-6',
                'clear': true,
                'maxColumn': 2,
                'security': 0,
                'boxType': 'METADATA',
                'type': 'box',
                'metadataSecurityFields': [
                  'cris.policy.eperson'
                ],
                'configuration': {
                  'id': 2,
                  'rows': [
                    {
                      'fields': [
                        {
                          'metadata': 'person.birthDate',
                          'label': 'Birth date',
                          'fieldType': 'metadata',
                          'labelAsHeading': 'true'
                        }
                      ]
                    }
                  ]
                }
              }
            ]
          },
          {
            'style': 'col-md-6',
            'boxes': [
              {
                'shortname': 'researchoutputs',
                'header': 'Research outputs',
                'entityType': 'Person',
                'collapsed': false,
                'minor': false,
                'style': 'col-md-6',
                'clear': true,
                'maxColumn': 2,
                'security': 0,
                'boxType': 'RELATION',
                'type': 'box',
                'metadataSecurityFields': [],
                'configuration': {
                  'id': 3,
                  'discovery-configuration': 'RELATION.Person.researchoutputs'
                }
              }
            ]
          }
        ]
      },
      {
        'style': 'col-md-12',
        'cells': [
          {
            'style': 'col-md-12',
            'boxes': [
              {
                'shortname': 'metrics',
                'header': 'Metrics',
                'entityType': 'Person',
                'collapsed': false,
                'minor': false,
                'style': null,
                'clear': true,
                'maxColumn': 2,
                'security': 0,
                'boxType': 'METRICS',
                'type': 'box',
                'metadataSecurityFields': [],
                'configuration': {
                  'id': 4,
                  'numColumns': 2,
                  'metrics': ['views', 'downloads']
                }
              }
            ]
          }
        ]
      }
    ]
  }),
    Object.assign(new Tab(),{
    'id': 2,
    'shortname': 'Projects::detail',
    'header': 'Projects::detail',
    'entityType': 'Project',
    'priority': 1,
    'security': 0,
    'type': 'tab',
    'leading': false,
    'rows': [
      {
        'style': 'col-md-12',
        'cells': [
          {
            'style': 'col-md-6',
            'boxes': [
              {
                'shortname': 'primary',
                'header': 'Primary Information',
                'entityType': 'Person',
                'collapsed': false,
                'minor': false,
                'style': 'col-md-6',
                'clear': true,
                'container': true,
                'maxColumn': 2,
                'security': 0,
                'boxType': 'METADATA',
                'type': 'box',
                'metadataSecurityFields': [],
                'configuration': {
                  'id': 1,
                  'rows': [
                    {
                      'fields': [
                        {
                          'metadata': 'dc.title',
                          'label': 'Name',
                          'fieldType': 'metadata'
                        },
                        {
                          'metadata': 'person.email',
                          'label': 'Email',
                          'fieldType': 'metadata',
                          'valuesInline': 'true'
                        }
                      ]
                    }
                  ]
                }
              },
              {
                'shortname': 'other',
                'header': 'Other Informations',
                'entityType': 'Person',
                'collapsed': false,
                'minor': false,
                'style': 'col-md-6',
                'clear': true,
                'maxColumn': 2,
                'security': 0,
                'boxType': 'METADATA',
                'type': 'box',
                'metadataSecurityFields': [
                  'cris.policy.eperson'
                ],
                'configuration': {
                  'id': 2,
                  'rows': [
                    {
                      'fields': [
                        {
                          'metadata': 'person.birthDate',
                          'label': 'Birth date',
                          'fieldType': 'metadata',
                          'labelAsHeading': 'true'
                        }
                      ]
                    }
                  ]
                }
              }
            ]
          },
          {
            'style': 'col-md-6',
            'boxes': [
              {
                'shortname': 'researchoutputs',
                'header': 'Research outputs',
                'entityType': 'Person',
                'collapsed': false,
                'minor': false,
                'style': 'col-md-6',
                'clear': true,
                'maxColumn': 2,
                'security': 0,
                'boxType': 'RELATION',
                'type': 'box',
                'metadataSecurityFields': [],
                'configuration': {
                  'id': 3,
                  'discovery-configuration': 'RELATION.Person.researchoutputs'
                }
              }
            ]
          }
        ]
      },
      {
        'style': 'col-md-12',
        'cells': [
          {
            'style': 'col-md-12',
            'boxes': [
              {
                'shortname': 'metrics',
                'header': 'Metrics',
                'entityType': 'Person',
                'collapsed': false,
                'minor': false,
                'style': null,
                'clear': true,
                'maxColumn': 2,
                'security': 0,
                'boxType': 'METRICS',
                'type': 'box',
                'metadataSecurityFields': [],
                'configuration': {
                  'id': 4,
                  'numColumns': 2,
                  'metrics': ['views', 'downloads']
                }
              }
            ]
          }
        ]
      }
    ]
  })
];
