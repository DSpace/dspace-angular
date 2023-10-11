import { ResourceType } from '../../../core/shared/resource-type';
import { CacheableObject } from '../../../core/cache/cacheable-object.model';
import { autoserialize, deserialize } from 'cerialize';
import { LDN_SERVICE } from './ldn-service.resource-type';
import { excludeFromEquals } from '../../../core/utilities/equals.decorators';
import { typedObject } from '../../../core/cache/builders/build-decorators';


@typedObject
export class LdnService extends CacheableObject {
    static type = LDN_SERVICE;

    @excludeFromEquals
    @autoserialize
    type: ResourceType;

    @autoserialize
    id?: number;

    @autoserialize
    name: string;

    @autoserialize
    description: string;

    @autoserialize
    url: string;

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


class NotifyServicePattern {
    @autoserialize
    pattern: string;
    @autoserialize
    constraint?: string;
    @autoserialize
    automatic?: boolean;
}
