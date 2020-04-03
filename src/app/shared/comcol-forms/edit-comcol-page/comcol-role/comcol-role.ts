import { Community } from '../../../../core/shared/community.model';
import { Collection } from '../../../../core/shared/collection.model';

/**
 * Class representing a community or collection role.
 */
export class ComcolRole {

  /**
   * The community admin role.
   */
  public static COMMUNITY_ADMIN = new ComcolRole(
    'community-admin',
    'adminGroup',
  );

  /**
   * The collection admin role.
   */
  public static COLLECTION_ADMIN = new ComcolRole(
    'collection-admin',
    'adminGroup',
  );

  /**
   * The submitters role.
   */
  public static SUBMITTERS = new ComcolRole(
    'submitters',
    'submittersGroup',
  );

  /**
   * The default item read role.
   */
  public static ITEM_READ = new ComcolRole(
    'item_read',
    'itemReadGroup',
  );

  /**
   * The default bitstream read role.
   */
  public static BITSTREAM_READ = new ComcolRole(
    'bitstream_read',
    'bitstreamReadGroup',
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
