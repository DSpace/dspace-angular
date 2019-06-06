import { ConfigSuccessResponse, ErrorResponse } from '../cache/response.models';
import { ConfigResponseParsingService } from './config-response-parsing.service';
import { ObjectCacheService } from '../cache/object-cache.service';
import { GlobalConfig } from '../../../config/global-config.interface';
import { ConfigRequest } from '../data/request.models';

import { Store } from '@ngrx/store';
import { CoreState } from '../core.reducers';
import { PaginatedList } from '../data/paginated-list';
import { PageInfo } from '../shared/page-info.model';
import { NormalizedSubmissionDefinitionsModel } from './models/normalized-config-submission-definitions.model';
import { NormalizedSubmissionSectionModel } from './models/normalized-config-submission-section.model';

describe('ConfigResponseParsingService', () => {
  let service: ConfigResponseParsingService;

  const EnvConfig = {} as GlobalConfig;
  const store = {} as Store<CoreState>;
  const objectCacheService = new ObjectCacheService(store);
  let validResponse;
  beforeEach(() => {
    service = new ConfigResponseParsingService(EnvConfig, objectCacheService);
    validResponse = {
      payload: {
        id: 'traditional',
        name: 'traditional',
        type: 'submissiondefinition',
        isDefault: true,
        _links: {
          sections: {
            href: 'https://rest.api/config/submissiondefinitions/traditional/sections'
          },
          self: {
            href: 'https://rest.api/config/submissiondefinitions/traditional'
          }
        },
        _embedded: {
          sections: {
            page: {
              number: 0,
              size: 4,
              totalPages: 1, totalElements: 4
            },
            _embedded: [
              {
                id: 'traditionalpageone', header: 'submit.progressbar.describe.stepone',
                mandatory: true,
                sectionType: 'submission-form',
                visibility: {
                  main: null,
                  other: 'READONLY'
                },
                type: 'submissionsection',
                _links: {
                  self: {
                    href: 'https://rest.api/config/submissionsections/traditionalpageone'
                  },
                  config: {
                    href: 'https://rest.api/config/submissionforms/traditionalpageone'
                  }
                }
              }, {
                id: 'traditionalpagetwo',
                header: 'submit.progressbar.describe.steptwo',
                mandatory: true,
                sectionType: 'submission-form',
                visibility: {
                  main: null,
                  other: 'READONLY'
                },
                type: 'submissionsection',
                _links: {
                  self: {
                    href: 'https://rest.api/config/submissionsections/traditionalpagetwo'
                  },
                  config: {
                    href: 'https://rest.api/config/submissionforms/traditionalpagetwo'
                  }
                }
              }, {
                id: 'upload',
                header: 'submit.progressbar.upload',
                mandatory: false,
                sectionType: 'upload',
                visibility: {
                  main: null,
                  other: 'READONLY'
                },
                type: 'submissionsection',
                _links: {
                  self: {
                    href: 'https://rest.api/config/submissionsections/upload'
                  },
                  config: {
                    href: 'https://rest.api/config/submissionuploads/upload'
                  }
                }
              }, {
                id: 'license',
                header: 'submit.progressbar.license',
                mandatory: true,
                sectionType: 'license',
                visibility: {
                  main: null,
                  other: 'READONLY'
                },
                type: 'submissionsection',
                _links: {
                  self: {
                    href: 'https://rest.api/config/submissionsections/license'
                  }
                }
              }
            ],
            _links: {
              self: {
                href: 'https://rest.api/config/submissiondefinitions/traditional/sections'
              }
            }
          }
        }
      },
      statusCode: 200,
      statusText: 'OK'
    };
  });

  describe('parse', () => {
    const validRequest = new ConfigRequest('69f375b5-19f4-4453-8c7a-7dc5c55aafbb', 'https://rest.api/config/submissiondefinitions/traditional');

    const invalidResponse1 = {
      payload: {},
      statusCode: 200,
      statusText: 'OK'
    };

    const invalidResponse2 = {
      payload: {
        id: 'traditional',
        name: 'traditional',
        type: 'submissiondefinition',
        isDefault: true,
        _links: {},
        _embedded: {
          sections: {
            page: {
              number: 0,
              size: 4,
              totalPages: 1, totalElements: 4
            },
            _embedded: [{}, {}],
            _links: {
              self: 'https://rest.api/config/submissiondefinitions/traditional/sections'
            }
          }
        }
      },
      statusCode: 200,
      statusText: 'OK'
    };

    const invalidResponse3 = {
      payload: {
        _links: { self: { href: 'https://rest.api/config/submissiondefinitions/traditional' } },
        page: { size: 20, totalElements: 2, totalPages: 1, number: 0 }
      }, statusCode: 500, statusText: 'Internal Server Error'
    };
    const pageinfo = Object.assign(new PageInfo(), {
      elementsPerPage: 4,
      totalElements: 4,
      totalPages: 1,
      currentPage: 1,
      self: 'https://rest.api/config/submissiondefinitions/traditional/sections'
    });
    const definitions =
      Object.assign(new NormalizedSubmissionDefinitionsModel(), {
        isDefault: true,
        name: 'traditional',
        type: 'submissiondefinition',
        _links: {
          sections: 'https://rest.api/config/submissiondefinitions/traditional/sections',
          self: 'https://rest.api/config/submissiondefinitions/traditional'
        },
        self: 'https://rest.api/config/submissiondefinitions/traditional',
        sections: new PaginatedList(pageinfo, [
          Object.assign(new NormalizedSubmissionSectionModel(), {
            header: 'submit.progressbar.describe.stepone',
            mandatory: true,
            sectionType: 'submission-form',
            visibility:{
              main:null,
              other:'READONLY'
            },
            type: 'submissionsection',
            _links: {
              self: 'https://rest.api/config/submissionsections/traditionalpageone',
              config: 'https://rest.api/config/submissionforms/traditionalpageone'
            },
            self: 'https://rest.api/config/submissionsections/traditionalpageone',
          }),
          Object.assign(new NormalizedSubmissionSectionModel(), {
            header: 'submit.progressbar.describe.steptwo',
            mandatory: true,
            sectionType: 'submission-form',
            visibility:{
              main:null,
              other:'READONLY'
            },
            type: 'submissionsection',
            _links: {
              self: 'https://rest.api/config/submissionsections/traditionalpagetwo',
              config: 'https://rest.api/config/submissionforms/traditionalpagetwo'
            },
            self: 'https://rest.api/config/submissionsections/traditionalpagetwo',
          }),
          Object.assign(new NormalizedSubmissionSectionModel(), {
            header: 'submit.progressbar.upload',
            mandatory: false,
            sectionType: 'upload',
            visibility:{
              main:null,
              other:'READONLY'
            },
            type: 'submissionsection',
            _links: {
              self: 'https://rest.api/config/submissionsections/upload',
              config: 'https://rest.api/config/submissionuploads/upload'
            },
            self: 'https://rest.api/config/submissionsections/upload',
          }),
          Object.assign(new NormalizedSubmissionSectionModel(), {
            header: 'submit.progressbar.license',
            mandatory: true,
            sectionType: 'license',
            visibility:{
              main:null,
              other:'READONLY'
            },
            type: 'submissionsection',
            _links: {
              self: 'https://rest.api/config/submissionsections/license'
            },
            self: 'https://rest.api/config/submissionsections/license',
          })
        ])
      });

    it('should return a ConfigSuccessResponse if data contains a valid config endpoint response', () => {
      const response = service.parse(validRequest, validResponse);
      expect(response.constructor).toBe(ConfigSuccessResponse);
    });

    it('should return an ErrorResponse if data contains an invalid config endpoint response', () => {
      const response1 = service.parse(validRequest, invalidResponse1);
      const response2 = service.parse(validRequest, invalidResponse2);
      expect(response1.constructor).toBe(ErrorResponse);
      expect(response2.constructor).toBe(ErrorResponse);
    });

    it('should return an ErrorResponse if data contains a statuscode other than 200', () => {
      const response = service.parse(validRequest, invalidResponse3);
      expect(response.constructor).toBe(ErrorResponse);
    });

    it('should return a ConfigSuccessResponse with the ConfigDefinitions in data', () => {
      const response = service.parse(validRequest, validResponse);
      expect((response as any).configDefinition).toEqual(definitions);
    });

  });
});
