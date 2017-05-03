import { Bitstream } from "../../shared/bitstream.model";
import { RequestService } from "../../data/request.service";
import { hasValue } from "../../../shared/empty.util";
import { NormalizedBitstream } from "../models/normalized-bitstream.model";
import { RemoteDataBuildService } from "./remote-data-build.service";
import { DomainModelBuilder } from "./domain-model-builder";

export class BitstreamBuilder extends DomainModelBuilder<NormalizedBitstream, Bitstream> {
  constructor(
    private requestService: RequestService,
    private rdbService: RemoteDataBuildService,
  ) {
    super();
  }

  build(): Bitstream {
    let links: any = {};
     //TODO
    return Object.assign(new Bitstream(), this.normalized, links);
  }
}
