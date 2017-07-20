import { Action } from '@ngrx/store';

import { type } from '../../shared/ngrx/type';

/**
 * The list of HrefIndexAction type definitions
 */
export const HrefIndexActionTypes = {
  ADD: type('dspace/core/index/href/ADD'),
  REMOVE_UUID: type('dspace/core/index/href/REMOVE_UUID')
};

/* tslint:disable:max-classes-per-file */
/**
 * An ngrx action to add an href to the index
 */
export class AddToHrefIndexAction implements Action {
  type = HrefIndexActionTypes.ADD;
  payload: {
    href: string;
    uuid: string;
  };

  /**
   * Create a new AddToHrefIndexAction
   *
   * @param href
   *    the href to add
   * @param uuid
   *    the uuid of the resource the href links to
   */
  constructor(href: string, uuid: string) {
    this.payload = { href, uuid };
  }
}

/**
 * An ngrx action to remove an href from the index
 */
export class RemoveUUIDFromHrefIndexAction implements Action {
  type = HrefIndexActionTypes.REMOVE_UUID;
  payload: string;

  /**
   * Create a new RemoveUUIDFromHrefIndexAction
   *
   * @param uuid
   *    the uuid to remove all hrefs for
   */
  constructor(uuid: string) {
    this.payload = uuid;
  }

}
/* tslint:enable:max-classes-per-file */

/**
 * A type to encompass all HrefIndexActions
 */
export type HrefIndexAction = AddToHrefIndexAction | RemoveUUIDFromHrefIndexAction;
