/**
 * The resource type for {@link Filetypes}
 *
 * Needs to be in a separate file to prevent circular dependencies in webpack.
 */
import { ResourceType } from '../../core/shared/resource-type';

export const FILETYPES = new ResourceType('filetypes');
