import { Md5 } from "ts-md5/dist/md5";

/**
 * Creates a hash of a set of parameters
 */
export class ParamHash {
  private params: Array<any>;

  constructor(...params) {
    this.params = params;
  }

  /**
   * Returns an md5 hash based on the
   * params passed to the constructor
   *
   * If you hash the same set of params in the
   * same order the hashes will be identical
   *
   * @return {string}
   *    an md5 hash
   */
  toString(): string {
    let hash = new Md5();
    this.params.forEach((param) => {
      if (param === Object(param)) {
        hash.appendStr(JSON.stringify(param));
      }
      else {
        hash.appendStr('' + param);
      }
    });
    return hash.end().toString();
  }
}
