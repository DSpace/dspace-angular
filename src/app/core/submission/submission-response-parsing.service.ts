import { Inject, Injectable } from '@angular/core';

import { ResponseParsingService } from '../data/parsing.service';
import { RestRequest } from '../data/request.models';
import { DSpaceRESTV2Response } from '../dspace-rest-v2/dspace-rest-v2-response.model';
import { ErrorResponse, RestResponse, SubmissionSuccessResponse } from '../cache/response.models';
import { isEmpty, isNotEmpty, isNotNull } from '../../shared/empty.util';
import { ConfigObject } from '../config/models/config.model';
import { BaseResponseParsingService } from '../data/base-response-parsing.service';
import { GLOBAL_CONFIG } from '../../../config';
import { GlobalConfig } from '../../../config/global-config.interface';
import { ObjectCacheService } from '../cache/object-cache.service';
import { NormalizedWorkspaceItem } from './models/normalized-workspaceitem.model';
import { NormalizedWorkflowItem } from './models/normalized-workflowitem.model';
import { FormFieldMetadataValueObject } from '../../shared/form/builder/models/form-field-metadata-value.model';
import { SubmissionObject } from './models/submission-object.model';

/**
 * Export a function to check if object has same properties of FormFieldMetadataValueObject
 *
 * @param obj
 */
export function isServerFormValue(obj: any): boolean {
  return (typeof obj === 'object'
    && obj.hasOwnProperty('value')
    && obj.hasOwnProperty('language')
    && obj.hasOwnProperty('authority')
    && obj.hasOwnProperty('confidence'))
}

/**
 * Export a function to normalize sections object of the server response
 *
 * @param obj
 * @param objIndex
 */
export function normalizeSectionData(obj: any, objIndex?: number) {
  let result: any = obj;
  if (isNotNull(obj)) {
    // If is an Instance of FormFieldMetadataValueObject normalize it
    if (typeof obj === 'object' && isServerFormValue(obj)) {
      // If authority property is set normalize as a FormFieldMetadataValueObject object
      /* NOTE: Data received from server could have authority property equal to null, but into form
         field's model is required a FormFieldMetadataValueObject object as field value, so instantiate it */
      result = new FormFieldMetadataValueObject(
        obj.value,
        obj.language,
        obj.authority,
        (obj.display || obj.value),
        obj.place || objIndex,
        obj.confidence,
        obj.otherInformation
      );
    } else if (Array.isArray(obj)) {
      result = [];
      obj.forEach((item, index) => {
        result[index] = normalizeSectionData(item, index);
      });
    } else if (typeof obj === 'object') {
      result = Object.create({});
      Object.keys(obj)
        .forEach((key) => {
          result[key] = normalizeSectionData(obj[key]);
        });
    }
  }
  return result;
}

/**
 * Provides methods to parse response for a submission request.
 */
@Injectable()
export class SubmissionResponseParsingService extends BaseResponseParsingService implements ResponseParsingService {

  protected toCache = false;

  constructor(@Inject(GLOBAL_CONFIG) protected EnvConfig: GlobalConfig,
              protected objectCache: ObjectCacheService) {
    super();
  }

  /**
   * Parses data from the workspaceitems/workflowitems endpoints
   *
   * @param {RestRequest} request
   * @param {DSpaceRESTV2Response} data
   * @returns {RestResponse}
   */
  parse(request: RestRequest, data: DSpaceRESTV2Response): RestResponse {
    if (isNotEmpty(data.payload)
      && isNotEmpty(data.payload._links)
      && this.isSuccessStatus(data.statusCode)) {
      const dataDefinition = this.processResponse<SubmissionObject | ConfigObject>(data.payload, request);
      return new SubmissionSuccessResponse(dataDefinition, data.statusCode, data.statusText, this.processPageInfo(data.payload));
    } else if (isEmpty(data.payload) && this.isSuccessStatus(data.statusCode)) {
      return new SubmissionSuccessResponse(null, data.statusCode, data.statusText);
    } else {
      return new ErrorResponse(
        Object.assign(
          new Error('Unexpected response from server'),
          {statusCode: data.statusCode, statusText: data.statusText}
        )
      );
    }
  }

  /**
   * Parses response and normalize it
   *
   * @param {DSpaceRESTV2Response} data
   * @param {RestRequest} request
   * @returns {any[]}
   */
  protected processResponse<ObjectDomain>(data: any, request: RestRequest): any[] {
    const dataDefinition = this.process<ObjectDomain>(data, request);
    const normalizedDefinition = Array.of();
    const processedList = Array.isArray(dataDefinition) ? dataDefinition : Array.of(dataDefinition);

    processedList.forEach((item) => {

      let normalizedItem = Object.assign({}, item);
      // In case data is an Instance of NormalizedWorkspaceItem normalize field value of all the section of type form
      if (item instanceof NormalizedWorkspaceItem
        || item instanceof NormalizedWorkflowItem) {
        if (item.sections) {
          const precessedSection = Object.create({});
          // Iterate over all workspaceitem's sections
          Object.keys(item.sections)
            .forEach((sectionId) => {
              if (typeof item.sections[sectionId] === 'object' && (isNotEmpty(item.sections[sectionId]) &&
                // When Upload section is disabled, add to submission only if there are files
                (!item.sections[sectionId].hasOwnProperty('files') || isNotEmpty((item.sections[sectionId] as any).files)))) {

                const normalizedSectionData = Object.create({});
                // Iterate over all sections property
                Object.keys(item.sections[sectionId])
                  .forEach((metdadataId) => {
                    const entry = item.sections[sectionId][metdadataId];
                    // If entry is not an array, for sure is not a section of type form
                    if (Array.isArray(entry)) {
                      normalizedSectionData[metdadataId] = [];
                      entry.forEach((valueItem, index) => {
                        // Parse value and normalize it
                        const normValue = normalizeSectionData(valueItem, index);
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
          normalizedItem = Object.assign({}, item, { sections: precessedSection });
        }
      }
      normalizedDefinition.push(normalizedItem);
    });

    return normalizedDefinition;
  }

}
