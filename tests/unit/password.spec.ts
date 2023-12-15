import Password from "@/utils/password.ts";
import { ValueError } from "@/errors";

describe("Password", () => {
  it("can be set", () => {
    expect(new Password("a")).toBeInstanceOf(Password);
  });

  it("can be converted to string", () => {
    expect(new Password("a").toString()).toBe("a");
  });

  it("requires a value", () => {
    try {
      expect(new Password()).toThrow(ValueError);
    } catch (e) {
      expect(e).toBeInstanceOf(ValueError);
    };
  });
})
