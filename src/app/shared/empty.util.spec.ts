import { isEmpty, hasNoValue, hasValue, isNotEmpty } from "./empty.util";

describe("Empty Utils", () => {
  const string: string = 'string';
  const fn: () => void = function () {};
  const object: any = { length: 0 };
  const emptyMap: Map<any, any> = new Map();
  let fullMap: Map<string,string> = new Map();
  fullMap.set('foo', 'bar');

  describe("hasNoValue", () => {
    it("should return true for null", () => {
      expect(hasNoValue(null)).toBe(true);
    });

    it("should return true for undefined", () => {
      expect(hasNoValue(undefined)).toBe(true);
    });

    it("should return false for an empty String", () => {
      expect(hasNoValue('')).toBe(false);
    });

    it("should return false for true", () => {
      expect(hasNoValue(true)).toBe(false);
    });

    it("should return false for false", () => {
      expect(hasNoValue(false)).toBe(false);
    });

    it("should return false for a String", () => {
      expect(hasNoValue(string)).toBe(false);
    });

    it("should return false for a Function", () => {
      expect(hasNoValue(fn)).toBe(false);
    });

    it("should return false for 0", () => {
      expect(hasNoValue(0)).toBe(false);
    });

    it("should return false for an empty Array", () => {
      expect(hasNoValue([])).toBe(false);
    });

    it("should return false for an empty Object", () => {
      expect(hasNoValue({})).toBe(false);
    });

  });

  describe("hasValue", () => {

    it("should return false for null", () => {
      expect(hasValue(null)).toBe(false);
    });

    it("should return false for undefined", () => {
      expect(hasValue(undefined)).toBe(false);
    });

    it("should return true for an empty String", () => {
      expect(hasValue('')).toBe(true);
    });

    it("should return true for false", () => {
      expect(hasValue(false)).toBe(true);
    });

    it("should return true for true", () => {
      expect(hasValue(true)).toBe(true);
    });

    it("should return true for a String", () => {
      expect(hasValue(string)).toBe(true);
    });

    it("should return true for a Function", () => {
      expect(hasValue(fn)).toBe(true);
    });

    it("should return true for 0", () => {
      expect(hasValue(0)).toBe(true);
    });

    it("should return true for an empty Array", () => {
      expect(hasValue([])).toBe(true);
    });

    it("should return true for an empty Object", () => {
      expect(hasValue({})).toBe(true);
    });

  });

  describe("isEmpty", () => {
    it("should return true for null", () => {
      expect(isEmpty(null)).toBe(true);
    });

    it("should return true for undefined", () => {
      expect(isEmpty(undefined)).toBe(true);
    });

    it("should return true for an empty String", () => {
      expect(isEmpty('')).toBe(true);
    });

    it("should return false for a whitespace String", () => {
      expect(isEmpty('  ')).toBe(false);
      expect(isEmpty('\n\t')).toBe(false);
    });

    it("should return false for true", () => {
      expect(isEmpty(true)).toBe(false);
    });

    it("should return false for false", () => {
      expect(isEmpty(false)).toBe(false);
    });

    it("should return false for a String", () => {
      expect(isEmpty(string)).toBe(false);
    });

    it("should return false for a Function", () => {
      expect(isEmpty(fn)).toBe(false);
    });

    it("should return false for 0", () => {
      expect(isEmpty(0)).toBe(false);
    });

    it("should return true for an empty Array", () => {
      expect(isEmpty([])).toBe(true);
    });

    it("should return false for an empty Object", () => {
      expect(isEmpty({})).toBe(false);
    });

    it("should return true for an Object that has zero \'length\'", () => {
      expect(isEmpty(object)).toBe(true);
    });

    it("should return true for an Empty map", () => {
      expect(isEmpty(emptyMap)).toBe(true);
    });

    it("should return false for a Map that is not empty", () => {
      expect(isEmpty(fullMap)).toBe(false);
    });

  });

  describe("isNotEmpty", () => {
    it("should return false for null", () => {
      expect(isNotEmpty(null)).toBe(false);
    });

    it("should return false for undefined", () => {
      expect(isNotEmpty(undefined)).toBe(false);
    });

    it("should return false for an empty String", () => {
      expect(isNotEmpty('')).toBe(false);
    });

    it("should return true for a whitespace String", () => {
      expect(isNotEmpty('  ')).toBe(true);
      expect(isNotEmpty('\n\t')).toBe(true);
    });

    it("should return true for false", () => {
      expect(isNotEmpty(false)).toBe(true);
    });

    it("should return true for true", () => {
      expect(isNotEmpty(true)).toBe(true);
    });

    it("should return true for a String", () => {
      expect(isNotEmpty(string)).toBe(true);
    });

    it("should return true for a Function", () => {
      expect(isNotEmpty(fn)).toBe(true);
    });

    it("should return true for 0", () => {
      expect(isNotEmpty(0)).toBe(true);
    });

    it("should return false for an empty Array", () => {
      expect(isNotEmpty([])).toBe(false);
    });

    it("should return true for an empty Object", () => {
      expect(isNotEmpty({})).toBe(true);
    });

    it("should return false for an Object that has zero length", () => {
      expect(isNotEmpty(object)).toBe(false);
    });

    it("should return false for an Empty map", () => {
      expect(isNotEmpty(emptyMap)).toBe(false);
    });

    it("should return true for a Map that is not empty", () => {
      expect(isNotEmpty(fullMap)).toBe(true);
    });

  });
});


