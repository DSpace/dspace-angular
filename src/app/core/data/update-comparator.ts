import { NormalizedObject } from '../cache/models/normalized-object.model';
import { Operation } from 'fast-json-patch/lib/core';

export interface UpdateComparator<TNormalized extends NormalizedObject> {
  compare(object1: TNormalized, object2: TNormalized):  Operation[];
}