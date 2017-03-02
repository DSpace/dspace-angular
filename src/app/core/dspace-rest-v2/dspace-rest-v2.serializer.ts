import { Serialize, Deserialize } from "cerialize";
import { Serializer } from "../serializer";
import { DSpaceRESTV2Response } from "./dspace-rest-v2-response.model";
import { DSpaceRESTv2Validator } from "./dspace-rest-v2.validator";
import { GenericConstructor } from "../shared/generic-constructor";

/**
 * This Serializer turns responses from v2 of DSpace's REST API
 * to models and vice versa
 */
export class DSpaceRESTv2Serializer<T> implements Serializer<T> {

  /**
   * Create a new DSpaceRESTv2Serializer instance
   *
   * @param modelType a class or interface to indicate
   * the kind of model this serializer should work with
   */
  constructor(private modelType: GenericConstructor<T>) {
  }

  /**
   * Convert a model in to the format expected by the backend
   *
   * @param model The model to serialize
   * @returns An object to send to the backend
   */
  serialize(model: T): DSpaceRESTV2Response {
    return {
      "_embedded": Serialize(model, this.modelType)
    };
  }

  /**
   * Convert an array of models in to the format expected by the backend
   *
   * @param models The array of models to serialize
   * @returns An object to send to the backend
   */
  serializeArray(models: Array<T>): DSpaceRESTV2Response {
    return {
      "_embedded": Serialize(models, this.modelType)
    };
  }

  /**
   * Convert a response from the backend in to a model.
   *
   * @param response An object returned by the backend
   * @returns a model of type T
   */
  deserialize(response: DSpaceRESTV2Response): T {
    // TODO enable validation, once rest data stabilizes
    // new DSpaceRESTv2Validator(response).validate();
    if (Array.isArray(response._embedded)) {
      throw new Error('Expected a single model, use deserializeArray() instead');
    }
    return <T> Deserialize(response._embedded, this.modelType);
  }

  /**
   * Convert a response from the backend in to an array of models
   *
   * @param response An object returned by the backend
   * @returns an array of models of type T
   */
  deserializeArray(response: DSpaceRESTV2Response): Array<T> {
    //TODO enable validation, once rest data stabilizes
    // new DSpaceRESTv2Validator(response).validate();
    if (!Array.isArray(response._embedded)) {
      throw new Error('Expected an Array, use deserialize() instead');
    }
    return <Array<T>> Deserialize(response._embedded, this.modelType);
  }

}
