import { ResourceType } from '../../../core/shared/resource-type';
import { CacheableObject } from '../../../core/cache/cacheable-object.model';
import { autoserialize, deserialize, deserializeAs, inheritSerialization } from 'cerialize';
import { LDN_SERVICE } from './ldn-service.resource-type';
import { excludeFromEquals } from '../../../core/utilities/equals.decorators';
import { typedObject } from '../../../core/cache/builders/build-decorators';
import { NotifyServicePattern } from './ldn-service-patterns.model';


/** An LdnService  and its properties. */
@typedObject
@inheritSerialization(CacheableObject)
export class LdnService extends CacheableObject {
    static type = LDN_SERVICE;

    @excludeFromEquals
    @autoserialize
    type: ResourceType;

    @autoserialize
    id: number;

    @deserializeAs('id')
    uuid: string;

    @autoserialize
    name: string;

    @autoserialize
    description: string;

    @autoserialize
    url: string;

    @autoserialize
    score: number;

    @autoserialize
    enabled: boolean;

    @autoserialize
    ldnUrl: string;

    @autoserialize
    notifyServiceInboundPatterns?: NotifyServicePattern[];

    @autoserialize
    notifyServiceOutboundPatterns?: NotifyServicePattern[];

    @deserialize
    _links: {
        self: {
            href: string;
        };
    };

    get self(): string {
        return this._links.self.href;
    }
}
