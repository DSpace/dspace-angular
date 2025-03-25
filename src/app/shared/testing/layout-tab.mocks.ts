import { CrisLayoutTab } from '../../core/layout/models/tab.model';
import { TAB } from '../../core/layout/models/tab.resource-type';

export const tabPersonProfile: CrisLayoutTab = {
  type: TAB,
  id: 1,
  shortname: 'person-profile',
  header: 'person-profile-header',
  entityType: 'Person',
  priority: 0,
  security: 0,
  uuid: 'person-profile-1',
  _links: {
    self: {
      href: 'https://rest.api/rest/api/tabs/1'
    }
  }
};

export const tabPersonBiography: CrisLayoutTab = {
  type: TAB,
  id: 2,
  shortname: 'person-biography',
  header: 'person-biography-header',
  entityType: 'Person',
  priority: 0,
  security: 0,
  uuid: 'person-biography-2',
  _links: {
    self: {
      href: 'https://rest.api/rest/api/tabs/2'
    }
  }
};

export const tabPersonBibliometrics: CrisLayoutTab = {
  type: TAB,
  id: 3,
  shortname: 'person-bibliometrics',
  header: 'person-bibliometrics-header',
  entityType: 'Person',
  priority: 0,
  security: 0,
  uuid: 'person-bibliometrics-3',
  _links: {
    self: {
      href: 'https://rest.api/rest/api/tabs/3'
    }
  }
};

export const tabPersonTest: CrisLayoutTab = {
  type: TAB,
  id: 4,
  shortname: 'person-test',
  header: 'person-test-header',
  entityType: 'Person',
  priority: 0,
  security: 0,
  uuid: 'person-test-3',
  _links: {
    self: {
      href: 'https://rest.api/rest/api/tabs/3'
    }
  }
};

export const tabs = [tabPersonProfile, tabPersonBiography, tabPersonBibliometrics];
export const leadingTabs: CrisLayoutTab[] = [
  Object.assign(new CrisLayoutTab(), {
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
        'style': 'test-class',
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
        'cells': [
          {
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
export const loaderTabs: CrisLayoutTab[] = [Object.assign(new CrisLayoutTab(), {
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
Object.assign(new CrisLayoutTab(), {
  'id': 3,
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
              'minor': true,
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
            },
            {
              'shortname': 'metrics',
              'header': 'Metrics',
              'entityType': 'Person',
              'collapsed': false,
              'minor': true,
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

export const loaderMultilevelTabs: CrisLayoutTab[] = [
  Object.assign(new CrisLayoutTab(), {
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
  Object.assign(new CrisLayoutTab(), {
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
  Object.assign(new CrisLayoutTab(), {
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
export const tabDetailsTest: CrisLayoutTab = {
  'id': 395,
  'shortname': 'details',
  'header': 'Informations',
  'entityType': 'OrgUnit',
  'priority': 0,
  'security': 0,
  'type': TAB,
  'uuid': '123123123123',
  '_links': {
    'self': {
      'href': 'http://localhost:8080/server/api/layout/tabs/395'
    }
  }
};
export const tabPublicationsTest: CrisLayoutTab = {
  'id': 396,
  'shortname': 'publications',
  'header': 'Publications',
  'entityType': 'OrgUnit',
  'priority': 2,
  'security': 0,
  'type': TAB,
  'uuid': '123123123123',
  '_links': {
    'self': {
      'href': 'http://localhost:8080/server/api/layout/tabs/396'
    }
  }
};
export const tabRpPublicationsTest: CrisLayoutTab = {
  'id': 397,
  'shortname': 'rp::publications',
  'header': 'Researchers::Publications',
  'entityType': 'OrgUnit',
  'priority': 4,
  'security': 0,
  'type': TAB,
  'uuid': '123123123123',
  '_links': {
    'self': {
      'href': 'http://localhost:8080/server/api/layout/tabs/397'
    }
  }
};
export const tabProjectsTest: CrisLayoutTab = {
  'id': 398,
  'shortname': 'projects',
  'header': 'Projects',
  'entityType': 'OrgUnit',
  'priority': 6,
  'security': 0,
  'type': TAB,
  'uuid': '123123123123',
  '_links': {
    'self': {
      'href': 'http://localhost:8080/server/api/layout/tabs/398'
    }
  }
};
export const tabRpProjectsTest: CrisLayoutTab = {
  'id': 399,
  'shortname': 'rp::projects',
  'header': 'Researchers::Projects',
  'entityType': 'OrgUnit',
  'priority': 8,
  'security': 0,
  'type': TAB,
  'uuid': '123123123123',
  '_links': {
    'self': {
      'href': 'http://localhost:8080/server/api/layout/tabs/399'
    }
  }
};
export const tabPeoplesTest: CrisLayoutTab = {
  'id': 400,
  'shortname': 'people',
  'header': 'Peoples',
  'entityType': 'OrgUnit',
  'priority': 10,
  'security': 0,
  'type': TAB,
  'uuid': '123123123123',
  '_links': {
    'self': {
      'href': 'http://localhost:8080/server/api/layout/tabs/400'
    }
  }
};
export const tabFundingsTest: CrisLayoutTab = {
  'id': 395,
  'shortname': 'outputs::fundings',
  'header': 'Fundings',
  'entityType': 'OrgUnit',
  'priority': 0,
  'security': 0,
  'type': TAB,
  'uuid': '123123123123',
  '_links': {
    'self': {
      'href': 'http://localhost:8080/server/api/layout/tabs/401',
    },
  },
};
export const tabsWithNestedLevel = [tabDetailsTest, tabPublicationsTest, tabRpPublicationsTest, tabProjectsTest, tabRpProjectsTest, tabPeoplesTest];
