import { Injectable } from "@angular/core";
import { DataService } from "./data.service";
import { Community } from "../shared/community.model";
import { ObjectCacheService } from "../cache/object-cache.service";
import { ResponseCacheService } from "../cache/response-cache.service";
import { Store } from "@ngrx/store";
import { NormalizedCommunity } from "../cache/models/normalized-community.model";
import { CoreState } from "../core.reducers";
import { RequestService } from "./request.service";
import { RemoteDataBuildService } from "../cache/builders/remote-data-build.service";

@Injectable()
export class CommunityDataService extends DataService<NormalizedCommunity, Community> {
  protected endpoint = '/core/communities';

  constructor(
    protected objectCache: ObjectCacheService,
    protected responseCache: ResponseCacheService,
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected store: Store<CoreState>
  ) {
      super(NormalizedCommunity);
  }

}
