import { Component, OnInit, Input, ViewChild, ComponentFactoryResolver, OnDestroy, ComponentRef } from '@angular/core';
import { Item } from '../core/shared/item.model';
import { TabDataService } from '../core/layout/tab-data.service';
import { Tab } from '../core/layout/models/tab.model';
import { Observable, of as observableOf } from 'rxjs';
import { map, tap, switchMap } from 'rxjs/operators';

import {
  getBrowseDefinitionLinks,
  getFirstOccurrence,
  getRemoteDataPayload,
  getFirstSucceededRemoteData,
  getPaginatedListPayload
} from '../core/shared/operators';

/**
 * Component for determining what component to use depending on the item's entity type (dspace.entity.type)
 */
@Component({
  selector: 'ds-cris-layout',
  templateUrl: './cris-layout.component.html',
  styleUrls: ['./cris-layout.component.scss']
})
export class CrisLayoutComponent implements OnInit {

  /**
   * DSpace Item to render
   */
  @Input() item: Item;

  /**
   * Get tabs for the specific item
   */
   tabs$: Observable<Tab[]>;

  /**
   * Get loader tabs for the specific item
   */
   loaderTabs$: Observable<Tab[]>;

  /**
   * Get leading for the specific item
   */
   leadingTabs$: Observable<Tab[]>;

  constructor(private tabService: TabDataService) { }

 /**
  * Get tabs for the specific item
  */
  ngOnInit(): void {
    this.tabs$ = this.getTabsByItem();
    this.leadingTabs$ = this.getLeadingTabs();
    this.loaderTabs$ = this.getLoaderTabs();
  }

 /**
  * Get tabs for the specific item
  */
  getTabsByItem(): Observable<Tab[]> {
    // Since there is no API ready
    return this.tabService.findByItem(this.item.uuid,true).pipe(
      getFirstSucceededRemoteData(),
      getRemoteDataPayload(),
      getPaginatedListPayload(),
      switchMap( (res) => this.mockData() )
    );
  }

 /**
  * Get tabs for the leading component where parameter leading is true b
  */
  getLeadingTabs(): Observable<Tab[]> {
    return this.tabs$.pipe(
      map( (tabs: Tab[]) => tabs.filter(tab => tab.leading)),
    );
  }

 /**
  * Get tabs for the loader component where parameter leading is false
  */
  getLoaderTabs(): Observable<Tab[]> {
    return this.tabs$.pipe(
      map( (tabs: Tab[]) => tabs.filter(tab => !tab.leading)),
    );
  }


  mockData(): Observable<Tab[]> {
    return observableOf([
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
                    'id': 1726,
                    'shortname': 'primary',
                    'header': 'Primary Information',
                    'entityType': 'Person',
                    'collapsed': false,
                    'minor': false,
                    'style': '',
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
                    'id': 1726,
                    'shortname': 'other',
                    'header': 'Other Informations',
                    'entityType': 'Person',
                    'collapsed': false,
                    'minor': false,
                    'style': '',
                    'clear': true,
                    'maxColumn': 2,
                    'security': 0,
                    'boxType': 'METADATA',
                    'container': true,
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
                    'id': 1726,
                    'shortname': 'researchoutputs',
                    'header': 'Research outputs',
                    'entityType': 'Person',
                    'collapsed': false,
                    'minor': false,
                    'style': '',
                    'clear': true,
                    'maxColumn': 2,
                    'security': 0,
                    'boxType': 'RELATION',
                    'type': 'box',
                    'metadataSecurityFields': [],
                    'container': true,
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
                    'id': 1726,
                    'shortname': 'metrics',
                    'header': 'Metrics',
                    'entityType': 'Person',
                    'collapsed': false,
                    'minor': false,
                    'style': null,
                    'clear': true,
                    'container': true,
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
        'shortname': 'Profile::details',
        'header': 'Profile::details',
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
                    'id': 1726,
                    'shortname': 'primary',
                    'header': 'Primary Information',
                    'entityType': 'Person',
                    'collapsed': false,
                    'minor': false,
                    'style': '',
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
                    'style': '',
                    'clear': true,
                    'container': true,
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
                    'style': '',
                    'clear': true,
                    'container': true,
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
                    'container': true,
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
        'shortname': 'informations',
        'header': 'informations',
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
                    'style': '',
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
                    'style': '',
                    'clear': true,
                    'container': true,
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
                    'style': '',
                    'clear': true,
                    'container': true,
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
                    'container': true,
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
                    'style': '',
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
                    'container': true,
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
                    'container': true,
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
                    'container': true,
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
                    'container': true,
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
                    'container': true,
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
                    'container': true,
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
      ]
    );
  }


}
