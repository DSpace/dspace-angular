import { FindListOptions } from '../../core/data/request.models';
import { HALResource } from '../../core/shared/hal-resource.model';

export class FollowLinkConfig<R extends HALResource> {
  name: keyof R['_links'];
  findListOptions?: FindListOptions;
  linksToFollow?: Array<FollowLinkConfig<any>>;
}

export const followLink = <R extends HALResource>(
  linkName: keyof R['_links'],
  findListOptions?: FindListOptions,
  ...linksToFollow: Array<FollowLinkConfig<any>>
): FollowLinkConfig<R> => {
  return {
    name: linkName,
    findListOptions,
    linksToFollow
  }
};
