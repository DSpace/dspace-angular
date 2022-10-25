import { autoserialize, deserialize } from 'cerialize';
import { typedObject } from '../../cache/builders/build-decorators';
import { CacheableObject } from '../../cache/cacheable-object.model';
import { HALLink } from '../../shared/hal-link.model';
import { ResourceType } from '../../shared/resource-type';
import { excludeFromEquals } from '../../utilities/equals.decorators';
import { WORKFLOW_STEP_STATISTICS } from './workflow-step-statistics.resource-type';

/**
 * Class the represents a Workflow statistics.
 */
 @typedObject
 export class WorkflowStepStatistics extends CacheableObject {

   static type = WORKFLOW_STEP_STATISTICS;

   @excludeFromEquals
   @autoserialize
   type: ResourceType;

   @autoserialize
   id: string;

   @autoserialize
   name: string;

   @autoserialize
   count: number;

   @autoserialize
   actionCounts: Map<string, number>;

   @deserialize
   _links: {
     self: HALLink
   };

 }
