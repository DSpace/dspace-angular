import { EffectsModule } from "@ngrx/effects";
import { CollectionDataEffects } from "./data-services/collection-data.effects";
import { ItemDataEffects } from "./data-services/item-data.effects";

export const coreEffects = [
  EffectsModule.run(CollectionDataEffects),
  EffectsModule.run(ItemDataEffects)
];
