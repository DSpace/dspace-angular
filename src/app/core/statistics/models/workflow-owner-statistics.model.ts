import { autoserialize, deserialize } from 'cerialize';
import { typedObject } from '../../cache/builders/build-decorators';
import { CacheableObject } from '../../cache/cacheable-object.model';
import { HALLink } from '../../shared/hal-link.model';
import { ResourceType } from '../../shared/resource-type';
import { excludeFromEquals } from '../../utilities/equals.decorators';
import { WORKFLOW_OWNER_STATISTICS } from './workflow-owner-statistics.resource-type';

/**
 * Class the represents a Workflow owner statistics.
 */
 @typedObject
 export class WorkflowOwnerStatistics extends CacheableObject {

   static type = WORKFLOW_OWNER_STATISTICS;

   @excludeFromEquals
   @autoserialize
   type: ResourceType;

   @autoserialize
   id: string;

   @autoserialize
   name: string;

   @autoserialize
   email: string;

   @autoserialize
   count: number;

   @autoserialize
   actionCounts: Map<string, number>;

   @deserialize
   _links: {
     self: HALLink
   };

 }
