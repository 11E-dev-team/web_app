import Password from "@/utils/password";
import { ValueError } from "@/errors";

test("Password length check", () => {
  try {
    expect(new Password("")).toThrow(ValueError);
  } catch (e) {
    expect(e).toBeInstanceOf(ValueError);
  };
});

test("Password can be valid", () => {
  expect(new Password("a")).toBeInstanceOf(Password);
})
