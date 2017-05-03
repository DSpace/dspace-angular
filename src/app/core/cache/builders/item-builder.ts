import { Item } from "../../shared/item.model";
import { RequestService } from "../../data/request.service";
import { NormalizedItem } from "../models/normalized-item.model";
import { hasValue } from "../../../shared/empty.util";
import { NormalizedBundle } from "../models/normalized-bundle.model";
import { RemoteDataBuildService } from "./remote-data-build.service";
import { DomainModelBuilder } from "./domain-model-builder";
import { BundleBuilder } from "./bundle-builder";

export class ItemBuilder extends DomainModelBuilder<NormalizedItem, Item> {
  constructor(
    private requestService: RequestService,
    private rdbService: RemoteDataBuildService,
  ) {
    super();
  }

  build(): Item {
    let links: any = {};

    if (hasValue(this.normalized.bundles)) {
      this.normalized.bundles.forEach((href: string) => {
        setTimeout(() => {
          this.requestService.configure(href, NormalizedBundle)
        },0);
      });

      links.bundles = this.normalized.bundles.map((href: string) => {
        return this.rdbService.buildSingle(href, NormalizedBundle, new BundleBuilder(this.requestService, this.rdbService));
      });
    }
    return Object.assign(new Item(), this.normalized, links);
  }
}
