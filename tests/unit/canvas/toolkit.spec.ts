import { setActivePinia, createPinia } from 'pinia'
import { createTestingPinia } from '@pinia/testing'
import { mount } from "@vue/test-utils";

import Toolkit from "@/components/ToolKitComponent.vue";

beforeEach(() => {
  setActivePinia(createPinia());
});

test("mount component", async () => {
  const pinia = createPinia();
  setActivePinia(pinia);
  
  const wrapper = mount(Toolkit, {
    global: {
      plugins: [createTestingPinia()],
    },
  });
})
