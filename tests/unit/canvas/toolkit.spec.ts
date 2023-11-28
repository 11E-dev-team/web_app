import { setActivePinia, createPinia } from 'pinia'
import { mount } from "@vue/test-utils";
import { createTestingPinia } from '@pinia/testing';

import Toolkit from "@/components/ToolKitComponent.vue";
import { useCanvasStateStore } from '@/store';
import { Tools, Shapes } from '@/store/public_interfaces';

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

  it("selects cursor",async () => {
    const wrapper = mount(Toolkit, {
      global: {
        plugins: [createTestingPinia()],
      },
    });
    const canvasStore = useCanvasStateStore();

    const cursorButton = wrapper.find("button#cursor");
    cursorButton.trigger("click");

    expect(canvasStore.selectedTool).toBe(Tools.Cursor);
  });

  it("selects text",async () => {
    const wrapper = mount(Toolkit, {
      global: {
        plugins: [createTestingPinia()],
      },
    });
    const canvasStore = useCanvasStateStore();

    const textButton = wrapper.find("button#text");
    textButton.trigger("click");

    expect(canvasStore.selectedTool).toBe(Tools.Text);
  });

  it("selects shapes", async () => {
    const wrapper = mount(Toolkit, {
      global: {
        plugins: [createTestingPinia()],
      },
    });
    const canvasStore = useCanvasStateStore();

    const shapeButton = wrapper.find("button#shapes");
    shapeButton.trigger("click");

    expect(canvasStore.selectedTool).toBe(Tools.Shapes);
  });

  it("selects pen", async () => {
    const wrapper = mount(Toolkit, {
      global: {
        plugins: [createTestingPinia()],
      },
    })
    const canvasStore = useCanvasStateStore();

    const penButton = wrapper.find("button#pen");
    penButton.trigger("click");

    expect(canvasStore.selectedTool).toBe(Tools.Pen);
  });

  it("has delete button", async () => {
    const wrapper = mount(Toolkit, {
      global: {
        plugins: [createTestingPinia()],
      },
    })
    const canvasStore = useCanvasStateStore();

    const deleteButton = wrapper.find("button#delete");
    deleteButton.trigger("click");
  });
});
