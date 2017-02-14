import { EffectsModule } from "@ngrx/effects";
import { HeaderEffects } from "./header/header.effects";
import { coreEffects } from "./core/core.effects";

export const effects = [
  ...coreEffects, //TODO should probably be imported in coreModule
  EffectsModule.run(HeaderEffects)
];
