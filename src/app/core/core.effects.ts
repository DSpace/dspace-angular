import { EffectsModule } from "@ngrx/effects";
import { CollectionDataEffects } from "./data-services/collection/collection-data.effects";
import { ItemDataEffects } from "./data-services/item/item-data.effects";

export const coreEffects = [
  EffectsModule.run(CollectionDataEffects),
  EffectsModule.run(ItemDataEffects)
];
