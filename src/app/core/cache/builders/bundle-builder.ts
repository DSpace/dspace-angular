import { Bundle } from "../../shared/bundle.model";
import { RequestService } from "../../data/request.service";
import { NormalizedBundle } from "../models/normalized-bundle.model";
import { hasValue } from "../../../shared/empty.util";
import { NormalizedBitstream } from "../models/normalized-bitstream.model";
import { RemoteDataBuildService } from "./remote-data-build.service";
import { DomainModelBuilder } from "./domain-model-builder";
import { BitstreamBuilder } from "./bitstream-builder";

export class BundleBuilder extends DomainModelBuilder<NormalizedBundle, Bundle> {
  constructor(
    private requestService: RequestService,
    private rdbService: RemoteDataBuildService,
  ) {
    super();
  }

  build(): Bundle {
    let links: any = {};

    if (hasValue(this.normalized.bitstreams)) {
      this.normalized.bitstreams.forEach((href: string) => {
        setTimeout(() => {
          this.requestService.configure(href, NormalizedBitstream);
        },0);
      });

      links.bitstreams = this.normalized.bitstreams.map((href: string) => {
        return this.rdbService.buildSingle(href, NormalizedBitstream, new BitstreamBuilder(this.requestService, this.rdbService));
      });
    }
    return Object.assign(new Bundle(), this.normalized, links);
  }
}
