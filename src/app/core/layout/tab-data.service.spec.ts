import { TabDataService } from './tab-data.service';
import { TestScheduler } from 'rxjs/testing';
import { RequestService } from '../data/request.service';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { ObjectCacheService } from '../cache/object-cache.service';
import { cold, getTestScheduler, hot } from 'jasmine-marbles';
import { CrisLayoutTab } from './models/tab.model';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { HttpClient } from '@angular/common/http';
import { RequestEntry } from '../data/request-entry.model';
import { TAB } from './models/tab.resource-type';
import { createSuccessfulRemoteDataObject } from '../../shared/remote-data.utils';
import { RestResponse } from '../cache/response.models';
import { of } from 'rxjs';
import { FindListOptions } from '../data/find-list-options.model';
import { RequestParam } from '../cache/models/request-param.model';
import { createPaginatedList } from '../../shared/testing/utils.test';
import objectContaining = jasmine.objectContaining;
import arrayContaining = jasmine.arrayContaining;

describe('TabDataService', () => {
  let scheduler: TestScheduler;
  let service: TabDataService;
  let requestService: RequestService;
  let rdbService: RemoteDataBuildService;
  let objectCache: ObjectCacheService;
  let halService: HALEndpointService;
  let responseCacheEntry: RequestEntry;

  const tabPersonProfile: CrisLayoutTab = {
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

  const tabPersonBiography: CrisLayoutTab = {
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

  const tabPersonBibliometrics: CrisLayoutTab = {
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

  const tabWithOnlyMinors: CrisLayoutTab = {
    type: TAB,
    id: 4,
    shortname: 'person-bibliometrics',
    header: 'person-bibliometrics-header',
    entityType: 'Person',
    priority: 0,
    security: 0,
    rows: [
      {
        style: '',
        cells: [
          {
            style: '',
            boxes: [
              {
                id: 3418,
                shortname: 'heading',
                header: null,
                entityType: 'Person',
                collapsed: false,
                minor: true,
                style: null,
                security: 0,
                boxType: 'METADATA',
                maxColumn: null,
                clear: false,
                configuration: {
                  id: '1',
                  type: 'boxmetadataconfiguration',
                  rows: [
                    {
                      style: '',
                      cells: [
                        {
                          style: '',
                          fields: [
                            {
                              metadata: 'dc.title',
                              label: null,
                              rendering: 'heading',
                              fieldType: 'METADATA',
                              styleLabel: 'font-weight-bold col-3',
                              styleValue: null,
                              labelAsHeading: false,
                              valuesInline: false
                            }
                          ]
                        }
                      ]
                    }
                  ]
                },
                metadataSecurityFields: [],
                container: false
              }
            ]
          }
        ]
      },
      {
        style: '',
        cells: [
          {
            style: '',
            boxes: [
              {
                id: 3419,
                shortname: 'namecard',
                header: 'Name Card',
                entityType: 'Person',
                collapsed: false,
                minor: true,
                style: null,
                security: 0,
                boxType: 'METADATA',
                maxColumn: null,
                clear: false,
                configuration: {
                  id: '0',
                  type: 'boxmetadataconfiguration',
                  rows: [
                    {
                      style: '',
                      cells: [
                        {
                          style: 'col-3',
                          fields: [
                            {
                              bitstream: {
                                bundle: 'ORIGINAL',
                                metadataField: 'dc.type',
                                metadataValue: 'personal pictur'
                              },
                              label: null,
                              rendering: 'thumbnail',
                              fieldType: 'BITSTREAM',
                              styleLabel: 'font-weight-bold col-3',
                              styleValue: null,
                              labelAsHeading: false,
                              valuesInline: false
                            }
                          ]
                        },
                        {
                          style: 'px-2',
                          fields: [
                            {
                              metadata: 'dc.title',
                              label: 'Preferred name',
                              rendering: null,
                              fieldType: 'METADATA',
                              styleLabel: 'font-weight-bold col-3',
                              styleValue: null,
                              labelAsHeading: false,
                              valuesInline: false
                            },
                            {
                              metadata: 'crisrp.name',
                              label: 'Official Name',
                              rendering: null,
                              fieldType: 'METADATA',
                              styleLabel: 'font-weight-bold col-3',
                              styleValue: null,
                              labelAsHeading: false,
                              valuesInline: false
                            },
                            {
                              metadata: 'crisrp.name.translated',
                              label: 'Translated Name',
                              rendering: null,
                              fieldType: 'METADATA',
                              styleLabel: 'font-weight-bold col-3',
                              styleValue: null,
                              labelAsHeading: false,
                              valuesInline: false
                            },
                            {
                              metadata: 'crisrp.name.variant',
                              label: 'Alternative Name',
                              rendering: null,
                              fieldType: 'METADATA',
                              styleLabel: 'font-weight-bold col-3',
                              styleValue: null,
                              labelAsHeading: false,
                              valuesInline: false
                            },
                            {
                              metadata: 'person.affiliation.name',
                              label: 'Main Affiliation',
                              rendering: 'crisref',
                              fieldType: 'METADATA',
                              styleLabel: 'font-weight-bold col-3',
                              styleValue: null,
                              labelAsHeading: false,
                              valuesInline: false
                            },
                            {
                              metadata: 'crisrp.workgroup',
                              label: null,
                              rendering: 'crisref',
                              fieldType: 'METADATA',
                              styleLabel: 'font-weight-bold col-3',
                              styleValue: null,
                              labelAsHeading: false,
                              valuesInline: false
                            },
                            {
                              metadata: 'oairecerif.identifier.url',
                              label: 'Web Site',
                              rendering: 'link',
                              fieldType: 'METADATA',
                              styleLabel: 'font-weight-bold col-3',
                              styleValue: null,
                              labelAsHeading: false,
                              valuesInline: false
                            },
                            {
                              metadata: 'person.email',
                              label: 'Email',
                              rendering: 'crisref.email',
                              fieldType: 'METADATA',
                              styleLabel: 'font-weight-bold col-3',
                              styleValue: null,
                              labelAsHeading: false,
                              valuesInline: false
                            },
                            {
                              metadata: 'person.identifier.orcid',
                              label: 'ORCID',
                              rendering: 'orcid',
                              fieldType: 'METADATA',
                              styleLabel: 'font-weight-bold col-3',
                              styleValue: null,
                              labelAsHeading: false,
                              valuesInline: false
                            },
                            {
                              metadata: 'person.identifier.scopus-author-id',
                              label: 'Scopus Author ID',
                              rendering: null,
                              fieldType: 'METADATA',
                              styleLabel: 'font-weight-bold col-3',
                              styleValue: null,
                              labelAsHeading: false,
                              valuesInline: false
                            },
                            {
                              metadata: 'person.identifier.rid',
                              label: 'Researcher ID',
                              rendering: null,
                              fieldType: 'METADATA',
                              styleLabel: 'font-weight-bold col-3',
                              styleValue: null,
                              labelAsHeading: false,
                              valuesInline: false
                            }
                          ]
                        }
                      ]
                    }
                  ]
                },
                metadataSecurityFields: [],
                container: false
              }
            ]
          }
        ]
      }
    ],
    uuid: 'person-bibliometrics-4',
    _links: {
      self: {
        href: 'https://rest.api/rest/api/tabs/3'
      }
    }
  };

  const tabWithSomeMinors: CrisLayoutTab = {
    type: TAB,
    id: 5,
    shortname: 'person-bibliometrics',
    header: 'person-bibliometrics-header',
    entityType: 'Person',
    priority: 0,
    security: 0,
    rows: [
      {
        style: '',
        cells: [
          {
            style: '',
            boxes: [
              {
                id: 3418,
                shortname: 'heading',
                header: null,
                entityType: 'Person',
                collapsed: false,
                minor: false,
                style: null,
                security: 0,
                boxType: 'METADATA',
                maxColumn: null,
                clear: false,
                configuration: {
                  id: '3',
                  type: 'boxmetadataconfiguration',
                  rows: [
                    {
                      style: '',
                      cells: [
                        {
                          style: '',
                          fields: [
                            {
                              metadata: 'dc.title',
                              label: null,
                              rendering: 'heading',
                              fieldType: 'METADATA',
                              styleLabel: 'font-weight-bold col-3',
                              styleValue: null,
                              labelAsHeading: false,
                              valuesInline: false
                            }
                          ]
                        }
                      ]
                    }
                  ]
                },
                metadataSecurityFields: [],
                container: false
              }
            ]
          }
        ]
      },
      {
        style: '',
        cells: [
          {
            style: '',
            boxes: [
              {
                id: 3419,
                shortname: 'namecard',
                header: 'Name Card',
                entityType: 'Person',
                collapsed: false,
                minor: true,
                style: null,
                security: 0,
                boxType: 'METADATA',
                maxColumn: null,
                clear: false,
                configuration: {
                  id: '0',
                  type: 'boxmetadataconfiguration',
                  rows: [
                    {
                      style: '',
                      cells: [
                        {
                          style: 'col-3',
                          fields: [
                            {
                              bitstream: {
                                bundle: 'ORIGINAL',
                                metadataField: 'dc.type',
                                metadataValue: 'personal pictur'
                              },
                              label: null,
                              rendering: 'thumbnail',
                              fieldType: 'BITSTREAM',
                              styleLabel: 'font-weight-bold col-3',
                              styleValue: null,
                              labelAsHeading: false,
                              valuesInline: false
                            }
                          ]
                        },
                        {
                          style: 'px-2',
                          fields: [
                            {
                              metadata: 'dc.title',
                              label: 'Preferred name',
                              rendering: null,
                              fieldType: 'METADATA',
                              styleLabel: 'font-weight-bold col-3',
                              styleValue: null,
                              labelAsHeading: false,
                              valuesInline: false
                            },
                            {
                              metadata: 'crisrp.name',
                              label: 'Official Name',
                              rendering: null,
                              fieldType: 'METADATA',
                              styleLabel: 'font-weight-bold col-3',
                              styleValue: null,
                              labelAsHeading: false,
                              valuesInline: false
                            },
                            {
                              metadata: 'crisrp.name.translated',
                              label: 'Translated Name',
                              rendering: null,
                              fieldType: 'METADATA',
                              styleLabel: 'font-weight-bold col-3',
                              styleValue: null,
                              labelAsHeading: false,
                              valuesInline: false
                            },
                            {
                              metadata: 'crisrp.name.variant',
                              label: 'Alternative Name',
                              rendering: null,
                              fieldType: 'METADATA',
                              styleLabel: 'font-weight-bold col-3',
                              styleValue: null,
                              labelAsHeading: false,
                              valuesInline: false
                            },
                            {
                              metadata: 'person.affiliation.name',
                              label: 'Main Affiliation',
                              rendering: 'crisref',
                              fieldType: 'METADATA',
                              styleLabel: 'font-weight-bold col-3',
                              styleValue: null,
                              labelAsHeading: false,
                              valuesInline: false
                            },
                            {
                              metadata: 'crisrp.workgroup',
                              label: null,
                              rendering: 'crisref',
                              fieldType: 'METADATA',
                              styleLabel: 'font-weight-bold col-3',
                              styleValue: null,
                              labelAsHeading: false,
                              valuesInline: false
                            },
                            {
                              metadata: 'oairecerif.identifier.url',
                              label: 'Web Site',
                              rendering: 'link',
                              fieldType: 'METADATA',
                              styleLabel: 'font-weight-bold col-3',
                              styleValue: null,
                              labelAsHeading: false,
                              valuesInline: false
                            },
                            {
                              metadata: 'person.email',
                              label: 'Email',
                              rendering: 'crisref.email',
                              fieldType: 'METADATA',
                              styleLabel: 'font-weight-bold col-3',
                              styleValue: null,
                              labelAsHeading: false,
                              valuesInline: false
                            },
                            {
                              metadata: 'person.identifier.orcid',
                              label: 'ORCID',
                              rendering: 'orcid',
                              fieldType: 'METADATA',
                              styleLabel: 'font-weight-bold col-3',
                              styleValue: null,
                              labelAsHeading: false,
                              valuesInline: false
                            },
                            {
                              metadata: 'person.identifier.scopus-author-id',
                              label: 'Scopus Author ID',
                              rendering: null,
                              fieldType: 'METADATA',
                              styleLabel: 'font-weight-bold col-3',
                              styleValue: null,
                              labelAsHeading: false,
                              valuesInline: false
                            },
                            {
                              metadata: 'person.identifier.rid',
                              label: 'Researcher ID',
                              rendering: null,
                              fieldType: 'METADATA',
                              styleLabel: 'font-weight-bold col-3',
                              styleValue: null,
                              labelAsHeading: false,
                              valuesInline: false
                            }
                          ]
                        }
                      ]
                    }
                  ]
                },
                metadataSecurityFields: [],
                container: false
              }
            ]
          }
        ]
      }
    ],
    uuid: 'person-bibliometrics-5',
    _links: {
      self: {
        href: 'https://rest.api/rest/api/tabs/3'
      }
    }
  };

  const endpointURL = `https://rest.api/rest/api/tabs`;
  const requestURL = `https://rest.api/rest/api/tabs/${tabPersonProfile.id}`;
  const requestUUID = '8b3c613a-5a4b-438b-9686-be1d5b4a1c5a';
  const itemUUID = '8b3c613a-5a4b-438b-9686-be1d5b4a1c5a';
  const entityType = 'Person';
  const tabId = '1';

  const array = [tabPersonProfile, tabPersonBiography, tabPersonBibliometrics, tabWithOnlyMinors, tabWithSomeMinors];
  const paginatedList = createPaginatedList(array);
  const tabRD = createSuccessfulRemoteDataObject(tabPersonProfile);
  const paginatedListRD = createSuccessfulRemoteDataObject(paginatedList);
  const noMinorsList =
    createPaginatedList([tabPersonProfile, tabPersonBiography, tabPersonBibliometrics, tabWithSomeMinors]);
  const paginatedListWithoutMinorsRD = createSuccessfulRemoteDataObject(noMinorsList);

  beforeEach(() => {
    scheduler = getTestScheduler();

    halService = jasmine.createSpyObj('halService', {
      getEndpoint: cold('a', { a: endpointURL })
    });

    responseCacheEntry = new RequestEntry();
    responseCacheEntry.request = { href: 'https://rest.api/' } as any;
    responseCacheEntry.response = new RestResponse(true, 200, 'Success');

    requestService = jasmine.createSpyObj('requestService', {
      generateRequestId: requestUUID,
      send: true,
      removeByHrefSubstring: {},
      getByHref: of(responseCacheEntry),
      getByUUID: of(responseCacheEntry),
    });

    rdbService = jasmine.createSpyObj('rdbService', {
      buildSingle: hot('a|', {
        a: tabRD
      }),
      buildList: hot('a|', {
        a: paginatedListRD
      }),
    });
    objectCache = {} as ObjectCacheService;
    const notificationsService = {} as NotificationsService;
    const http = {} as HttpClient;
    const comparator = {} as any;

    service = new TabDataService(
      requestService,
      rdbService,
      objectCache,
      halService,
      notificationsService
    );

    spyOn((service as any), 'findById').and.callThrough();
    spyOn((service as any).searchData, 'searchBy').and.callThrough();
  });

  describe('findById', () => {
    it('should proxy the call to dataservice.findById', () => {
      scheduler.schedule(() => service.findById(tabId));
      scheduler.flush();

      expect((service as any).findById).toHaveBeenCalledWith(tabId);
    });

    it('should return a RemoteData<CrisLayoutTab> for the object with the given id', () => {
      const result = service.findById(tabId);
      const expected = cold('a|', {
        a: tabRD
      });
      expect(result).toBeObservable(expected);
    });
  });

  describe('searchByItem', () => {
    it('should proxy the call to dataservice.searchBy', () => {
      const options = new FindListOptions();
      options.searchParams = [
        new RequestParam('uuid', itemUUID)
      ];
      scheduler.schedule(() => service.findByItem(itemUUID, true));
      scheduler.flush();

      expect((service as any).searchData.searchBy).toHaveBeenCalledWith((service as any).searchFindByItem, options, true);
    });

    it('should return a RemoteData<PaginatedList<CrisLayoutTab>> for the search', () => {
      const result = service.findByItem(itemUUID, true);
      const expected = cold('a|', {
        a: paginatedListRD
      });
      expect(result).toBeObservable(expected);
    });

    it('should remove tab with minor cells', () => {
      const result = service.findByItem(itemUUID, true, true);
      result.subscribe(tabs => {
        expect(tabs.payload.page).toHaveSize(4);
        expect(tabs.payload.page).not.toEqual(
          arrayContaining([objectContaining({ id: tabWithOnlyMinors.id })])
        );
        expect(tabs.payload.page).toEqual(
          arrayContaining([objectContaining({ id: tabWithSomeMinors.id })])
        );
      });
    });

  });

  describe('searchByEntityType', () => {
    it('should proxy the call to dataservice.searchBy', () => {
      const options = new FindListOptions();
      options.searchParams = [
        new RequestParam('type', entityType)
      ];
      scheduler.schedule(() => service.findByEntityType(entityType));
      scheduler.flush();

      expect((service as any).searchData.searchBy).toHaveBeenCalledWith((service as any).searchFindByEntityType, options);
    });

    it('should return a RemoteData<PaginatedList<CrisLayoutTab>> for the search', () => {
      const result = service.findByEntityType(entityType);
      const expected = cold('a|', {
        a: paginatedListRD
      });
      expect(result).toBeObservable(expected);
    });

  });
});
