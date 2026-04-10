/**
 * The contents of this file are subject to the license and copyright
 * detailed in the LICENSE and NOTICE files at the root of the source
 * tree and available online at
 *
 * http://www.dspace.org/license/
 */
import {
  autoserialize,
  deserialize,
  deserializeAs,
} from 'cerialize';

import { typedObject } from '../../cache/builders/build-decorators';
import { CacheableObject } from '../../cache/cacheable-object.model';
import { IDToUUIDSerializer } from '../../cache/id-to-uuid-serializer';
import { HALLink } from '../../shared/hal-link.model';
import { ResourceType } from '../../shared/resource-type';
import { excludeFromEquals } from '../../utilities/equals.decorators';

/**
 * Represents a single edit mode available for an existing {@link Item}.
 *
 * Edit modes are returned by the REST API (`/api/submission/edititems/:id/modes`) and define
 * the different ways in which an item can be edited (e.g. full edit, correction, withdraw).
 * Each mode references a specific submission definition that determines which sections and
 * fields are shown in the edit form.
 *
 * Consumed by {@link EditItemDataService} to retrieve available modes for a given item, and
 * used by the edit-item page to build the appropriate submission form via
 * {@link EditItemMenuProvider}.
 */
@typedObject
export class EditItemMode extends CacheableObject {

  static type = new ResourceType('edititemmode');

  /**
   * The object type
   */
  @excludeFromEquals
  @autoserialize
    type: ResourceType;

  /**
   * The universally unique identifier of this WorkspaceItem
   * This UUID is generated client-side and isn't used by the backend.
   * It is based on the ID, so it will be the same for each refresh.
   */
  @deserializeAs(new IDToUUIDSerializer(EditItemMode.type.value), 'name')
    uuid: string;

  /**
   * Name of the EditItem Mode
   */
  @autoserialize
    name: string;

  /**
   * Label used for i18n
   */
  @autoserialize
    label: string;

  /**
   * Name of the Submission Definition used
   * for this EditItem mode
   */
  @autoserialize
    submissionDefinition: string;

  /**
   * The {@link HALLink}s for this EditItemMode
   */
  @deserialize
    _links: {
    self: HALLink;
  };
}
