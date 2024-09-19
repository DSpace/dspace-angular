/* eslint-disable max-classes-per-file */
import { Action } from '@ngrx/store';

import { type } from '../../shared/ngrx/type';

export const MetaTagTypes = {
  ADD: type('dspace/meta-tag/ADD'),
  CLEAR: type('dspace/meta-tag/CLEAR'),
};

export class AddMetaTagAction implements Action {
  type = MetaTagTypes.ADD;
  payload: string;

  constructor(property: string) {
    this.payload = property;
  }
}

export class ClearMetaTagAction implements Action {
  type = MetaTagTypes.CLEAR;
}

export type MetaTagAction = AddMetaTagAction | ClearMetaTagAction;
