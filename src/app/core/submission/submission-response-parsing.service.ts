import { Inject, Injectable } from '@angular/core';

import { ResponseParsingService } from '../data/parsing.service';
import { RestRequest, RestRequestMethod } from '../data/request.models';
import { DSpaceRESTV2Response } from '../dspace-rest-v2/dspace-rest-v2-response.model';
import {
  DSOSuccessResponse, ErrorResponse, RestResponse,
  SubmissionSuccessResponse
} from '../cache/response-cache.models';
import { isEmpty, isNotEmpty, isNotNull } from '../../shared/empty.util';

import { ConfigObject } from '../shared/config/config.model';
import { BaseResponseParsingService, ProcessRequestDTO } from '../data/base-response-parsing.service';
import { GLOBAL_CONFIG } from '../../../config';
import { GlobalConfig } from '../../../config/global-config.interface';
import { ObjectCacheService } from '../cache/object-cache.service';
import { NormalizedSubmissionObjectFactory } from './normalized-submission-object-factory';
import { NormalizedObject } from '../cache/models/normalized-object.model';
import { SubmissionResourceType } from './submission-resource-type';
import { NormalizedWorkspaceItem } from './models/normalized-workspaceitem.model';
import { normalizeSectionData } from './models/workspaceitem-sections.model';
import { NormalizedWorkflowItem } from './models/normalized-workflowitem.model';

@Injectable()
export class SubmissionResponseParsingService extends BaseResponseParsingService implements ResponseParsingService {

  protected objectFactory = NormalizedSubmissionObjectFactory;
  protected toCache = false;

  constructor(@Inject(GLOBAL_CONFIG) protected EnvConfig: GlobalConfig,
              protected objectCache: ObjectCacheService,) {
    super();
  }

  parse(request: RestRequest, data: DSpaceRESTV2Response): RestResponse {
    if (isNotEmpty(data.payload)
        && isNotEmpty(data.payload._links)
        && (data.statusCode === '201' || data.statusCode === '200' || data.statusCode === 'OK' || data.statusCode === 'Created')) {
      let dataDefinition = this.process<NormalizedObject | ConfigObject, SubmissionResourceType>(data.payload, request.href);
      dataDefinition = this.postProcess<NormalizedObject | ConfigObject, SubmissionResourceType>(dataDefinition);
      return new SubmissionSuccessResponse(dataDefinition[Object.keys(dataDefinition)[0]], data.statusCode, this.processPageInfo(data.payload.page));
    } else if (isEmpty(data.payload) && data.statusCode === '204') {
      // Response from a DELETE request
      return new SubmissionSuccessResponse(null, data.statusCode);
    } else {
      console.log(data);
      return new ErrorResponse(
        Object.assign(
          new Error('Unexpected response from server'),
          {statusText: data.statusCode}
        )
      );
    }
  }

  protected postProcess<ObjectDomain, ObjectType>(dataDefinition): ProcessRequestDTO<ObjectDomain> {
    const normalizedDefinition = Object.create({});
    normalizedDefinition[Object.keys(dataDefinition)[0]] = [];
    dataDefinition[Object.keys(dataDefinition)[0]].forEach((item, index) => {
      let normalizedItem = Object.assign({}, item);
      // In case data is an Instance of NormalizedWorkspaceItem normalize field value of all the section of type form
      if (item instanceof NormalizedWorkspaceItem || item instanceof NormalizedWorkflowItem) {
        if (item.sections) {
          const precessedSection = Object.create({});
          // Iterate over all workspaceitem's sections
          Object.keys(item.sections)
            .forEach((sectionId) => {
              if (typeof item.sections[sectionId] === 'object' && isNotEmpty(item.sections[sectionId])) {
                const normalizedSectionData = Object.create({});
                // Iterate over all sections property
                Object.keys(item.sections[sectionId])
                  .forEach((metdadataId) => {
                    const entry = item.sections[sectionId][metdadataId];
                    // If entry is not an array, for sure is not a section of type form
                    if (isNotNull(entry) && Array.isArray(entry)) {
                      normalizedSectionData[metdadataId] = [];
                      entry.forEach((valueItem) => {
                        // Parse value and normalize it
                        const normValue = normalizeSectionData(valueItem);
                        if (isNotEmpty(normValue)) {
                          normalizedSectionData[metdadataId].push(normValue);
                        }
                      });
                    } else {
                      normalizedSectionData[metdadataId] = entry;
                    }
                  });
                precessedSection[sectionId] = normalizedSectionData;
              }
            });
          normalizedItem = Object.assign({}, item, {sections :precessedSection});
        }
      }
      normalizedDefinition[Object.keys(dataDefinition)[0]][index] = normalizedItem;
    });

    return normalizedDefinition as ProcessRequestDTO<ObjectDomain>;
  }

}
