import { EffectsModule } from "@ngrx/effects";
import { ObjectCacheEffects } from "./data/object-cache.effects";
import { RequestCacheEffects } from "./data/request-cache.effects";
import { HrefIndexEffects } from "./index/href-index.effects";
import { RequestEffects } from "./data/request.effects";

export const coreEffects = [
  EffectsModule.run(RequestEffects),
  EffectsModule.run(ObjectCacheEffects),
  EffectsModule.run(HrefIndexEffects),
];
