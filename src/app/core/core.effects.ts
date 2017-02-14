import { EffectsModule } from "@ngrx/effects";
import { CollectionDataEffects } from "./data-services/collection/collection-data.effects";

export const coreEffects = [
  EffectsModule.run(CollectionDataEffects)
];
