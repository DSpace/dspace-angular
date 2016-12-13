import { EffectsModule } from "@ngrx/effects";
import { HeaderEffects } from "./header/header.effects";

export const effects = [
  EffectsModule.run(HeaderEffects)
];
