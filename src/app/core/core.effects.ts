import { EffectsModule } from "@ngrx/effects";
import { CollectionDataEffects } from "./data-services/collection-data.effects";
import { ItemDataEffects } from "./data-services/item-data.effects";
import { ObjectCacheEffects } from "./data-services/object-cache.effects";
import { RequestCacheEffects } from "./data-services/request-cache.effects";

export const coreEffects = [
  EffectsModule.run(CollectionDataEffects),
  EffectsModule.run(ItemDataEffects),
  EffectsModule.run(RequestCacheEffects),
  EffectsModule.run(ObjectCacheEffects),
];
