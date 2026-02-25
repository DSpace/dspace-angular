/**
 * The resource type for {@link Filetypes}
 *
 * Needs to be in a separate file to prevent circular dependencies in webpack.
 */
import { ResourceType } from '../shared/resource-type';

export const FILETYPES = new ResourceType('filetypes');
