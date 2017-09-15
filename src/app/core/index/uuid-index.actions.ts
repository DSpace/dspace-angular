import { Action } from '@ngrx/store';

import { type } from '../../shared/ngrx/type';

/**
 * The list of HrefIndexAction type definitions
 */
export const UUIDIndexActionTypes = {
  ADD: type('dspace/core/index/uuid/ADD'),
  REMOVE_HREF: type('dspace/core/index/uuid/REMOVE_HREF')
};

/* tslint:disable:max-classes-per-file */
/**
 * An ngrx action to add an href to the index
 */
export class AddToUUIDIndexAction implements Action {
  type = UUIDIndexActionTypes.ADD;
  payload: {
    href: string;
    uuid: string;
  };

  /**
   * Create a new AddToUUIDIndexAction
   *
   * @param uuid
   *    the uuid to add
   * @param href
   *    the self link of the resource the uuid belongs to
   */
  constructor(uuid: string, href: string) {
    this.payload = { href, uuid };
  }
}

/**
 * An ngrx action to remove an href from the index
 */
export class RemoveHrefFromUUIDIndexAction implements Action {
  type = UUIDIndexActionTypes.REMOVE_HREF;
  payload: string;

  /**
   * Create a new RemoveHrefFromUUIDIndexAction
   *
   * @param href
   *    the href to remove the UUID for
   */
  constructor(href: string) {
    this.payload = href;
  }

}
/* tslint:enable:max-classes-per-file */

/**
 * A type to encompass all HrefIndexActions
 */
export type UUIDIndexAction = AddToUUIDIndexAction | RemoveHrefFromUUIDIndexAction;
