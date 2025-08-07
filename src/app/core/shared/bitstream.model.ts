import { AccessStatusObject } from '@dspace/core/shared/access-status.model';
import { ACCESS_STATUS } from '@dspace/core/shared/access-status.resource-type';
import {
  autoserialize,
  deserialize,
  inheritSerialization,
} from 'cerialize';
import { Observable } from 'rxjs';

import {
  link,
  typedObject,
} from '../cache/builders/build-decorators';
import { RemoteData } from '../data/remote-data';
import { BITSTREAM } from './bitstream.resource-type';
import { BitstreamFormat } from './bitstream-format.model';
import { BITSTREAM_FORMAT } from './bitstream-format.resource-type';
import { Bundle } from './bundle.model';
import { BUNDLE } from './bundle.resource-type';
import { ChildHALResource } from './child-hal-resource.model';
import { DSpaceObject } from './dspace-object.model';
import {
  followLink,
  FollowLinkConfig,
} from './follow-link-config.model';
import { HALLink } from './hal-link.model';

/**
 * The self links defined in this list are expected to be requested somewhere in the near future
 * Requesting them as embeds will limit the number of requests
 */
export const BITSTREAM_PAGE_LINKS_TO_FOLLOW: FollowLinkConfig<Bitstream>[] = [
  followLink('bundle', {}, followLink('primaryBitstream'), followLink('item')),
  followLink('format'),
];

@typedObject
@inheritSerialization(DSpaceObject)
export class Bitstream extends DSpaceObject implements ChildHALResource {
  static type = BITSTREAM;

  /**
   * The size of this bitstream in bytes
   */
  @autoserialize
  sizeBytes: number;

  /**
   * The description of this Bitstream
   */
  @autoserialize
  description: string;

  /**
   * The name of the Bundle this Bitstream is part of
   */
  @autoserialize
  bundleName: string;

  /**
   * The {@link HALLink}s for this Bitstream
   */
  @deserialize
  _links: {
    self: HALLink;
    bundle: HALLink;
    format: HALLink;
    content: HALLink;
    thumbnail: HALLink;
    accessStatus: HALLink;
  };

  /**
   * The thumbnail for this Bitstream
   * Will be undefined unless the thumbnail {@link HALLink} has been resolved.
   */
  @link(BITSTREAM, false, 'thumbnail')
  thumbnail?: Observable<RemoteData<Bitstream>>;

  /**
   * The BitstreamFormat of this Bitstream
   * Will be undefined unless the format {@link HALLink} has been resolved.
   */
  @link(BITSTREAM_FORMAT, false, 'format')
  format?: Observable<RemoteData<BitstreamFormat>>;

  /**
   * The owning bundle for this Bitstream
   * Will be undefined unless the bundle{@link HALLink} has been resolved.
   */
  @link(BUNDLE)
  bundle?: Observable<RemoteData<Bundle>>;

  /**
   * The access status for this Bitstream
   * Will be undefined unless the access status {@link HALLink} has been resolved.
   */
  @link(ACCESS_STATUS, false, 'accessStatus')
  accessStatus?: Observable<RemoteData<AccessStatusObject>>;

  getParentLinkKey(): keyof this['_links'] {
    return 'format';
  }
}
