import { setActivePinia, createPinia, storeToRefs } from 'pinia';
setActivePinia(createPinia())
import { useUserStore } from "@/store";

const userStore = useUserStore();

const { user } = storeToRefs(userStore);

import Email from "@/utils/email";
import { ValidationError, ValueError } from "@/errors";

test("User can be set", () => {
  expect(user.value).toBe(null);
  user.value = {
    email: new Email("firstname@domain.com"),
  };
  expect(user.value.email.toString()).toBe("firstname@domain.com");
  user.value = null;
});

test("Email is checked on not null value", () => {
  expect(user.value).toBe(null);
  try {
    expect(user.value = {
      email: new Email(),
    }).toThrow(ValueError);
  } catch (e) {
    expect(e).toBeInstanceOf(ValueError);
  };
  user.value = null;
});

test("Email is checked on not null length", () => {
  expect(user.value).toBe(null);
  try {
    expect(user.value = {
      email: new Email(""),
    }).toThrow(ValueError);
  } catch (e) {
    expect(e).toBeInstanceOf(ValueError);
  };
  user.value = null;
});

test("Email is validated", () => {
  expect(user.value).toBe(null);
  try {
    expect(user.value = {
      email: new Email("a"),
    }).toThrow(ValidationError);
  } catch (e) {
    expect(e).toBeInstanceOf(ValidationError);
  };
  user.value = null;
});
