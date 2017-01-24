import { Serializer } from "../serializer";
import * as Yayson from "yayson";
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
    let result = (new YaysonStore()).sync(response);
    return <T> result;
  }

  /**
   * Convert a JSON API document in to an array of models
   *
   * @param response A JSON API document
   * @returns an array of models of type T
   */
  deserializeArray(response: any): Array<T> {
    let any = (new YaysonStore()).sync(response);
    return <Array<T>> any;
  }

}
