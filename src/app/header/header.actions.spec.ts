import { HeaderActions } from "./header.actions";
describe("HeaderActions", () => {

  describe("collapse", () => {
    it("should return a COLLAPSE action", () => {
      expect(HeaderActions.collapse().type).toEqual(HeaderActions.COLLAPSE);
    });
  });

  describe("expand", () => {
    it("should return an EXPAND action", () => {
      expect(HeaderActions.expand().type).toEqual(HeaderActions.EXPAND);
    });
  });

  describe("toggle", () => {
    it("should return a TOGGLE action", () => {
      expect(HeaderActions.toggle().type).toEqual(HeaderActions.TOGGLE);
    });
  })

});
