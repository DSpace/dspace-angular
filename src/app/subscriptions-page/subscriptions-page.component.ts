import { Component, OnInit } from '@angular/core';
import { Observable, of as observableOf } from 'rxjs';
import { switchMap, map, take } from 'rxjs/operators';
import { Subscription } from '../shared/subscriptions/models/subscription.model';
import { RemoteData } from '../core/data/remote-data';
import { buildPaginatedList, PaginatedList } from '../core/data/paginated-list.model';
import { Community } from '../core/shared/community.model';

@Component({
  selector: 'ds-subscriptions-page',
  templateUrl: './subscriptions-page.component.html',
  styleUrls: ['./subscriptions-page.component.scss']
})
export class SubscriptionsPageComponent implements OnInit {

  /**
   * The subscriptions to show on this page, as an Observable list.
   */
  itemSubscriptions$: Observable<Subscription[]>;

  /**
   * The subscriptions to show on this page, as an Observable list.
   */
  collectionSubscriptions$: Observable<Subscription[]>;

  /**
   * The subscriptions to show on this page, as an Observable list.
   */
  communitySubscriptions$: Observable<Subscription[]>;

    mockItemSubscriptions = {
        "_embedded": {
            "subscriptions": [
                {
                    "id": 60,
                    'type': 'subscription',
                    'subscriptionParameterList': [
                        {
                            'id': 10,
                            'name': 'frequency_s',
                            'value': 'M'
                        }
                    ],
                    'subscriptionType': 'statistics',
                    _embedded:{
                        "dSpaceObject" : observableOf({
                                'id': '3c43135f-3e8b-46c2-bac3-288ed58e3fc1',
                                'uuid': '3c43135f-3e8b-46c2-bac3-288ed58e3fc1',
                                'name': 'Publication metadata in CERIF: Inspiration by FRBR',
                                'handle': null,
                                'metadata': {
                                  'dc.contributor.author': [
                                    {
                                      'value': 'Dvořák, Jan',
                                      'language': null,
                                      'authority': null,
                                      'confidence': 400,
                                      'place': 0
                                    },
                                    {
                                      'value': 'Drobíková, Barbora',
                                      'language': null,
                                      'authority': null,
                                      'confidence': 400,
                                      'place': 1
                                    },
                                    {
                                      'value': 'Bollini, Andrea',
                                      'language': null,
                                      'authority': '092b59e8-8159-4e70-98b5-93ec60bd3431',
                                      'confidence': 400,
                                      'place': 2
                                    }
                                  ],
                                  'dc.date.issued': [
                                    {
                                      'value': '2006',
                                      'language': null,
                                      'authority': null,
                                      'confidence': -1,
                                      'place': 0
                                    }
                                  ],
                                  'dc.description.abstract': [
                                    {
                                      'value': 'The Functional Requirements for Bibliographic Records (FRBR) and its Scholarly Works Application Profile (SWAP) are used to inspire the representation of complex real world situations in the publication part of the Common European Research Information Format (CERIF), the model for Current Research Information Systems (CRIS). CERIF is found to have room for different approaches to representing metadata of scholarly publications, which could hamper the interoperability of CRIS. To lessen that risk, we propose guidelines for representing scholarly publication metadata in CERIF; our design goal is to enhance the utility of CRIS in supporting the functions of scientific communication. The guidelines are formulated using the notions of Scholarly Work, Expression and Manifestation from FRBR/SWAP.',
                                      'language': null,
                                      'authority': null,
                                      'confidence': -1,
                                      'place': 0
                                    }
                                  ],
                                  'dc.identifier': [
                                    {
                                      'value': '10.1016/j.procs.2014.06.008',
                                      'language': null,
                                      'authority': null,
                                      'confidence': -1,
                                      'place': 0
                                    }
                                  ],
                                  'dc.subject': [
                                    {
                                      'value': 'CRIS',
                                      'language': null,
                                      'authority': null,
                                      'confidence': -1,
                                      'place': 0
                                    },
                                    {
                                      'value': 'interoperability',
                                      'language': null,
                                      'authority': null,
                                      'confidence': -1,
                                      'place': 1
                                    },
                                    {
                                      'value': 'CERIF',
                                      'language': null,
                                      'authority': null,
                                      'confidence': -1,
                                      'place': 2
                                    },
                                    {
                                      'value': 'functions of scientific communication',
                                      'language': null,
                                      'authority': null,
                                      'confidence': -1,
                                      'place': 3
                                    },
                                    {
                                      'value': 'publication metadata',
                                      'language': null,
                                      'authority': null,
                                      'confidence': -1,
                                      'place': 4
                                    },
                                    {
                                      'value': 'FRBR',
                                      'language': null,
                                      'authority': null,
                                      'confidence': -1,
                                      'place': 5
                                    },
                                    {
                                      'value': 'SWAP',
                                      'language': null,
                                      'authority': null,
                                      'confidence': -1,
                                      'place': 6
                                    },
                                    {
                                      'value': 'scholarly work',
                                      'language': null,
                                      'authority': null,
                                      'confidence': -1,
                                      'place': 7
                                    },
                                    {
                                      'value': 'expression',
                                      'language': null,
                                      'authority': null,
                                      'confidence': -1,
                                      'place': 8
                                    },
                                    {
                                      'value': 'manifestation',
                                      'language': null,
                                      'authority': null,
                                      'confidence': -1,
                                      'place': 9
                                    },
                                    {
                                      'value': 'research evaluation',
                                      'language': null,
                                      'authority': null,
                                      'confidence': -1,
                                      'place': 10
                                    }
                                  ],
                                  'dc.title': [
                                    {
                                      'value': 'Publication metadata in CERIF: Inspiration by FRBR',
                                      'language': null,
                                      'authority': null,
                                      'confidence': -1,
                                      'place': 0
                                    }
                                  ],
                                  'dspace.entity.type': [
                                    {
                                      'value': 'Publication',
                                      'language': null,
                                      'authority': null,
                                      'confidence': -1,
                                      'place': 0
                                    }
                                  ],
                                  'oairecerif.author.affiliation': [
                                    {
                                      'value': '#PLACEHOLDER_PARENT_METADATA_VALUE#',
                                      'language': null,
                                      'authority': null,
                                      'confidence': -1,
                                      'place': 0
                                    },
                                    {
                                      'value': '#PLACEHOLDER_PARENT_METADATA_VALUE#',
                                      'language': null,
                                      'authority': null,
                                      'confidence': -1,
                                      'place': 1
                                    },
                                    {
                                      'value': '4Science',
                                      'language': null,
                                      'authority': 'a14ba215-c0f0-4b74-b21a-06359bfabd45',
                                      'confidence': 600,
                                      'place': 2
                                    }
                                  ]
                                },
                                'inArchive': false,
                                'discoverable': true,
                                'withdrawn': false,
                                'lastModified': '2020-12-07T10:10:11.248+0000',
                                'entityType': 'Publication',
                                'type': 'item',
                                '_links': {
                                  'bundles': {
                                    'href': 'https://dspacecris7.4science.cloud/server/api/core/items/3c43135f-3e8b-46c2-bac3-288ed58e3fc1/bundles'
                                  },
                                  'mappedCollections': {
                                    'href': 'https://dspacecris7.4science.cloud/server/api/core/items/3c43135f-3e8b-46c2-bac3-288ed58e3fc1/mappedCollections'
                                  },
                                  'owningCollection': {
                                    'href': 'https://dspacecris7.4science.cloud/server/api/core/items/3c43135f-3e8b-46c2-bac3-288ed58e3fc1/owningCollection'
                                  },
                                  'relationships': {
                                    'href': 'https://dspacecris7.4science.cloud/server/api/core/items/3c43135f-3e8b-46c2-bac3-288ed58e3fc1/relationships'
                                  },
                                  'version': {
                                    'href': 'https://dspacecris7.4science.cloud/server/api/core/items/3c43135f-3e8b-46c2-bac3-288ed58e3fc1/version'
                                  },
                                  'templateItemOf': {
                                    'href': 'https://dspacecris7.4science.cloud/server/api/core/items/3c43135f-3e8b-46c2-bac3-288ed58e3fc1/templateItemOf'
                                  },
                                  'metrics': {
                                    'href': 'https://dspacecris7.4science.cloud/server/api/core/items/3c43135f-3e8b-46c2-bac3-288ed58e3fc1/metrics'
                                  },
                                  'self': {
                                    'href': 'https://dspacecris7.4science.cloud/server/api/core/items/3c43135f-3e8b-46c2-bac3-288ed58e3fc1'
                                  }
                                }
                              })
                    },
                    "_links": {
                        "dSpaceObject": {
                            "href": "http://localhost:8080/server/api/core/subscriptions/60/dSpaceObject"
                        },
                        "ePerson": {
                            "href": "http://localhost:8080/server/api/core/subscriptions/60/ePerson"
                        },
                        "self": {
                            "href": "http://localhost:8080/server/api/core/subscriptions/60"
                        }
                    }
                }
            ]
        },
        "_links": {
            "self": {
                "href": "http://localhost:8080/server/api/core/subscriptions"
            },
            "search": {
                "href": "http://localhost:8080/server/api/core/subscriptions/search"
            }
        },
        "page": {
            "size": 20,
            "totalElements": 12,
            "totalPages": 1,
            "number": 0
        }
    };


