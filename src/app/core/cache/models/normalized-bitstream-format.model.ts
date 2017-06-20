import { NormalizedObject } from "./normalized-object.model";
import { inheritSerialization } from "cerialize";

@inheritSerialization(NormalizedObject)
export class NormalizedBitstreamFormat extends NormalizedObject {
  //TODO this class was created as a placeholder when we connected to the live rest api

  get uuid(): string {
    return this.self;
  }
}
