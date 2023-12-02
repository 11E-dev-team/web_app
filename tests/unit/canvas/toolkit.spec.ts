import { setActivePinia, createPinia } from 'pinia'
import { mount } from "@vue/test-utils";
import { createTestingPinia } from '@pinia/testing';

import Toolkit from "@/components/ToolKitComponent.vue";
import { useCanvasStateStore } from '@/store';
import { Tools, Shapes } from '@/shared/interfaces';

beforeEach(() => {
  setActivePinia(createPinia());
});

describe("Toolkit", () => {
  it("mount component", async () => {
    const wrapper = mount(Toolkit);
  });

  it("contains buttons", async () => {
    const wrapper = mount(Toolkit);
    expect (wrapper.html()).toContain("button");
  });
});