    mockCollectionSubscriptions = {
        "_embedded": {
            "subscriptions": [
                {
                    "id": 63,
                    'type': 'subscription',
                    'subscriptionParameterList': [
                        {
                            'id': 14,
                            'name': 'frequency_c',
                            'value': 'D'
                        }
                    ],
                    'subscriptionType': 'content',
                    "_embedded": {
                        "dSpaceObject" : observableOf({
                        'id': '8bb47238-2964-4d9f-be56-e912bf17ac58',
                        'uuid': '8bb47238-2964-4d9f-be56-e912bf17ac58',
                        'name': 'Publication',
                        'handle': '123456789/6',
                        'metadata': {
                          'dc.identifier.uri': [
                            {
                              'value': 'https://dspacecris7.4science.cloud/handle/123456789/6',
                              'language': null,
                              'authority': null,
                              'confidence': -1,
                              'place': 0
                            }
                          ],
                          'dc.title': [
                            {
                              'value': 'Publication',
                              'language': null,
                              'authority': null,
                              'confidence': -1,
                              'place': 0
                            }
                          ],
                          'dspace.entity.type': [
                            {
                              'value': 'Publication',
                              'language': null,
                              'authority': null,
                              'confidence': -1,
                              'place': 0
                            }
                          ]
                        },
                        'type': 'collection',
                        '_links': {
                          'harvester': {
                            'href': 'https://dspacecris7.4science.cloud/server/api/core/collections/8bb47238-2964-4d9f-be56-e912bf17ac58/harvester'
                          },
                          'itemtemplate': {
                            'href': 'https://dspacecris7.4science.cloud/server/api/core/collections/8bb47238-2964-4d9f-be56-e912bf17ac58/itemtemplate'
                          },
                          'license': {
                            'href': 'https://dspacecris7.4science.cloud/server/api/core/collections/8bb47238-2964-4d9f-be56-e912bf17ac58/license'
                          },
                          'logo': {
                            'href': 'https://dspacecris7.4science.cloud/server/api/core/collections/8bb47238-2964-4d9f-be56-e912bf17ac58/logo'
                          },
                          'mappedItems': {
                            'href': 'https://dspacecris7.4science.cloud/server/api/core/collections/8bb47238-2964-4d9f-be56-e912bf17ac58/mappedItems'
                          },
                          'parentCommunity': {
                            'href': 'https://dspacecris7.4science.cloud/server/api/core/collections/8bb47238-2964-4d9f-be56-e912bf17ac58/parentCommunity'
                          },
                          'adminGroup': {
                            'href': 'https://dspacecris7.4science.cloud/server/api/core/collections/8bb47238-2964-4d9f-be56-e912bf17ac58/adminGroup'
                          },
                          'submittersGroup': {
                            'href': 'https://dspacecris7.4science.cloud/server/api/core/collections/8bb47238-2964-4d9f-be56-e912bf17ac58/submittersGroup'
                          },
                          'itemReadGroup': {
                            'href': 'https://dspacecris7.4science.cloud/server/api/core/collections/8bb47238-2964-4d9f-be56-e912bf17ac58/itemReadGroup'
                          },
                          'bitstreamReadGroup': {
                            'href': 'https://dspacecris7.4science.cloud/server/api/core/collections/8bb47238-2964-4d9f-be56-e912bf17ac58/bitstreamReadGroup'
                          },
                          'self': {
                            'href': 'https://dspacecris7.4science.cloud/server/api/core/collections/8bb47238-2964-4d9f-be56-e912bf17ac58'
                          },
                          'workflowGroups': [
                            {
                              'href': 'https://dspacecris7.4science.cloud/server/api/core/collections/8bb47238-2964-4d9f-be56-e912bf17ac58/workflowGroups/editor',
                              'name': 'editor'
                            },
                            {
                              'href': 'https://dspacecris7.4science.cloud/server/api/core/collections/8bb47238-2964-4d9f-be56-e912bf17ac58/workflowGroups/finaleditor',
                              'name': 'finaleditor'
                            },
                            {
                              'href': 'https://dspacecris7.4science.cloud/server/api/core/collections/8bb47238-2964-4d9f-be56-e912bf17ac58/workflowGroups/reviewer',
                              'name': 'reviewer'
                            }
                          ]
                        }
                    })
                    },
                    "_links": {
                        "dSpaceObject": {
                            "href": "http://localhost:8080/server/api/core/subscriptions/63/dSpaceObject"
                        },
                        "ePerson": {
                            "href": "http://localhost:8080/server/api/core/subscriptions/63/ePerson"
                        },
                        "self": {
                            "href": "http://localhost:8080/server/api/core/subscriptions/63"
                        }
                    }
                }
            ]
        },
        "_links": {
            "self": {
                "href": "http://localhost:8080/server/api/core/subscriptions"
            },
            "search": {
                "href": "http://localhost:8080/server/api/core/subscriptions/search"
            }
        },
        "page": {
            "size": 20,
            "totalElements": 12,
            "totalPages": 1,
            "number": 0
        }
    };


