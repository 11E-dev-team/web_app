import { setActivePinia, createPinia, storeToRefs } from 'pinia';
setActivePinia(createPinia())
import { useUserStore } from "@/store";

const userStore = useUserStore();

const { user } = storeToRefs(userStore);

import Email from "@/utils/email";
import { ValidationError, ValueError } from "@/errors";

beforeEach(() => {
  user.value = null;
})

describe("User", () => {
  it("can be set", () => {
    expect(user.value).toBe(null);
    user.value = {
      email: new Email("firstname@domain.com"),
    };
    expect(user.value.email.toString()).toBe("firstname@domain.com");
  });

  describe("Email", () => {
    it("requiring value", () => {
      try {
        expect(user.value = {
          email: new Email(),
        }).toThrow(ValueError);
      } catch (e) {
        expect(e).toBeInstanceOf(ValueError);
      };
    });

    it("length check", () => {
      try {
        expect(user.value = {
          email: new Email(""),
        }).toThrow(ValueError);
      } catch (e) {
        expect(e).toBeInstanceOf(ValueError);
      };
    });

    it("validation check", () => {
      try {
        expect(user.value = {
          email: new Email("a"),
        }).toThrow(ValidationError);
      } catch (e) {
        expect(e).toBeInstanceOf(ValidationError);
      };
    })
  });
});
