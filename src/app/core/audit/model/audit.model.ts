import { CacheableObject } from '../../cache/object-cache.reducer';
import { HALLink } from '../../shared/hal-link.model';
import { autoserialize, deserialize } from 'cerialize';
import { AUDIT } from './audit.resource-type';
import { excludeFromEquals } from '../../utilities/equals.decorators';
import { ResourceType } from '../../shared/resource-type';
import { link, typedObject } from '../../cache/builders/build-decorators';
import { Observable } from 'rxjs/internal/Observable';
import { RemoteData } from '../../data/remote-data';
import { EPERSON } from 'src/app/core/eperson/models/eperson.resource-type';
import { EPerson } from 'src/app/core/eperson/models/eperson.model';
import { DSpaceObject } from 'src/app/core/shared/dspace-object.model';
import { ITEM } from 'src/app/core/shared/item.resource-type';

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
