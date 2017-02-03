import { Serializer } from "../serializer";
import * as Yayson from "yayson";
import { JSONAPIValidator } from "./json-api.validator";

const yayson = Yayson();
// const Adapter = yayson.Adapter;
const YaysonStore = yayson.Store;
const Presenter = yayson.Presenter;


/**
 * This Serializer turns JSON API documents in to models
 * and vice versa
 */
export class JSONAPISerializer<T> implements Serializer<T>{

  /**
   * Convert a model in to a JSON API document
   *
   * @param model The model to serialize
   * @returns A JSON API document
   */
  serialize(model: T): any {
    return (new Presenter()).render(model);
  }

  /**
   * Convert an array of models in to a JSON API document
   *
   * @param models The array of models to serialize
   * @returns A JSON API document
   */
  serializeArray(models: Array<T>): any {
    return (new Presenter()).render(models);
  }

  /**
   * Convert a JSON API document in to a model.
   *
   * @param response A JSON API document
   * @returns a model of type T
   */
  deserialize(response: any): T {
    JSONAPIValidator.validate(response);
    if (Array.isArray(response.data)) {
      throw new Error('Expected a single model, use deserializeArray() instead')
    }

    let yaysonStore = new YaysonStore();

    // ensures relationship objects are in the store as partial objects
    // that way, when syncing the main model, we'll get an array of IDs
    // instead of an array of null values
    if (response.data && response.data.relationships) {
      Object.keys(response.data.relationships).forEach((key) => {
        yaysonStore.sync(response.data.relationships[key]);
      });
    }

    let result = yaysonStore.sync(response);
    return <T> result;
  }

  /**
   * Convert a JSON API document in to an array of models
   *
   * @param response A JSON API document
   * @returns an array of models of type T
   */
  deserializeArray(response: any): Array<T> {
    JSONAPIValidator.validate(response);
    if (!Array.isArray(response.data)) {
      throw new Error('Expected an Array, use deserialize() instead')
    }

    let yaysonStore = new YaysonStore();

    if (response.data) {
      response.data.forEach((datum) => {
        Object.keys(datum.relationships).forEach((key) => {
          yaysonStore.sync(datum.relationships[key]);
        });
      })
    }


    let any = yaysonStore.sync(response);
    return <Array<T>> any;
  }

}
