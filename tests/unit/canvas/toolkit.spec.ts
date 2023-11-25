import { setActivePinia, createPinia, getActivePinia } from 'pinia'
import { createTestingPinia } from '@pinia/testing'
import { mount } from "@vue/test-utils";

import Toolkit from "@/components/ToolKitComponent.vue";
import { createApp } from 'vue';
import AppVue from '@/App.vue';
import router from '@/router';



beforeEach(() => {
  setActivePinia(createPinia())
})

test("mount component", () => {
  const wrapper = mount(Toolkit, {
    global: {
      plugins: [createTestingPinia()],
    },
  });
})
