import { Bitstream } from "../../shared/bitstream.model";
import { ObjectCacheService } from "../object-cache.service";
import { ResponseCacheService } from "../response-cache.service";
import { RequestService } from "../../data/request.service";
import { Store } from "@ngrx/store";
import { CoreState } from "../../core.reducers";
import { NormalizedBitstream } from "./normalized-bitstream.model";
import { ListRemoteDataBuilder, SingleRemoteDataBuilder } from "./remote-data-builder";
import { Request } from "../../data/request.models";
import { hasValue } from "../../../shared/empty.util";
import { RequestConfigureAction, RequestExecuteAction } from "../../data/request.actions";

export class BitstreamBuilder {

  constructor(
    protected objectCache: ObjectCacheService,
    protected responseCache: ResponseCacheService,
    protected requestService: RequestService,
    protected store: Store<CoreState>,
    protected href: string,
    protected normalized: NormalizedBitstream
  ) {
  }

  build(): Bitstream {
    let links: any = {};
    //TODO
    return Object.assign(new Bitstream(), this.normalized, links);
  }
}

export class BitstreamRDBuilder extends SingleRemoteDataBuilder<Bitstream, NormalizedBitstream> {

  constructor(
    objectCache: ObjectCacheService,
    responseCache: ResponseCacheService,
    requestService: RequestService,
    store: Store<CoreState>,
    href: string
  ) {
    super(objectCache, responseCache, requestService, store, href, NormalizedBitstream);
  }

  protected normalizedToDomain(normalized: NormalizedBitstream): Bitstream {
    return new BitstreamBuilder(this.objectCache, this.responseCache, this.requestService, this.store, this.href, normalized).build();
  }

}

export class BitstreamListRDBuilder extends ListRemoteDataBuilder<Bitstream, NormalizedBitstream> {
  constructor(
    objectCache: ObjectCacheService,
    responseCache: ResponseCacheService,
    requestService: RequestService,
    store: Store<CoreState>,
    href: string
  ) {
    super(objectCache, responseCache, requestService, store, href, NormalizedBitstream);
  }

  protected normalizedToDomain(normalized: NormalizedBitstream): Bitstream {
    return new BitstreamBuilder(this.objectCache, this.responseCache, this.requestService, this.store, this.href, normalized).build();
  }

}