  mockCommunitySubscriptions = {
    "_embedded": {
        "subscriptions": [
            {
                "id": 64,
                'type': 'subscription',
                'subscriptionParameterList': [
                    {
                        'id': 12,
                        'name': 'frequency_c',
                        'value': 'D'
                    },
                    {
                        'id': 13,
                        'name': 'frequency_s',
                        'value': 'M'
                    }
                ],
                'subscriptionType': 'content+statistics',
                "_embedded": {
                    "dSpaceObject" : observableOf(Object.assign(new Community(), {
                          id: 'ce64f48e-2c9b-411a-ac36-ee429c0e6a88',
                          uuid: 'ce64f48e-2c9b-411a-ac36-ee429c0e6a88',
                          name:"Community name",
                        }))
                    },
                "_links": {
                    "dSpaceObject": {
                        "href": "http://localhost:8080/server/api/core/subscriptions/64/dSpaceObject"
                    },
                    "ePerson": {
                        "href": "http://localhost:8080/server/api/core/subscriptions/64/ePerson"
                    },
                    "self": {
                        "href": "http://localhost:8080/server/api/core/subscriptions/64"
                    }
                }
            }
        ]
    },
    "_links": {
        "self": {
            "href": "http://localhost:8080/server/api/core/subscriptions"
        },
        "search": {
            "href": "http://localhost:8080/server/api/core/subscriptions/search"
        }
    },
    "page": {
        "size": 20,
        "totalElements": 12,
        "totalPages": 1,
        "number": 0
    }
};


  constructor() { }

  ngOnInit(): void {

    this.itemSubscriptions$ = this.getSubscriptions('item').pipe(
      map((remoteData) => {
        return remoteData._embedded.subscriptions
      })
    ) as Observable<Subscription[]>;

    this.collectionSubscriptions$ = this.getSubscriptions('collection').pipe(
      map((remoteData) => {
        return remoteData._embedded.subscriptions
      })
    ) as Observable<Subscription[]>;

    this.communitySubscriptions$ = this.getSubscriptions('community').pipe(
      map((remoteData) => {
        return remoteData._embedded.subscriptions
      })
    ) as Observable<Subscription[]>;
  }

  getSubscriptions(resourceType): Observable<any> {
      if(resourceType == "item"){
        return observableOf(this.mockItemSubscriptions);
      }else if( resourceType == 'community'){
        return observableOf(this.mockCommunitySubscriptions);
      }else{
        return observableOf(this.mockCollectionSubscriptions);
      }
  }

}
