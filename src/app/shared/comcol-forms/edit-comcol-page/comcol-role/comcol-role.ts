import { Community } from '../../../../core/shared/community.model';
import { Collection } from '../../../../core/shared/collection.model';

/**
 * Class representing a community or collection role.
 */
export class ComcolRole {

  /**
   * The admin role.
   */
  public static ADMIN = new ComcolRole(
    'admin',
    'adminGroup',
  );

  /**
   * @param name      The name for this community or collection role.
   * @param linkName  The path linking to this community or collection role.
   */
  constructor(
    public name,
    public linkName,
  ) {
  }

  /**
   * Get the REST endpoint for managing this role for a given community or collection.
   * @param dso
   */
  public getEndpoint(dso: Community | Collection) {

    let linkPath;
    switch (dso.type + '') {
      case 'community':
        linkPath = 'communities';
        break;
      case 'collection':
        linkPath = 'collections';
        break;
    }

    return `${linkPath}/${dso.uuid}/${this.linkName}`;
  }
}
