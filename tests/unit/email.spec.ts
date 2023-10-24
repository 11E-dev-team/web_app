import Email from "@/utils/email";
import { ValueError, ValidationError } from "@/errors";

test("Email requires value", () => {
  try {
    expect(new Email()).toThrow(ValueError);
  } catch (e) {
    expect(e).toBeInstanceOf(ValueError);
  };
});

test("Email length check", () => {
  try {
    expect(new Email("")).toThrow(ValueError);
  } catch (e) {
    expect(e).toBeInstanceOf(ValueError);
  };
});

test("Email validation check", () => {
  try {
    expect(new Email("a")).toThrow(ValidationError);
  } catch (e) {
    expect(e).toBeInstanceOf(ValidationError);
  };
})

test("Email can be valid", () => {
  expect(new Email("firstname@domain.com")).toBeInstanceOf(Email);
})
