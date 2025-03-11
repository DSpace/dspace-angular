import {
  autoserialize,
  deserialize,
} from 'cerialize';
import { Observable } from 'rxjs';

import {
  link,
  typedObject,
} from '../../cache/builders/build-decorators';
import { CacheableObject } from '../../cache/cacheable-object.model';
import { RemoteData } from '../../data/remote-data';
import { EPerson } from '../../eperson/models/eperson.model';
import { EPERSON } from '../../eperson/models/eperson.resource-type';
import { DSpaceObject } from '../../shared/dspace-object.model';
import { HALLink } from '../../shared/hal-link.model';
import { ITEM } from '../../shared/item.resource-type';
import { ResourceType } from '../../shared/resource-type';
import { excludeFromEquals } from '../../utilities/equals.decorators';
import { AUDIT } from './audit.resource-type';

/**
 * Object representing an Audit.
 */
@typedObject
export class Audit implements CacheableObject {
  static type = AUDIT;

  /**
   * The object type
   */
  @excludeFromEquals
  @autoserialize
    type: ResourceType;

  /**
   * The identifier for this audit
   */
  @autoserialize
    id: string;

  /**
   * The eperson UUID for this audit
   */
  @autoserialize
    epersonUUID: string;

  /**
   * The subject UUID for this audit
   */
  @autoserialize
    subjectUUID: string;

  /**
   * The subject type for this audit
   */
  @autoserialize
    subjectType: string;

  /**
   * The object UUID for this audit
   */
  @autoserialize
    objectUUID: string;

  /**
   * The object type for this audit
   */
  @autoserialize
    objectType: string;

  /**
   * The detail for this audit
   */
  @autoserialize
    detail: string;

  /**
   * The eventType for this audit
   */
  @autoserialize
    eventType: string;

  /**
   * The timestamp for this audit
   */
  @autoserialize
    timeStamp: string;

  /**
   * The {@link HALLink}s for this Audit
   */
  @deserialize
    _links: {
    self: HALLink;
    eperson: HALLink;
    subject: HALLink;
    object: HALLink;
  };

  /**
   * The EPerson for this audit
   * Will be undefined unless the eperson {@link HALLink} has been resolved.
   */
  @link(EPERSON, false)
    eperson?: Observable<RemoteData<EPerson>>;

  /**
   * The Subject for this audit
   * Will be undefined unless the subject {@link HALLink} has been resolved.
   */
  @link(ITEM)
    subject?: Observable<RemoteData<DSpaceObject>>;

  /**
   * The Object for this audit
   * Will be undefined unless the object {@link HALLink} has been resolved.
   */
  @link(ITEM)
    object?: Observable<RemoteData<DSpaceObject>>;
}
