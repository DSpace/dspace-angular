import { EffectsModule } from "@ngrx/effects";
import { HeaderEffects } from "./header/header.effects";

export default [
  EffectsModule.run(HeaderEffects)
];
