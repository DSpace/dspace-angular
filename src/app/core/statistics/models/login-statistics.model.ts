import { autoserialize, deserialize } from 'cerialize';
import { typedObject } from '../../cache/builders/build-decorators';
import { CacheableObject } from '../../cache/cacheable-object.model';
import { HALLink } from '../../shared/hal-link.model';
import { ResourceType } from '../../shared/resource-type';
import { excludeFromEquals } from '../../utilities/equals.decorators';
import { LOGIN_STATISTICS } from './login-statistics.resource-type';

/**
 * Class the represents a Login statistics.
 */
 @typedObject
 export class LoginStatistics extends CacheableObject {

   static type = LOGIN_STATISTICS;

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

   @deserialize
   _links: {
     self: HALLink
   };

 }
