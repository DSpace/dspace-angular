import { ParamHash } from "./param-hash";
describe("ParamHash", () => {

  it("should return a hash for a set of parameters", () => {
    const hash = new ParamHash('azerty', true, 23).toString();

    expect(hash).not.toBeNull();
    expect(hash).not.toBe('');
  });

  it("should work with both simple and complex objects as parameters", () => {
    const hash = new ParamHash('azerty', true, 23, { "a": { "b": ['azerty', true] }, "c": 23 }).toString();

    expect(hash).not.toBeNull();
    expect(hash).not.toBe('');
  });

  it("should work with null or undefined as parameters", () => {
    const hash1 = new ParamHash(undefined).toString();
    const hash2 = new ParamHash(null).toString();
    const hash3 = new ParamHash(undefined, null).toString();

    expect(hash1).not.toBeNull();
    expect(hash1).not.toBe('');
    expect(hash2).not.toBeNull();
    expect(hash2).not.toBe('');
    expect(hash3).not.toBeNull();
    expect(hash3).not.toBe('');
    expect(hash1).not.toEqual(hash2);
    expect(hash1).not.toEqual(hash3);
    expect(hash2).not.toEqual(hash3);
  });

  it("should work if created without parameters", () => {
    const hash1 = new ParamHash().toString();
    const hash2 = new ParamHash().toString();

    expect(hash1).not.toBeNull();
    expect(hash1).not.toBe('');
    expect(hash1).toEqual(hash2);
  });

  it("should create the same hash if created with the same set of parameters in the same order", () => {
    const params = ['azerty', true, 23, { "a": { "b": ['azerty', true] }, "c": 23 }];
    const hash1 = new ParamHash(...params).toString();
    const hash2 = new ParamHash(...params).toString();

    expect(hash1).toEqual(hash2);
  });

  it("should create a different hash if created with the same set of parameters in a different order", () => {
    const params = ['azerty', true, 23, { "a": { "b": ['azerty', true] }, "c": 23 }];
    const hash1 = new ParamHash(...params).toString();
    const hash2 = new ParamHash(...params.reverse()).toString();

    expect(hash1).not.toEqual(hash2);
  });
});
