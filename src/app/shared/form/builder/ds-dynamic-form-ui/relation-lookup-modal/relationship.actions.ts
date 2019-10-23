/**
 * The list of RelationshipAction type definitions
 */
import { type } from '../../../../ngrx/type';
import { Action } from '@ngrx/store';
import { Item } from '../../../../../core/shared/item.model';

export const RelationshipActionTypes = {
  ADD_RELATIONSHIP: type('dspace/relationship/ADD_RELATIONSHIP'),
  REMOVE_RELATIONSHIP: type('dspace/relationship/REMOVE_RELATIONSHIP'),
  SET_NAME_VARIANT: type('dspace/relationship/SET_NAME_VARIANT'),
  REMOVE_NAME_VARIANT: type('dspace/relationship/REMOVE_NAME_VARIANT'),
};

/* tslint:disable:max-classes-per-file */

export abstract class RelationshipListAction implements Action {
  type;
  payload: {
    listID: string;
    itemID: string;
  };

  constructor(listID: string, itemID: string) {
    this.payload = { listID, itemID };
  }
}

export class SetNameVariantAction extends RelationshipListAction {
  type = RelationshipActionTypes.SET_NAME_VARIANT;
  payload: {
    listID: string;
    itemID: string;
    nameVariant: string;
  };

  constructor(listID: string, itemID: string, nameVariant: string) {
    super(listID, itemID);
    this.payload.nameVariant = nameVariant;
  }
}

export class RemoveNameVariantAction extends RelationshipListAction {
  type = RelationshipActionTypes.REMOVE_NAME_VARIANT;
  constructor(listID: string, itemID: string, ) {
    super(listID, itemID);
  }
}


/**
 * An ngrx action to create a new relationship
 */
export class AddRelationshipAction implements Action {
  type = RelationshipActionTypes.ADD_RELATIONSHIP;

  payload: {
    item1: Item;
    item2: Item;
    relationshipType: string;
    nameVariant: string;
  };

  /**
   * Create a new AddRelationshipAction
   *
   * @param item1 The first item in the relationship
   * @param item2 The second item in the relationship
   * @param relationshipType The label of the relationshipType
   * @param nameVariant The nameVariant of the relationshipType
   */
  constructor(
    item1: Item,
    item2: Item,
    relationshipType: string,
    nameVariant?: string
  ) {
    this.payload = { item1, item2, relationshipType, nameVariant };
  }
}

/**
 * An ngrx action to remove an existing relationship
 */
export class RemoveRelationshipAction implements Action {
  type = RelationshipActionTypes.REMOVE_RELATIONSHIP;

  payload: {
    item1: Item;
    item2: Item;
    relationshipType: string;
  };

  /**
   * Create a new RemoveRelationshipAction
   *
   * @param item1 The first item in the relationship
   * @param item2 The second item in the relationship
   * @param relationshipType The label of the relationshipType
   */
  constructor(
    item1: Item,
    item2: Item,
    relationshipType: string) {
    this.payload = { item1, item2, relationshipType };
  }
}

/* tslint:enable:max-classes-per-file */

/**
 * A type to encompass all RelationshipActions
 */
export type RelationshipAction
  = AddRelationshipAction
  | RemoveRelationshipAction
