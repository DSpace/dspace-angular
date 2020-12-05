import { Group } from './group.model';

/**
 * This class serves as a Data Transfer Model that contains the Group and whether or not it's able to be deleted
 */
export class GroupDtoModel {

  /**
   * The Group linked to this object
   */
  public group: Group;
  /**
   * Whether or not the linked Group is able to be deleted
   */
  public ableToDelete: boolean;

}
