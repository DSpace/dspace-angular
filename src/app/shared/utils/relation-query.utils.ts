import { Item } from '../../core/shared/item.model';
import { Relationship } from '../../core/shared/item-relationships/relationship.model';
import {
  followLink,
  FollowLinkConfig,
} from './follow-link-config.model';

/**
 * Get the query for looking up items by relation type
 * @param {string} relationType   Relation type
 * @param {string} itemUUID       Item UUID
 * @returns {string}              Query
 */
export function getQueryByRelations(relationType: string, itemUUID: string): string {
  return `query=relation.${relationType}:"${itemUUID}"`;
}

/**
 * Get the filter for a relation with the item's UUID
 * @param relationType    The type of relation e.g. 'isAuthorOfPublication'
 * @param itemUUID        The item's UUID
 */
export function getFilterByRelation(relationType: string, itemUUID: string): string {
  return `f.${relationType}=${itemUUID},equals`;
}

/**
 * Creates links to follow for the leftItem and rightItem. Optionally additional links for `thumbnail` & `accessStatus`
 * can be embedded as well.
 *
 * @param showThumbnail    Whether the `thumbnail` needs to be embedded on the {@link Item}
 * @param showAccessStatus Whether the `accessStatus` needs to be embedded on the {@link Item}
 */
export function itemLinksToFollow(showThumbnail: boolean, showAccessStatus: boolean):  FollowLinkConfig<Relationship>[] {
  const conditionalLinksToFollow: FollowLinkConfig<Item>[] = [];
  if (showThumbnail) {
    conditionalLinksToFollow.push(followLink<Item>('thumbnail'));
  }
  if (showAccessStatus) {
    conditionalLinksToFollow.push(followLink<Item>('accessStatus'));
  }
  return [
    followLink('leftItem', undefined, ...conditionalLinksToFollow),
    followLink('rightItem', undefined, ...conditionalLinksToFollow),
  ];
}
