import { Operation } from 'fast-json-patch/lib/core';
import { compare } from 'fast-json-patch';
import { UpdateComparator } from './update-comparator';
import { NormalizedDSpaceObject } from '../cache/models/normalized-dspace-object.model';
import { Injectable } from '@angular/core';

@Injectable()
export class DSOUpdateComparator implements UpdateComparator<NormalizedDSpaceObject> {
  compare(object1: NormalizedDSpaceObject, object2: NormalizedDSpaceObject): Operation[] {
    return compare(object1.metadata, object2.metadata).map((operation: Operation) => Object.assign({}, operation, { path: '/metadata' + operation.path }));
  }
}
