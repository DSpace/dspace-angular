import { DSpaceObject } from "../../shared/dspace-object.model";
import { hasValue, isNotEmpty } from "@dspace/shared/utils";
import { Community } from "../../shared/community.model";
import { Collection } from "../../shared/collection.model";
import { Item } from "../../shared/item.model";
import { URLCombiner } from "../../url-combiner/url-combiner";

export function getDSpaceObjectRoute(dso: DSpaceObject): string {
  if (hasValue(dso)) {
    switch ((dso as any).type) {
      case Community.type.value:
        return new URLCombiner('/communities', dso.uuid).toString();
      case Collection.type.value:
        return new URLCombiner('/collections', dso.uuid).toString();
      case Item.type.value:
        const type = dso.firstMetadataValue('dspace.entity.type');

        if (isNotEmpty(type)) {
          return new URLCombiner('/entities', encodeURIComponent(type.toLowerCase()), dso.uuid).toString();
        } else {
          return new URLCombiner('/items', dso.uuid).toString();
        }
    }
  }
}
