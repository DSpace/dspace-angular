import { Collection } from "../../shared/collection.model";
import { RequestService } from "../../data/request.service";
import { NormalizedCollection } from "../models/normalized-collection.model";
import { hasValue } from "../../../shared/empty.util";
import { NormalizedItem } from "../models/normalized-item.model";
import { RemoteDataBuildService } from "./remote-data-build.service";
import { DomainModelBuilder } from "./domain-model-builder";
import { ItemBuilder } from "./item-builder";

export class CollectionBuilder extends DomainModelBuilder<NormalizedCollection, Collection> {
  constructor(
    private requestService: RequestService,
    private rdbService: RemoteDataBuildService,
  ) {
    super();
  }

  build(): Collection {
    let links: any = {};

    if (hasValue(this.normalized.items)) {
      this.normalized.items.forEach((href: string) => {
        setTimeout(() => {
          this.requestService.configure(href, NormalizedItem)
        },0);
      });

      links.items = this.normalized.items.map((href: string) => {
        return this.rdbService.buildSingle(href, NormalizedItem, new ItemBuilder(this.requestService, this.rdbService));
      });
    }
    return Object.assign(new Collection(), this.normalized, links);
  }
}
