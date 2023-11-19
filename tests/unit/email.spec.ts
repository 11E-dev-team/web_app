import Email from "@/utils/email";
import { ValueError, ValidationError } from "@/errors";

describe("Email", () => {
  it("can be set", () => {
    expect(new Email("firstname@domain.com")).toBeInstanceOf(Email);
  });

  it("can be converted to string", () => {
    expect(new Email("firstname@domain.com").toString()).toBe("firstname@domain.com");
  });

  it("requiring value", () => {
    try {
      expect(new Email()).toThrow(ValueError);
    } catch (e) {
      expect(e).toBeInstanceOf(ValueError);
    };
  });

  it("length check", () => {
    try {
      expect(new Email("")).toThrow(ValueError);
    } catch (e) {
      expect(e).toBeInstanceOf(ValueError);
    };
  });

  it("validation check", () => {
    try {
      expect(new Email("a")).toThrow(ValidationError);
    } catch (e) {
      expect(e).toBeInstanceOf(ValidationError);
    };
  })
})
