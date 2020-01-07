/**
 * The list of RelationshipAction type definitions
 */
import { type } from '../../../../ngrx/type';
import { Action } from '@ngrx/store';
import { Item } from '../../../../../core/shared/item.model';

export const RelationshipActionTypes = {
  ADD_RELATIONSHIP: type('dspace/relationship/ADD_RELATIONSHIP'),
  REMOVE_RELATIONSHIP: type('dspace/relationship/REMOVE_RELATIONSHIP'),
  UPDATE_RELATIONSHIP: type('dspace/relationship/UPDATE_RELATIONSHIP'),
};

/* tslint:disable:max-classes-per-file */
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

export class UpdateRelationshipAction implements Action {
  type = RelationshipActionTypes.UPDATE_RELATIONSHIP;

  payload: {
    item1: Item;
    item2: Item;
    relationshipType: string;
    nameVariant: string;
  };

  /**
   * Create a new UpdateRelationshipAction
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
