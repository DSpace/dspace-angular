import { Inject, Injectable } from '@angular/core';

import { ResponseParsingService } from './parsing.service';
import { RestRequest } from './request.models';
import { DSpaceRESTV2Response } from '../dspace-rest-v2/dspace-rest-v2-response.model';
import { ErrorResponse, RestResponse, SubmitDataSuccessResponse } from '../cache/response-cache.models';
import { isNotEmpty, isNotNull } from '../../shared/empty.util';

import { ConfigObject } from '../shared/config/config.model';
import { BaseResponseParsingService, ProcessRequestDTO } from './base-response-parsing.service';
import { GLOBAL_CONFIG } from '../../../config';
import { GlobalConfig } from '../../../config/global-config.interface';
import { ObjectCacheService } from '../cache/object-cache.service';
import { NormalizedSubmissionObjectFactory } from '../../submission/normalized-submission-object-factory';
import { NormalizedObject } from '../cache/models/normalized-object.model';
import { SubmissionResourceType } from '../../submission/submission-resource-type';
import { NormalizedWorkspaceItem } from '../../submission/models/normalized-workspaceitem.model';
import { AuthorityModel } from '../integration/models/authority.model';
import { FormFieldMetadataValueObject } from '../../shared/form/builder/models/form-field-metadata-value.model';

@Injectable()
export class SubmitDataResponseParsingService extends BaseResponseParsingService implements ResponseParsingService {

  protected objectFactory = NormalizedSubmissionObjectFactory;
  protected toCache = false;

  constructor(@Inject(GLOBAL_CONFIG) protected EnvConfig: GlobalConfig,
              protected objectCache: ObjectCacheService,) {
    super();
  }

  parse(request: RestRequest, data: DSpaceRESTV2Response): RestResponse {
    if (isNotEmpty(data.payload) && isNotEmpty(data.payload._links)
      && (data.statusCode === '201' || data.statusCode === '200' || data.statusCode === 'OK' || data.statusCode === 'Created')) {
      let dataDefinition = this.process<NormalizedObject | ConfigObject, SubmissionResourceType>(data.payload, request.href);
      dataDefinition = this.normalizeData<NormalizedObject | ConfigObject, SubmissionResourceType>(dataDefinition);
      return new SubmitDataSuccessResponse(dataDefinition[Object.keys(dataDefinition)[0]], data.statusCode, this.processPageInfo(data.payload.page));
    } else {
      return new ErrorResponse(
        Object.assign(
          new Error('Unexpected response from server'),
          {statusText: data.statusCode}
        )
      );
    }
  }

  protected normalizeData<ObjectDomain, ObjectType>(dataDefinition): ProcessRequestDTO<ObjectDomain> {
    dataDefinition[Object.keys(dataDefinition)[0]].forEach((item) => {
      // In case data is an Instance of NormalizedWorkspaceItem normalize field value of all the section of type form
      if (item instanceof NormalizedWorkspaceItem) {
        if (item.sections) {
          // Iterate over all workspaceitem's sections
          Object.keys(item.sections)
            .forEach((sectionId) => {
              if (typeof item.sections[sectionId] === 'object' && isNotEmpty(item.sections[sectionId])) {
                const normalizeSectionData = Object.create({});
                // Iterate over all sections property
                Object.keys(item.sections[sectionId])
                  .forEach((metdadataId) => {
                    const entry = item.sections[sectionId][metdadataId];
                    // If entry is not an array, for sure is not a section of type form
                    if (isNotNull(entry) && Array.isArray(entry)) {
                      normalizeSectionData[metdadataId] = [];
                      entry.forEach((valueItem) => {
                        // If is an Instance of FormFieldMetadataValueObject normalize it
                        if (typeof valueItem === 'object'
                          && this.isServerFormValue(valueItem)) {
                          // If authority property is set normalize as an AuthorityModel object
                          /* NOTE: Data received from server could have authority property equal to null, but into form
                             field's model is required an AuthorityModel object as field value, so double-check in
                             field's parser and eventually instantiate it */
                          if (isNotEmpty(valueItem.authority)) {
                            const authorityValue: AuthorityModel = new AuthorityModel();
                            authorityValue.id = valueItem.authority;
                            authorityValue.value = valueItem.value;
                            authorityValue.display = valueItem.value;
                            normalizeSectionData[metdadataId].push(authorityValue);
                          } else {
                            // Normalize as a string value
                            normalizeSectionData[metdadataId].push(valueItem.value);
                          }
                        }
                      });
                    } else {
                      normalizeSectionData[metdadataId] = entry;
                    }
                  });
                item.sections[sectionId] = normalizeSectionData;
              }
            })
        }
        console.log(item.sections);
      }
    });

    return dataDefinition as ProcessRequestDTO<ObjectDomain>;
  }

  protected isServerFormValue(obj: any): boolean {
    return (typeof obj === 'object'
      && obj.hasOwnProperty('value')
      && obj.hasOwnProperty('language')
      && obj.hasOwnProperty('authority')
      && obj.hasOwnProperty('confidence')
      && obj.hasOwnProperty('place'))
  }

}
