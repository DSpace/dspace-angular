import { FindListOptions } from '../../core/data/request.models';
import { HALResource } from '../../core/shared/hal-resource.model';

/**
 * A class to configure the retrieval of a {@link HALLink}
 */
export class FollowLinkConfig<R extends HALResource> {
  /**
   * The name of the link to fetch.
   * Can only be a {@link HALLink} of the object you're working with
   */
  name: keyof R['_links'];

  /**
   * {@link FindListOptions} for the query,
   * allows you to resolve the link using a certain page, or sorted
   * in a certain way
   */
  findListOptions?: FindListOptions;

  /**
   * A list of {@link FollowLinkConfig}s to
   * use on the retrieved object.
   */
  linksToFollow?: Array<FollowLinkConfig<any>>;

  /**
   * Forward to rest which links we're following, so these can already be embedded
   */
  shouldEmbed? = true;
}

/**
 * A factory function for {@link FollowLinkConfig}s,
 * in order to create them in a less verbose way.
 *
 * @param linkName: the name of the link to fetch.
 * Can only be a {@link HALLink} of the object you're working with
 * @param findListOptions: {@link FindListOptions} for the query,
 * allows you to resolve the link using a certain page, or sorted
 * in a certain way
 * @param linksToFollow: a list of {@link FollowLinkConfig}s to
 * use on the retrieved object.
 * @param shouldEmbed: boolean to check whether to forward info on followLinks to rest,
 * so these can be embedded, default true
 */
export const followLink = <R extends HALResource>(
  linkName: keyof R['_links'],
  findListOptions?: FindListOptions,
  shouldEmbed = true,
  ...linksToFollow: Array<FollowLinkConfig<any>>
): FollowLinkConfig<R> => {
  return {
    name: linkName,
    findListOptions,
    shouldEmbed: shouldEmbed,
    linksToFollow
  }
};
