import { Injectable } from '@angular/core';
import { NormalizedObject } from '../models/normalized-object.model';
import { CacheableObject } from '../object-cache.reducer';
import { getRelationships } from './build-decorators';
import { NormalizedObjectFactory } from '../models/normalized-object-factory';
import { map, take } from 'rxjs/operators';
import { hasValue, isNotEmpty } from '../../../shared/empty.util';
import { PaginatedList } from '../../data/paginated-list';

export function isRestDataObject(halObj: any) {
  return isNotEmpty(halObj._links) && hasValue(halObj._links.self);
}

export function isRestPaginatedList(halObj: any) {
  return hasValue(halObj.page) && hasValue(halObj._embedded);
}

export function isPaginatedList(halObj: any) {
  return hasValue(halObj.page) && hasValue(halObj.pageInfo);
}

@Injectable()
export class DataBuildService {
  normalize<TDomain extends CacheableObject, TNormalized extends NormalizedObject>(domainModel: TDomain): TNormalized {
    const normalizedConstructor = NormalizedObjectFactory.getConstructor(domainModel.type);
    const relationships = getRelationships(normalizedConstructor) || [];

    const normalizedModel = Object.assign({}, domainModel) as any;
    relationships.forEach((key: string) => {
      if (hasValue(domainModel[key])) {
        domainModel[key] = undefined;
      }
    });
    return normalizedModel;
  }
}
