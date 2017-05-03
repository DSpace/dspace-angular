import { Bundle } from "../../shared/bundle.model";
import { ObjectCacheService } from "../object-cache.service";
import { ResponseCacheService } from "../response-cache.service";
import { RequestService } from "../../data/request.service";
import { Store } from "@ngrx/store";
import { CoreState } from "../../core.reducers";
import { NormalizedBundle } from "./normalized-bundle.model";
import { ListRemoteDataBuilder, SingleRemoteDataBuilder } from "./remote-data-builder";
import { Request } from "../../data/request.models";
import { hasValue } from "../../../shared/empty.util";
import { RequestConfigureAction, RequestExecuteAction } from "../../data/request.actions";
import { BitstreamRDBuilder } from "./bitstream-builder";
import { NormalizedBitstream } from "./normalized-bitstream.model";

export class BundleBuilder {

    constructor(protected objectCache: ObjectCacheService,
                protected responseCache: ResponseCacheService,
                protected requestService: RequestService,
                protected store: Store<CoreState>,
                protected href: string,
                protected normalized: NormalizedBundle) {
    }

    build(): Bundle {
        let links: any = {};

        if (hasValue(this.normalized.bitstreams)) {
            //for some reason the dispatches in the forEach don't
            //fire without this timeout. A zone issue?
            setTimeout(() => {
                this.normalized.bitstreams.forEach((href: string) => {
                    const isCached = this.objectCache.hasBySelfLink(href);
                    const isPending = this.requestService.isPending(href);

                    if (!(isCached || isPending)) {
                        const request = new Request(href, NormalizedBitstream);
                        this.store.dispatch(new RequestConfigureAction(request));
                        this.store.dispatch(new RequestExecuteAction(href));
                    }
                });
            }, 0);

            links.bitstreams = this.normalized.bitstreams.map((href: string) => {
                return new BitstreamRDBuilder(
                    this.objectCache,
                    this.responseCache,
                    this.requestService,
                    this.store,
                    href
                ).build();
            });
        }

        if (hasValue(this.normalized.primaryBitstream)) {
            const href = this.normalized.primaryBitstream;
            //for some reason the dispatches in the forEach don't
            //fire without this timeout. A zone issue?
            setTimeout(() => {
                const isCached = this.objectCache.hasBySelfLink(href);
                const isPending = this.requestService.isPending(href);

                if (!(isCached || isPending)) {
                    const request = new Request(href, NormalizedBitstream);
                    this.store.dispatch(new RequestConfigureAction(request));
                    this.store.dispatch(new RequestExecuteAction(href));
                }
            }, 0);
            links.primaryBitstream =
                new BitstreamRDBuilder(
                    this.objectCache,
                    this.responseCache,
                    this.requestService,
                    this.store,
                    href
                ).build();
        }
        return Object.assign(new Bundle(), this.normalized, links);
    }
}

export class BundleRDBuilder extends SingleRemoteDataBuilder<Bundle, NormalizedBundle> {

    constructor(objectCache: ObjectCacheService,
                responseCache: ResponseCacheService,
                requestService: RequestService,
                store: Store<CoreState>,
                href: string) {
        super(objectCache, responseCache, requestService, store, href, NormalizedBundle);
    }

    protected normalizedToDomain(normalized: NormalizedBundle): Bundle {
        return new BundleBuilder(this.objectCache, this.responseCache, this.requestService, this.store, this.href, normalized).build();
    }

}

export class BundleListRDBuilder extends ListRemoteDataBuilder<Bundle, NormalizedBundle> {
    constructor(objectCache: ObjectCacheService,
                responseCache: ResponseCacheService,
                requestService: RequestService,
                store: Store<CoreState>,
                href: string) {
        super(objectCache, responseCache, requestService, store, href, NormalizedBundle);
    }

    protected normalizedToDomain(normalized: NormalizedBundle): Bundle {
        return new BundleBuilder(this.objectCache, this.responseCache, this.requestService, this.store, this.href, normalized).build();
    }

}
